import { spawn } from "child_process";
import * as fs from "fs/promises";
import * as path from "path";
import { v4 as uuidv4 } from "uuid";

export const LANGUAGE_CONFIG = {
    PYTHON: {
        filename: "solution.py",
        compileCmd: null,
        runCmd: ["python", "solution.py"],
    },
    JAVASCRIPT: {
        filename: "solution.js",
        compileCmd: null,
        runCmd: ["node", "solution.js"],
    },
    CPP: {
        filename: "solution.cpp",
        compileCmd: ["g++", "-O2", "-o", "solution.exe", "solution.cpp"],
        runCmd: ["solution.exe"],
    },
    JAVA: {
        filename: "Solution.java",
        compileCmd: ["javac", "Solution.java"],
        runCmd: ["java", "Solution"],
    },
};

export interface TestCaseResult {
    input: string;
    expectedOutput: string;
    actualOutput: string;
    passed: boolean;
    executionTime: number;
    memoryUsed: number;
}

export interface ExecutionResult {
    status: "ACCEPTED" | "WRONG_ANSWER" | "TIME_LIMIT_EXCEEDED" | "RUNTIME_ERROR" | "COMPILATION_ERROR" | "INTERNAL_ERROR";
    testsTotal: number;
    testsPassed: number;
    runtime: number;
    memory: number;
    errorMessage: string | null;
    failedTestCase: { input: string; expectedOutput: string; actualOutput: string } | null;
    testResults: TestCaseResult[];
}

export async function runCodeLocally(
    code: string,
    language: "PYTHON" | "CPP" | "JAVA" | "JAVASCRIPT",
    testCases: { input: string; expectedOutput: string }[]
): Promise<ExecutionResult> {
    const config = LANGUAGE_CONFIG[language];
    const runId = uuidv4();
    const hostTempDir = path.join(process.cwd(), "tmp", "executions", runId);

    try {
        await fs.mkdir(hostTempDir, { recursive: true });
        await fs.writeFile(path.join(hostTempDir, config.filename), code);

        // Compile
        if (config.compileCmd) {
            const [cmd, ...args] = config.compileCmd;
            const compileOutput = await spawnAsync(cmd, args, hostTempDir, null);
            if (compileOutput.exitCode !== 0) {
                return {
                    status: "COMPILATION_ERROR",
                    testsTotal: testCases.length,
                    testsPassed: 0,
                    runtime: 0,
                    memory: 0,
                    errorMessage: "Compilation Error:\n" + compileOutput.stderr,
                    failedTestCase: null,
                    testResults: [],
                };
            }
        }

        const testResults: TestCaseResult[] = [];
        let testsPassed = 0;
        let maxRuntime = 0;
        let firstFailed: ExecutionResult["failedTestCase"] | null = null;
        let overallStatus: ExecutionResult["status"] = "ACCEPTED";
        let errorMsg: string | null = null;

        for (const tc of testCases) {
            let cmdStr = config.runCmd[0];
            let cmdArgs = config.runCmd.slice(1);

            // For CPP on Windows, runCmd is just solution.exe which needs to be executed from current dir
            if (language === "CPP" && cmdStr === "solution.exe") {
                cmdStr = path.join(hostTempDir, "solution.exe");
            }

            const startTime = Date.now();
            const execOutput = await spawnAsync(cmdStr, cmdArgs, hostTempDir, tc.input, 5000);
            const duration = Date.now() - startTime;

            if (execOutput.isTle) {
                return {
                    status: "TIME_LIMIT_EXCEEDED",
                    testsTotal: testCases.length,
                    testsPassed,
                    runtime: Math.max(maxRuntime, 5000),
                    memory: 0,
                    errorMessage: null,
                    failedTestCase: { input: tc.input, expectedOutput: tc.expectedOutput, actualOutput: "" },
                    testResults,
                };
            }

            const actualOutput = execOutput.stdout.trim();
            const cleanExpected = tc.expectedOutput.trim();
            const passed = execOutput.exitCode === 0 && actualOutput === cleanExpected;

            if (execOutput.exitCode !== 0) {
                overallStatus = "RUNTIME_ERROR";
                errorMsg = execOutput.stderr || "Process exited with code " + execOutput.exitCode;
                firstFailed = { input: tc.input, expectedOutput: cleanExpected, actualOutput: errorMsg };
                break;
            }

            if (passed) {
                testsPassed++;
            } else {
                overallStatus = "WRONG_ANSWER";
                if (!firstFailed) {
                    firstFailed = { input: tc.input, expectedOutput: cleanExpected, actualOutput: actualOutput };
                }
                break;
            }

            maxRuntime = Math.max(maxRuntime, duration);

            testResults.push({
                input: tc.input,
                expectedOutput: cleanExpected,
                actualOutput,
                passed,
                executionTime: duration,
                memoryUsed: 0, // Mock for now
            });
        }

        return {
            status: overallStatus,
            testsTotal: testCases.length,
            testsPassed,
            runtime: maxRuntime,
            memory: 0,
            errorMessage: errorMsg,
            failedTestCase: firstFailed,
            testResults,
        };

    } catch (error: any) {
        console.error("Local execution error", error);
        return {
            status: "INTERNAL_ERROR",
            testsTotal: testCases.length,
            testsPassed: 0,
            runtime: 0,
            memory: 0,
            errorMessage: error.message || "Internal server error during execution",
            failedTestCase: null,
            testResults: [],
        };
    } finally {
        try {
            await fs.rm(hostTempDir, { recursive: true, force: true });
        } catch (e) {
            console.error("Error cleaning up host temp dir", e);
        }
    }
}

function spawnAsync(cmd: string, args: string[], cwd: string, input: string | null = null, timeoutMs: number = 0): Promise<{ stdout: string, stderr: string, exitCode: number, isTle: boolean }> {
    return new Promise((resolve) => {
        let isTle = false;
        const child = spawn(cmd, args, { cwd, shell: true });

        let stdout = "";
        let stderr = "";

        if (child.stdout) {
            child.stdout.on("data", (data) => {
                stdout += data.toString();
            });
        }

        if (child.stderr) {
            child.stderr.on("data", (data) => {
                stderr += data.toString();
            });
        }

        child.on("close", (code) => {
            if (timer) clearTimeout(timer);
            resolve({ stdout, stderr, exitCode: code ?? 1, isTle });
        });

        child.on("error", (err) => {
            if (timer) clearTimeout(timer);
            stderr += err.toString();
            resolve({ stdout, stderr, exitCode: 1, isTle });
        });

        if (input !== null && child.stdin) {
            child.stdin.write(input);
            child.stdin.end();
        }

        let timer: NodeJS.Timeout | null = null;
        if (timeoutMs > 0) {
            timer = setTimeout(() => {
                isTle = true;
                child.kill("SIGKILL");
            }, timeoutMs);
        }
    });
}
