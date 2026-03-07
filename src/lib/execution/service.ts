import { differenceInCalendarDays } from "date-fns";
import { prisma } from "@/lib/db/prisma";
import { runCodeLocally } from "./docker";
import { logger } from "../utils/logger";

export async function processJob(job: any) {
    logger.info(`Processing job for submission ${job.submissionId}`);

    try {
        // 1. Fetch test cases if not provided (run vs submit)
        let testCases = job.customTestCases;
        if (!testCases) {
            // For SUBMIT: use ALL test cases (including hidden)
            // For RUN: use only visible (example) test cases
            const dbTestCases = await prisma.testCase.findMany({
                where: { problemId: job.problemId, ...(job.type === "RUN" ? { isHidden: false } : {}) },
                orderBy: { order: "asc" }
            });
            testCases = dbTestCases.map((tc: any) => ({
                input: tc.input,
                expectedOutput: tc.expectedOutput
            }));
        }

        if (testCases.length === 0) {
            logger.warn(`No test cases found for problem ${job.problemId}, failing submission.`);
            if (job.type === "SUBMIT") {
                await updateSubmissionStatus(job.submissionId, "INTERNAL_ERROR", "No test cases configured.");
                return { status: "INTERNAL_ERROR", errorMessage: "No test cases configured." };
            }
            return { status: "INTERNAL_ERROR", errorMessage: "No test cases configured." };
        }

        if (job.type === "SUBMIT") {
            // Mark as running
            await prisma.submission.update({
                where: { id: job.submissionId },
                data: { status: "RUNNING" }
            });
        }

        // 2. Execute Code
        const result = await runCodeLocally(job.code, job.language, testCases);

        // 3. Update result
        if (job.type === "SUBMIT") {
            await prisma.submission.update({
                where: { id: job.submissionId },
                data: {
                    status: result.status,
                    runtime: result.runtime,
                    memory: result.memory,
                    testsPassed: result.testsPassed,
                    testsTotal: result.testsTotal,
                    errorMessage: result.errorMessage,
                    failedTestCase: result.failedTestCase ? (result.failedTestCase as any) : null,
                }
            });

            // 4. Update user progress if accepted
            if (result.status === "ACCEPTED") {
                await updateProgress(job.userId, job.problemId, result);
            } else {
                // just update attempt count if attempted for first time
                await updateAttemptCount(job.userId, job.problemId);
            }
        }

        logger.info(`Job ${job.submissionId} completed with status ${result.status}`);
        return result;

    } catch (err: any) {
        logger.error(`Job processing failed for ${job.submissionId}:`, err);
        if (job.type === "SUBMIT") {
            await updateSubmissionStatus(job.submissionId, "INTERNAL_ERROR", err.message || "Failed during processing");
        }
        return { status: "INTERNAL_ERROR", errorMessage: err.message || "Failed during processing" };
    }
}

async function updateSubmissionStatus(submissionId: string, status: any, message: string) {
    await prisma.submission.update({
        where: { id: submissionId },
        data: { status, errorMessage: message }
    });
}

async function updateProgress(userId: string, problemId: string, result: any) {
    const existing = await prisma.userProgress.findUnique({
        where: { userId_problemId: { userId, problemId } }
    });

    // Get problem difficulty for XP calculation
    const problem = await prisma.problem.findUnique({
        where: { id: problemId },
        select: { difficulty: true }
    });

    const XP_BY_DIFFICULTY: Record<string, number> = {
        EASY: 10,
        MEDIUM: 25,
        HARD: 50,
    };
    const xpReward = XP_BY_DIFFICULTY[problem?.difficulty || "EASY"] || 10;

    if (existing) {
        const isFirstSolve = existing.status !== "SOLVED";
        await prisma.userProgress.update({
            where: { id: existing.id },
            data: {
                status: "SOLVED",
                bestRuntime: existing.bestRuntime ? Math.min(existing.bestRuntime, result.runtime) : result.runtime,
                bestMemory: existing.bestMemory ? Math.min(existing.bestMemory, result.memory) : result.memory,
                lastAttemptAt: new Date(),
                solvedAt: isFirstSolve ? new Date() : existing.solvedAt,
                attempts: existing.attempts + 1
            }
        });

        if (isFirstSolve) {
            await awardXPAndStreak(userId, xpReward);
        }
    } else {
        await prisma.userProgress.create({
            data: {
                userId, problemId, status: "SOLVED",
                bestRuntime: result.runtime,
                bestMemory: result.memory,
                attempts: 1,
                solvedAt: new Date()
            }
        });
        await awardXPAndStreak(userId, xpReward);
    }
}

async function awardXPAndStreak(userId: string, xpReward: number) {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { xp: true, level: true, streak: true, longestStreak: true, lastActiveDate: true }
    });
    if (!user) return;

    const today = new Date();
    let newStreak = user.streak;
    const lastActive = user.lastActiveDate;

    if (lastActive) {
        const diffDays = differenceInCalendarDays(today, new Date(lastActive));

        if (diffDays === 1) {
            newStreak = user.streak + 1; // consecutive day
        } else if (diffDays > 1) {
            newStreak = 1; // streak broken
        }
        // If diffDays === 0, it's the same day, we maintain the current streak
    } else {
        newStreak = 1; // first ever solve
    }

    const newXp = user.xp + xpReward;
    const newLevel = Math.floor(newXp / 100) + 1; // level up every 100 XP

    await prisma.user.update({
        where: { id: userId },
        data: {
            xp: newXp,
            level: newLevel,
            streak: newStreak,
            longestStreak: Math.max(user.longestStreak, newStreak),
            lastActiveDate: new Date(),
        }
    });

    logger.info(`User ${userId}: +${xpReward}XP, streak=${newStreak}, level=${newLevel}`);
}

async function updateAttemptCount(userId: string, problemId: string) {
    const existing = await prisma.userProgress.findUnique({
        where: { userId_problemId: { userId, problemId } }
    });

    if (existing) {
        await prisma.userProgress.update({
            where: { id: existing.id },
            data: {
                attempts: existing.attempts + 1,
                lastAttemptAt: new Date()
            }
        });
    } else {
        await prisma.userProgress.create({
            data: {
                userId, problemId, status: "ATTEMPTED",
                attempts: 1
            }
        });
    }
}


