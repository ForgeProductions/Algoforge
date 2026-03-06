import { GradientText } from "@/components/shared/GradientText";
import { GlassCard } from "@/components/shared/GlassCard";
import { TrackAccordion } from "@/components/tracks/TrackAccordion";
import { ProgressTracker } from "@/components/tracks/ProgressTracker";
import { StreakCalendar } from "@/components/tracks/StreakCalendar";
import { prisma } from "@/lib/db/prisma";
import { getUser } from "@/lib/auth/jwt";
import { cookies } from "next/headers";

import { TrackFilters } from "@/components/tracks/TrackFilters";

export const revalidate = 60;

export default async function DSATrackPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; difficulty?: string; topic?: string }>;
}) {
  const params = await searchParams;
  const query = params.q?.toLowerCase();
  const difficultyFilter = params.difficulty?.toUpperCase();
  const topicFilter = params.topic;

  const topics = await prisma.topic.findMany({
    where: {
      track: "DSA",
      ...(topicFilter ? { slug: topicFilter } : {})
    },
    orderBy: { order: "asc" },
    include: {
      subtopics: {
        orderBy: { order: "asc" },
        include: {
          problems: {
            where: {
              isPublished: true,
              ...(difficultyFilter ? { difficulty: difficultyFilter as any } : {}),
              ...(query ? { title: { contains: query } } : {}),
            },
            orderBy: { order: "asc" },
            select: {
              id: true, title: true, slug: true,
              difficulty: true, platformSource: true,
              platformUrl: true, rating: true,
            }
          }
        }
      },
      // Also get problems linked directly to the topic (no subtopic)
      problems: {
        where: {
          isPublished: true,
          subtopicId: null,
          ...(difficultyFilter ? { difficulty: difficultyFilter as any } : {}),
          ...(query ? { title: { contains: query } } : {}),
        },
        orderBy: { order: "asc" },
        select: {
          id: true, title: true, slug: true,
          difficulty: true, platformSource: true,
          platformUrl: true, rating: true,
        }
      }
    }
  });

  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  const user = token ? await getUser(token) : null;

  let solvedProblemIds = new Set<string>();
  let activeDates: string[] = [];
  let currentStreak = 0;
  let bestStreak = 0;

  if (user) {
    const progress = await prisma.userProgress.findMany({
      where: { userId: user.id, status: "SOLVED" },
      select: { problemId: true }
    });
    solvedProblemIds = new Set(progress.map(p => p.problemId));

    // Fetch streak data from user model
    const userData = await prisma.user.findUnique({
      where: { id: user.id },
      select: { streak: true, longestStreak: true }
    });
    currentStreak = userData?.streak || 0;
    bestStreak = userData?.longestStreak || 0;

    // Get submission dates for calendar highlighting
    const submissions = await prisma.submission.findMany({
      where: { userId: user.id, status: "ACCEPTED" },
      select: { createdAt: true },
      orderBy: { createdAt: "desc" },
    });
    const dateSet = new Set<string>();
    for (const sub of submissions) {
      dateSet.add(sub.createdAt.toISOString().split("T")[0]);
    }
    activeDates = Array.from(dateSet);
  }

  // Compute difficulty counts across ALL problems in the track
  const allProblems = topics.flatMap(t => [
    ...t.problems,
    ...t.subtopics.flatMap(s => s.problems),
  ]);

  const totalEasy = allProblems.filter(p => p.difficulty === "EASY").length;
  const totalMedium = allProblems.filter(p => p.difficulty === "MEDIUM").length;
  const totalHard = allProblems.filter(p => p.difficulty === "HARD").length;
  const total = allProblems.length;

  const solvedEasy = allProblems.filter(p => p.difficulty === "EASY" && solvedProblemIds.has(p.id)).length;
  const solvedMedium = allProblems.filter(p => p.difficulty === "MEDIUM" && solvedProblemIds.has(p.id)).length;
  const solvedHard = allProblems.filter(p => p.difficulty === "HARD" && solvedProblemIds.has(p.id)).length;

  // Merge topic-level problems into a virtual "Problems" subtopic
  const topicsWithProgress = topics.map(topic => {
    const subtopics = topic.subtopics.map(subtopic => ({
      ...subtopic,
      problems: subtopic.problems.map(problem => ({
        ...problem,
        isSolved: solvedProblemIds.has(problem.id)
      }))
    }));

    // Add topic-level problems as a virtual subtopic if any exist
    if (topic.problems.length > 0) {
      subtopics.push({
        id: `${topic.id}-direct`,
        name: "Problems",
        slug: "problems",
        description: null,
        problems: topic.problems.map(problem => ({
          ...problem,
          isSolved: solvedProblemIds.has(problem.id)
        }))
      } as any);
    }

    return { ...topic, subtopics };
  });

  // Filter out topics with no problems at all (unless they were explicitly filtered by topic)
  const nonEmptyTopics = topicsWithProgress.filter(
    t => t.subtopics.some(s => s.problems.length > 0)
  );

  // Get all topics for the filter dropdown
  const allTopicsForFilter = await prisma.topic.findMany({
    where: { track: "DSA" },
    select: { name: true, slug: true },
    orderBy: { order: "asc" }
  });

  const isFiltered = !!(query || difficultyFilter || topicFilter);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">
          <GradientText>DSA Track: Algoforge DSA Sheet</GradientText>
        </h1>
        <p className="mt-2 text-text-secondary">
          Master Data Structures & Algorithms with structured, topic-wise learning.
        </p>
      </div>

      {/* Progress Tracker + Streak Calendar */}
      <div className="grid gap-6 lg:grid-cols-2">
        <GlassCard>
          <h2 className="text-lg font-semibold text-text-primary mb-4">Progress</h2>
          <ProgressTracker
            total={total}
            easy={totalEasy}
            medium={totalMedium}
            hard={totalHard}
            solvedEasy={solvedEasy}
            solvedMedium={solvedMedium}
            solvedHard={solvedHard}
          />
        </GlassCard>
        <GlassCard>
          <StreakCalendar
            activeDates={activeDates}
            currentStreak={currentStreak}
            bestStreak={bestStreak}
          />
        </GlassCard>
      </div>

      {/* Search & Filters */}
      <TrackFilters topics={allTopicsForFilter} />

      <div className="w-full max-w-5xl">
        {nonEmptyTopics.length > 0 ? (
          <TrackAccordion
            topics={nonEmptyTopics}
            defaultExpanded={isFiltered}
          />
        ) : (
          <div className="text-center py-12 bg-white/5 rounded-xl border border-white/10">
            <p className="text-text-muted">No problems found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
