import { spawn } from "child_process";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";

// Path to the tracer script
const TRACER_SCRIPT = path.join(process.cwd(), "src", "lib", "execution", "visualizer", "python_tracer.py");

export interface VisualizerStep {
    step: number;
    line: number;
    event: "line" | "call" | "return" | "exception";
    function: string;
    variables: Record<string, { value: any; type: string }>;
    callStack: string[];
    stdout: string;
    returnValue?: any;
    error?: string;
}

export interface VisualizerResult {
    steps: VisualizerStep[];
    totalSteps: number;
    code: string;
    error: { type: string; message: string } | null;
    finalOutput: string;
}

export async function runVisualizer(
    code: string,
    language: string,
    input: string = ""
): Promise<VisualizerResult> {
    if (language !== "PYTHON") {
        return {
            steps: [],
            totalSteps: 0,
            code,
            error: { type: "UnsupportedLanguage", message: `Visualizer currently only supports Python. ${language} support coming soon.` },
            finalOutput: ""
        };
    }

    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "algoforge-viz-"));

    try {
        // Write user code
        fs.writeFileSync(path.join(tmpDir, "solution.py"), code);
        // Write input
        fs.writeFileSync(path.join(tmpDir, "input.txt"), input);
        // Copy tracer script
        fs.copyFileSync(TRACER_SCRIPT, path.join(tmpDir, "tracer.py"));

        return await new Promise<VisualizerResult>((resolve) => {
            const pyProcess = spawn("python", ["tracer.py"], {
                cwd: tmpDir,
                timeout: 10000,
            });

            let output = "";
            let errorOutput = "";

            pyProcess.stdout.on("data", (data) => (output += data.toString("utf-8")));
            pyProcess.stderr.on("data", (data) => (errorOutput += data.toString("utf-8")));

            pyProcess.on("close", (exitCode) => {
                const combinedOutput = output + (errorOutput ? "\n" + errorOutput : "");
                const lines = output.split("\n").filter((l: string) => l.trim());
                const lastLine = lines[lines.length - 1] || "";

                try {
                    let jsonStr = lastLine;
                    const startIdx = jsonStr.indexOf("{");
                    if (startIdx > 0) {
                        jsonStr = jsonStr.substring(startIdx);
                    }
                    const result = JSON.parse(jsonStr) as VisualizerResult;
                    resolve(result);
                } catch (parseError) {
                    resolve({
                        steps: [],
                        totalSteps: 0,
                        code,
                        error: { type: "ParseError", message: `Failed to parse tracer output: ${combinedOutput.substring(0, 500)}` },
                        finalOutput: combinedOutput
                    });
                }
            });

            pyProcess.on("error", (err) => {
                resolve({
                    steps: [],
                    totalSteps: 0,
                    code,
                    error: { type: "ExecutionError", message: err.message },
                    finalOutput: errorOutput
                });
            });
        });
    } finally {
        // Cleanup temp directory
        try { fs.rmSync(tmpDir, { recursive: true, force: true }); } catch { }
    }
}
