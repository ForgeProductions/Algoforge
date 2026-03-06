import { GradientText } from "@/components/shared/GradientText";
import { prisma } from "@/lib/db/prisma";
import { getUser } from "@/lib/auth/jwt";
import { cookies } from "next/headers";
import Link from "next/link";
import { CheckCircle2, Circle } from "lucide-react";
import { ProblemsFilters } from "@/components/problem/ProblemsFilters";
import { GlassCard } from "@/components/shared/GlassCard";
import { ProgressTracker } from "@/components/tracks/ProgressTracker";
import { StreakCalendar } from "@/components/tracks/StreakCalendar";

export const revalidate = 60;

const DIFF_COLORS: Record<string, string> = {
    EASY: "text-accent-green bg-accent-green/10",
    MEDIUM: "text-accent-yellow bg-accent-yellow/10",
    HARD: "text-red-400 bg-red-500/10",
};

export default async function ProblemsPage({
    searchParams,
}: {
    searchParams: Promise<{
        difficulty?: string;
        track?: string;
        tag?: string;
        page?: string;
        q?: string;
    }>;
}) {
    const params = await searchParams;
    const difficulty = params.difficulty;
    const track = params.track;
    const tag = params.tag;
    const query = params.q?.toLowerCase();
    const pageNum = parseInt(params.page || "1", 10);
    const pageSize = 25;

    // Build filter for pagination list
    const where: any = { isPublished: true };
    if (difficulty) where.difficulty = difficulty.toUpperCase();
    if (track) where.trackType = track.toUpperCase();

    if (query) {
        where.OR = [
            { title: { contains: query } },
            { slug: { contains: query } }
        ];
    }

    if (tag) {
        where.tags = { contains: `"${tag}"` };
    }

    // Fetch metrics and problems in parallel
    const [problems, totalFilteredCount, allTrackProblems] = await Promise.all([
        prisma.problem.findMany({
            where,
            select: {
                id: true, title: true, slug: true, difficulty: true,
                platformSource: true, platformUrl: true, tags: true,
                trackType: true, rating: true,
            },
            orderBy: [{ trackType: "asc" }, { difficulty: "asc" }, { order: "asc" }],
            skip: (pageNum - 1) * pageSize,
            take: pageSize,
        }),
        prisma.problem.count({ where }),
        prisma.problem.findMany({
            where: { isPublished: true },
            select: { id: true, difficulty: true }
        })
    ]);

    const totalPages = Math.ceil(totalFilteredCount / pageSize);

    // Get user progress and streak data
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    const user = token ? await getUser(token) : null;

    let solvedIds = new Set<string>();
    let activeDates: string[] = [];
    let currentStreak = 0;
    let bestStreak = 0;

    if (user) {
        const [progress, userData, submissions] = await Promise.all([
            prisma.userProgress.findMany({
                where: { userId: user.id, status: "SOLVED" },
                select: { problemId: true }
            }),
            prisma.user.findUnique({
                where: { id: user.id },
                select: { streak: true, longestStreak: true }
            }),
            prisma.submission.findMany({
                where: { userId: user.id, status: "ACCEPTED" },
                select: { createdAt: true },
                orderBy: { createdAt: "desc" },
            })
        ]);

        solvedIds = new Set(progress.map(p => p.problemId));
        currentStreak = userData?.streak || 0;
        bestStreak = userData?.longestStreak || 0;

        const dateSet = new Set<string>();
        for (const sub of submissions) {
            dateSet.add(sub.createdAt.toISOString().split("T")[0]);
        }
        activeDates = Array.from(dateSet);
    }

    // Compute global metrics
    const totalEasy = allTrackProblems.filter(p => p.difficulty === "EASY").length;
    const totalMedium = allTrackProblems.filter(p => p.difficulty === "MEDIUM").length;
    const totalHard = allTrackProblems.filter(p => p.difficulty === "HARD").length;

    const solvedEasy = allTrackProblems.filter(p => p.difficulty === "EASY" && solvedIds.has(p.id)).length;
    const solvedMedium = allTrackProblems.filter(p => p.difficulty === "MEDIUM" && solvedIds.has(p.id)).length;
    const solvedHard = allTrackProblems.filter(p => p.difficulty === "HARD" && solvedIds.has(p.id)).length;

    // Get all unique tags for filter
    const tagQuery = await prisma.problem.findMany({
        where: { isPublished: true },
        select: { tags: true },
    });

    const tagSet = new Set<string>();
    tagQuery.forEach(p => {
        try {
            const parsedTags = typeof p.tags === 'string' ? JSON.parse(p.tags) : p.tags;
            if (Array.isArray(parsedTags)) {
                parsedTags.forEach(t => tagSet.add(t));
            }
        } catch (e) {
            console.error("Failed to parse tags", e);
        }
    });
    const allTags = Array.from(tagSet).sort();

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        <GradientText>All Problems</GradientText>
                    </h1>
                    <p className="mt-1 text-sm text-text-secondary">
                        Browse and solve problems from across all tracks.
                    </p>
                </div>
            </div>

            {/* Global Progress Tracking */}
            <div className="grid gap-6 lg:grid-cols-2">
                <GlassCard>
                    <h2 className="text-lg font-semibold text-text-primary mb-4">Global Progress</h2>
                    <ProgressTracker
                        total={allTrackProblems.length}
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

            {/* Reusable Filters Component */}
            <ProblemsFilters allTags={allTags} />

            {/* Problems Table */}
            <div className="rounded-xl border border-white/10 overflow-hidden">
                {/* Header */}
                <div className="grid grid-cols-[40px_1fr_100px_100px_100px] gap-4 items-center px-4 py-2 bg-white/5 text-xs font-semibold uppercase text-text-muted tracking-wider">
                    <span></span>
                    <span>Title</span>
                    <span>Difficulty</span>
                    <span>Track</span>
                    <span>Platform</span>
                </div>

                {/* Rows */}
                {problems.map((problem, idx) => {
                    const isSolved = solvedIds.has(problem.id);
                    return (
                        <Link
                            key={problem.slug}
                            href={`/problems/${problem.slug}`}
                            className={`grid grid-cols-[40px_1fr_100px_100px_100px] gap-4 items-center px-4 py-3 text-sm transition-colors hover:bg-white/5 ${idx % 2 === 0 ? "bg-transparent" : "bg-white/[0.02]"
                                }`}
                        >
                            <div className="flex justify-center">
                                {isSolved ? (
                                    <CheckCircle2 className="h-4 w-4 text-accent-green" />
                                ) : (
                                    <Circle className="h-4 w-4 text-text-muted/30" />
                                )}
                            </div>
                            <span className="text-text-primary font-medium truncate">{problem.title}</span>
                            <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium text-center ${DIFF_COLORS[problem.difficulty]}`}>
                                {problem.difficulty}
                            </span>
                            <span className="text-xs text-text-muted">{problem.trackType}</span>
                            <span className="text-xs text-text-muted">{problem.platformSource}</span>
                        </Link>
                    );
                })}

                {problems.length === 0 && (
                    <div className="flex h-32 items-center justify-center text-text-muted">
                        No problems match these filters
                    </div>
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                        <Link
                            key={p}
                            href={`/problems?${new URLSearchParams({
                                ...(difficulty ? { difficulty } : {}),
                                ...(track ? { track } : {}),
                                ...(tag ? { tag } : {}),
                                ...(params.q ? { q: params.q } : {}),
                                page: String(p)
                            }).toString()}`}
                            className={`flex h-8 w-8 items-center justify-center rounded-md text-sm transition-colors ${p === pageNum
                                ? "bg-accent-cyan text-black font-bold"
                                : "bg-white/5 text-text-muted hover:bg-white/10"
                                }`}
                        >
                            {p}
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
