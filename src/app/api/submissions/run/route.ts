import { prisma } from "@/lib/db/prisma";
import { verifyAccessToken } from "@/lib/auth/jwt";
import { runCodeSchema } from "@/lib/validations/submission";
import { successResponse, unauthorizedResponse, validationErrorResponse, errorResponse } from "@/lib/utils/api-response";
import { logger } from "@/lib/utils/logger";
import { processJob } from "@/lib/execution/service";
import { v4 as uuidv4 } from "uuid";

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
    const parsed = runCodeSchema.safeParse(body);
    if (!parsed.success) {
      return validationErrorResponse("Invalid input", parsed.error.flatten().fieldErrors);
    }

    const { problemId, code, language, testCases: customTestCases } = parsed.data;

    // Get test cases - use custom or fetch example ones
    let testCases = customTestCases;
    if (!testCases || testCases.length === 0) {
      const dbTestCases = await prisma.testCase.findMany({
        where: { problemId, isExample: true },
        orderBy: { order: "asc" },
      });
      testCases = dbTestCases.map((tc: any) => ({
        input: tc.input,
        expectedOutput: tc.expectedOutput,
      }));
    }

    // Execute synchronously
    const runId = uuidv4();
    logger.info("Code run requested", { userId: payload.userId, problemId, language, runId });

    const executionResult = await processJob({
      submissionId: runId, // using a temporary uuid for run jobs
      problemId,
      code,
      language: language as "PYTHON" | "CPP" | "JAVA" | "JAVASCRIPT",
      type: "RUN",
      userId: payload.userId,
      customTestCases: testCases
    });

    return successResponse(executionResult, 200);
  } catch (error) {
    logger.error("Run code failed", error);
    return errorResponse("INTERNAL_ERROR", "Code execution failed", 500);
  }
}
