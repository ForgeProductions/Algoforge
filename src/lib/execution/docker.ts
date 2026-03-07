import Docker from "dockerode";
import * as fs from "fs/promises";
import * as path from "path";
import { v4 as uuidv4 } from "uuid";
import { Writable } from "stream";

const docker = new Docker();

export const DOCKER_CONFIG = {
    PYTHON: {
        baseImage: "python:3.11-slim",
        image: "algoforge-python:latest",
        filename: "solution.py",
        compileCmd: null,
        runCmd: ["/usr/bin/time", "-v", "python", "solution.py"],
    },
    JAVASCRIPT: {
        baseImage: "node:20-slim",
        image: "algoforge-node:latest",
        filename: "solution.js",
        compileCmd: null,
        runCmd: ["/usr/bin/time", "-v", "node", "solution.js"],
    },
    CPP: {
        baseImage: "gcc:12",
        image: "algoforge-gcc:latest",
        filename: "solution.cpp",
        compileCmd: ["g++", "-O2", "-o", "solution.exe", "solution.cpp"],
        runCmd: ["/usr/bin/time", "-v", "./solution.exe"],
    },
    JAVA: {
        baseImage: "openjdk:17-slim",
        image: "algoforge-java:latest",
        filename: "Solution.java",
        compileCmd: ["javac", "Solution.java"],
        runCmd: ["/usr/bin/time", "-v", "java", "Solution"],
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

/**
 * Ensures required custom Docker images exist by building them from their base images.
 */
async function buildCustomImageIfNotExists(baseImage: string, customImage: string) {
    try {
        await docker.getImage(customImage).inspect();
    } catch (error: any) {
        if (error.statusCode === 404) {
            console.log(`Custom image ${customImage} not found. Building it from ${baseImage}...`);
            const dockerfile = `
FROM ${baseImage}
RUN apt-get update && apt-get install -y time && rm -rf /var/lib/apt/lists/*
            `;

            // To build an image we need to create a tar stream. We'll just write the Dockerfile
            // to a temporary directory and use that context.
            const tmpContextDir = path.join(process.cwd(), "tmp", "docker-build", customImage.replace(":", "-"));
            await fs.mkdir(tmpContextDir, { recursive: true });
            await fs.writeFile(path.join(tmpContextDir, "Dockerfile"), dockerfile);

            const tarStream = require("tar-fs").pack(tmpContextDir);

            await new Promise((resolve, reject) => {
                docker.buildImage(tarStream, { t: customImage }, (err: any, stream: any) => {
                    if (err) return reject(err);
                    docker.modem.followProgress(stream, (onFinishedErr: any, output: any) => {
                        if (onFinishedErr) return reject(onFinishedErr);
                        resolve(output);
                    });
                });
            });
            console.log(`Built image ${customImage}`);
            try { await fs.rm(tmpContextDir, { recursive: true, force: true }); } catch (e) {}
        } else {
            throw error;
        }
    }
}

/**
 * Runs a command inside a Docker container.
 */
async function runInDocker(
    language: keyof typeof DOCKER_CONFIG,
    cmd: string[],
    hostDir: string,
    timeoutMs: number,
    inputString: string | null = null,
    networkDisabled = true
): Promise<{ stdout: string; stderr: string; exitCode: number; isTle: boolean }> {
    const config = DOCKER_CONFIG[language];
    await buildCustomImageIfNotExists(config.baseImage, config.image);

    const container = await docker.createContainer({
        Image: config.image,
        Cmd: cmd,
        HostConfig: {
            Binds: [`${hostDir}:/usr/src/app`],
            Memory: 256 * 1024 * 1024, // 256MB
            PidsLimit: 50,
            NetworkMode: networkDisabled ? "none" : "default",
        },
        WorkingDir: "/usr/src/app",
        OpenStdin: inputString !== null,
        StdinOnce: inputString !== null,
        AttachStdin: inputString !== null,
        AttachStdout: true,
        AttachStderr: true,
        Tty: false,
    });

    let stdout = "";
    let stderr = "";

    const stdoutStream = new Writable({
        write(chunk, encoding, callback) {
            stdout += chunk.toString();
            callback();
        },
    });

    const stderrStream = new Writable({
        write(chunk, encoding, callback) {
            stderr += chunk.toString();
            callback();
        },
    });

    try {
        const stream = await container.attach({
            stream: true,
            stdout: true,
            stderr: true,
            stdin: inputString !== null,
        });

        // Docker multiplexes stdout and stderr
        container.modem.demuxStream(stream, stdoutStream, stderrStream);

        await container.start();

        if (inputString !== null) {
            stream.write(inputString);
            stream.end();
        }

        let isTle = false;

        const waitPromise = container.wait();

        let timeoutTimer: NodeJS.Timeout | null = null;
        const timeoutPromise = timeoutMs > 0
            ? new Promise<void>((resolve) => {
                timeoutTimer = setTimeout(async () => {
                    isTle = true;
                    try {
                        await container.kill();
                    } catch (e) {}
                    resolve();
                }, timeoutMs);
            })
            : null;

        if (timeoutPromise) {
            await Promise.race([waitPromise, timeoutPromise]);
            if (timeoutTimer) clearTimeout(timeoutTimer);
        } else {
            await waitPromise;
        }

        const data = await container.inspect();
        const exitCode = data.State.ExitCode;

        return { stdout, stderr, exitCode, isTle };
    } finally {
        try {
            await container.remove({ force: true });
        } catch (e) {}
    }
}

/**
 * Parses /usr/bin/time -v output to get memory usage
 */
function parseTimeOutput(stderr: string): { realStderr: string; memoryKb: number; timeS: number } {
    let memoryKb = 0;
    let timeS = 0;

    // Output format typically:
    // ... program stderr ...
    // 	Command being timed: "..."
    // 	User time (seconds): 0.00
    // 	System time (seconds): 0.00
    // 	Percent of CPU this job got: 0%
    // 	Elapsed (wall clock) time (h:mm:ss or m:ss): 0:00.01
    // ...
    // 	Maximum resident set size (kbytes): 10240

    const lines = stderr.split('\n');
    const actualStderrLines: string[] = [];

    let isTimeOutput = false;
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line.includes("Command being timed:") && i > 0 && i > lines.length - 30) {
            isTimeOutput = true;
        }

        if (isTimeOutput) {
            const memMatch = line.match(/Maximum resident set size \(kbytes\):\s*(\d+)/);
            if (memMatch) {
                memoryKb = parseInt(memMatch[1], 10);
            }

            const timeMatch = line.match(/Elapsed \(wall clock\) time.*?:\s*([\d:.]+)/);
            if (timeMatch) {
                const timeStr = timeMatch[1];
                const parts = timeStr.split(':');
                if (parts.length === 2) {
                    timeS = parseInt(parts[0], 10) * 60 + parseFloat(parts[1]);
                } else if (parts.length === 3) {
                    timeS = parseInt(parts[0], 10) * 3600 + parseInt(parts[1], 10) * 60 + parseFloat(parts[2]);
                } else {
                    timeS = parseFloat(parts[0]);
                }
            }
        } else {
            actualStderrLines.push(line);
        }
    }

    return {
        realStderr: actualStderrLines.join('\n').trim(),
        memoryKb,
        timeS
    };
}

