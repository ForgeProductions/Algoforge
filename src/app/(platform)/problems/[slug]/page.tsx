import { prisma } from "@/lib/db/prisma";
import { notFound } from "next/navigation";
import { getUser } from "@/lib/auth/jwt";
import { cookies } from "next/headers";
import { ProblemWorkspace } from "@/components/problem/ProblemWorkspace";

interface ProblemPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProblemPage({ params }: ProblemPageProps) {
  const resolvedParams = await params;
  const problem = await prisma.problem.findUnique({
    where: { slug: resolvedParams.slug, isPublished: true },
    include: {
      testCases: true
    }
  });

  if (!problem) {
    notFound();
  }

  // Parse JSON fields for SQLite compatibility
  const parsedProblem = {
    ...problem,
    tags: typeof problem.tags === 'string' ? JSON.parse(problem.tags) : problem.tags,
    examples: typeof problem.examples === 'string' ? JSON.parse(problem.examples) : problem.examples,
    hints: typeof problem.hints === 'string' ? JSON.parse(problem.hints) : problem.hints,
    boilerplate: typeof problem.boilerplate === 'string' ? JSON.parse(problem.boilerplate) : problem.boilerplate,
  };

  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  const user = token ? await getUser(token) : null;

  let previousCode = "";
  if (user) {
    const lastSubmission = await prisma.submission.findFirst({
      where: { userId: user.id, problemId: problem.id },
      orderBy: { createdAt: "desc" }
    });
    if (lastSubmission) {
      previousCode = lastSubmission.code;
    }
  }

  return (
    <div className="h-[calc(100vh-4rem)] w-full overflow-hidden bg-surface-base">
      <ProblemWorkspace
        problem={parsedProblem}
        testCases={problem.testCases}
        user={user}
        previousCode={previousCode}
      />
    </div>
  );
}
