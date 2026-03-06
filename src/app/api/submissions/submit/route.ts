import { prisma } from "@/lib/db/prisma";
import { verifyAccessToken } from "@/lib/auth/jwt";
import { submitCodeSchema } from "@/lib/validations/submission";
import { successResponse, unauthorizedResponse, validationErrorResponse, errorResponse } from "@/lib/utils/api-response";
import { logger } from "@/lib/utils/logger";
import { processJob } from "@/lib/execution/service";

export async function POST(request: Request) {
  try {
    // Auth check
    const authHeader = request.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return unauthorizedResponse();
    }
    let payload;
    try {
      payload = verifyAccessToken(authHeader.split(" ")[1]);
    } catch {
      return unauthorizedResponse("Invalid or expired token");
    }

    const body = await request.json();
    const parsed = submitCodeSchema.safeParse(body);
    if (!parsed.success) {
      return validationErrorResponse("Invalid input", parsed.error.flatten().fieldErrors);
    }

    const { problemId, code, language } = parsed.data;

    // Verify problem exists
    const problem = await prisma.problem.findUnique({ where: { id: problemId } });
    if (!problem) {
      return errorResponse("NOT_FOUND", "Problem not found", 404);
    }

    // Count total test cases
    const totalTests = await prisma.testCase.count({ where: { problemId } });

    // Create submission record
    const submission = await prisma.submission.create({
      data: {
        userId: payload.userId,
        problemId,
        code,
        language: language as "PYTHON" | "CPP" | "JAVA" | "JAVASCRIPT",
        status: "PENDING",
        testsTotal: totalTests,
      },
    });

    logger.info("Submission created", { submissionId: submission.id, userId: payload.userId, problemId });

    // Execute synchronously
    const executionResult = await processJob({
      submissionId: submission.id,
      problemId,
      code,
      language: language as "PYTHON" | "CPP" | "JAVA" | "JAVASCRIPT",
      type: "SUBMIT",
      userId: payload.userId,
    });

    return successResponse({ submissionId: submission.id, ...executionResult }, 200);
  } catch (error) {
    logger.error("Submit code failed", error);
    return errorResponse("INTERNAL_ERROR", "Submission failed", 500);
  }
}
