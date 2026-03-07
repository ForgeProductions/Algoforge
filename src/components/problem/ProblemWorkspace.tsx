"use client";

import { useState } from "react";
import Split from "react-split";
import { ProblemDescription } from "./ProblemDescription";
import { CodeEditor } from "./CodeEditor";
import { TestCases } from "./TestCases";
import { VisualizerPanel } from "./VisualizerPanel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MySubmissions } from "./MySubmissions";
import { PublicSolutions } from "./PublicSolutions";

interface ProblemWorkspaceProps {
    problem: any;
    testCases: any[];
    user: any;
    previousCode?: string;
}

export function ProblemWorkspace({ problem, testCases, user, previousCode }: ProblemWorkspaceProps) {
    const boilerplate = typeof problem.boilerplate === 'string' ? JSON.parse(problem.boilerplate) : (problem.boilerplate || {});
    const [language, setLanguage] = useState("JAVASCRIPT");
    const [code, setCode] = useState(previousCode || boilerplate[language] || boilerplate.JAVASCRIPT || "");

    // Execution State
    const [isRunning, setIsRunning] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [runResult, setRunResult] = useState<any>(null);
    const [showVisualizer, setShowVisualizer] = useState(false);

    const pollResult = async (runId: string) => {
        let attempts = 0;
        while (attempts < 20) {
            await new Promise(r => setTimeout(r, 1000));
            const res = await fetch(`/api/submissions/run?runId=${runId}`);
            if (res.ok) {
                const data = await res.json();
                if (data.status !== "PENDING" && data.status !== "RUNNING") {
                    return data;
                }
            }
            attempts++;
        }
        return { status: "TIMEOUT", output: "Execution timed out waiting for worker." };
    };

    const handleRun = async () => {
        setIsRunning(true);
        setRunResult({ status: "RUNNING", output: "Code sent to execution queue..." });
        try {
            const res = await fetch("/api/submissions/run", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    problemId: problem.id,
                    code,
                    language,
                    testCases: testCases.map((tc: any) => ({ input: tc.input, expectedOutput: tc.expectedOutput }))
                })
            });
            if (!res.ok) throw new Error("Failed to queue run");
            const data = await res.json();
            setRunResult(data.data || data); // handle standard API wrapper
        } catch (err: any) {
            setRunResult({ status: "INTERNAL_ERROR", output: err.message });
        } finally {
            setIsRunning(false);
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        setRunResult({ status: "RUNNING", output: "Submitting to judge..." });
        try {
            const res = await fetch("/api/submissions/submit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    problemId: problem.id,
                    code,
                    language
                })
            });
            if (!res.ok) throw new Error("Failed to submit");
            const data = await res.json();
            setRunResult(data.data || data);
        } catch (err: any) {
            setRunResult({ status: "INTERNAL_ERROR", output: err.message });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex h-full w-full">
            {/* Left Panel: Problem Description & Submissions */}
            <div className="flex flex-col h-full w-[40%] min-w-[300px] border-r border-white/10 overflow-hidden bg-surface-base">
                <Tabs defaultValue="description" className="flex flex-col h-full w-full">
                    <div className="px-4 pt-4 border-b border-white/10 shrink-0">
                        <TabsList className="bg-white/5 border border-white/10 p-1 mb-[-1px]">
                            <TabsTrigger value="description" className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-text-muted text-xs">Description</TabsTrigger>
                            <TabsTrigger value="submissions" className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-text-muted text-xs">My Submissions</TabsTrigger>
                            <TabsTrigger value="solutions" className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-text-muted text-xs">Solutions</TabsTrigger>
                        </TabsList>
                    </div>

                    <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden">
                        <TabsContent value="description" className="h-full m-0 p-0 outline-none data-[state=inactive]:hidden">
                            <ProblemDescription problem={problem} />
                        </TabsContent>
                        <TabsContent value="submissions" className="h-full m-0 p-0 outline-none data-[state=inactive]:hidden">
                            <MySubmissions problemId={problem.id} user={user} />
                        </TabsContent>
                        <TabsContent value="solutions" className="h-full m-0 p-0 outline-none data-[state=inactive]:hidden">
                            <PublicSolutions problemId={problem.id} />
                        </TabsContent>
                    </div>
                </Tabs>
            </div>

            {/* Right Panel: Editor & Test Cases */}
            <div className="flex h-full flex-1 flex-col overflow-hidden">
                {/* Editor */}
                <div className="flex-1 min-h-0 overflow-hidden">
                    <CodeEditor
                        code={code}
                        onChange={setCode}
                        language={language}
                        onLanguageChange={setLanguage}
                        problem={problem}
                        onRun={handleRun}
                        onSubmit={handleSubmit}
                        onVisualize={() => setShowVisualizer(true)}
                        isRunning={isRunning || isSubmitting}
                    />
                </div>

                {/* Test Cases */}
                <div className="h-[35%] min-h-[150px] border-t border-white/10 overflow-hidden">
                    <TestCases testCases={testCases} result={runResult} />
                </div>
            </div>

            {/* Visualizer Overlay */}
            {showVisualizer && (
                <VisualizerPanel
                    code={code}
                    language={language}
                    input={testCases[0]?.input}
                    onClose={() => setShowVisualizer(false)}
                />
            )}
        </div>
    );
}