export async function runCodeLocally(
    code: string,
    language: "PYTHON" | "CPP" | "JAVA" | "JAVASCRIPT",
    testCases: { input: string; expectedOutput: string }[]
): Promise<ExecutionResult> {
    const config = DOCKER_CONFIG[language];
    const runId = uuidv4();
    const hostTempDir = path.join(process.cwd(), "tmp", "executions", runId);

    try {
        await fs.mkdir(hostTempDir, { recursive: true });
        await fs.writeFile(path.join(hostTempDir, config.filename), code);

        // Compile
        if (config.compileCmd) {
            // Network is enabled during compilation just in case (e.g., Maven, though we don't use it yet)
            const compileOutput = await runInDocker(language, config.compileCmd, hostTempDir, 10000, null, false);
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
        let maxMemory = 0;
        let firstFailed: ExecutionResult["failedTestCase"] | null = null;
        let overallStatus: ExecutionResult["status"] = "ACCEPTED";
        let errorMsg: string | null = null;

        for (const tc of testCases) {
            const execOutput = await runInDocker(language, config.runCmd, hostTempDir, 5000, tc.input, true);

            if (execOutput.isTle) {
                return {
                    status: "TIME_LIMIT_EXCEEDED",
                    testsTotal: testCases.length,
                    testsPassed,
                    runtime: Math.max(maxRuntime, 5000),
                    memory: Math.max(maxMemory, 0),
                    errorMessage: null,
                    failedTestCase: { input: tc.input, expectedOutput: tc.expectedOutput, actualOutput: "" },
                    testResults,
                };
            }

            const { realStderr, memoryKb, timeS } = parseTimeOutput(execOutput.stderr);
            const durationMs = Math.round(timeS * 1000);
            const memoryMb = memoryKb / 1024;

            const actualOutput = execOutput.stdout.trim();
            const cleanExpected = tc.expectedOutput.trim();
            const passed = execOutput.exitCode === 0 && actualOutput === cleanExpected;

            if (execOutput.exitCode !== 0) {
                overallStatus = "RUNTIME_ERROR";
                errorMsg = realStderr || "Process exited with code " + execOutput.exitCode;
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

            maxRuntime = Math.max(maxRuntime, durationMs);
            maxMemory = Math.max(maxMemory, memoryMb);

            testResults.push({
                input: tc.input,
                expectedOutput: cleanExpected,
                actualOutput,
                passed,
                executionTime: durationMs,
                memoryUsed: memoryMb,
            });
        }

        return {
            status: overallStatus,
            testsTotal: testCases.length,
            testsPassed,
            runtime: maxRuntime,
            memory: parseFloat(maxMemory.toFixed(2)),
            errorMessage: errorMsg,
            failedTestCase: firstFailed,
            testResults,
        };

    } catch (error: any) {
        console.error("Docker execution error", error);
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
