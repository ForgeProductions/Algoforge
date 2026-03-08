"use client";

import { useState } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Plus, Trash2 } from "lucide-react";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface TestCasesProps {
    testCases: any[];
    result: any;
    onTestCasesChange?: (testCases: any[]) => void;
}

export function TestCases({ testCases = [], result, onTestCasesChange }: TestCasesProps) {
    const [activeTab, setActiveTab] = useState("testcases"); // "testcases" or "result"
    const [selectedTestCase, setSelectedTestCase] = useState(0);

    const handleInputChange = (value: string) => {
        if (!onTestCasesChange) return;
        const newTestCases = [...testCases];
        if (newTestCases[selectedTestCase]) {
            newTestCases[selectedTestCase] = { ...newTestCases[selectedTestCase], input: value };
            onTestCasesChange(newTestCases);
        }
    };

    const handleExpectedOutputChange = (value: string) => {
        if (!onTestCasesChange) return;
        const newTestCases = [...testCases];
        if (newTestCases[selectedTestCase]) {
            newTestCases[selectedTestCase] = { ...newTestCases[selectedTestCase], expectedOutput: value };
            onTestCasesChange(newTestCases);
        }
    };

    const handleAddTestCase = () => {
        if (!onTestCasesChange) return;
        const newTestCase = {
            id: `custom-${Date.now()}`,
            input: "",
            expectedOutput: ""
        };
        onTestCasesChange([...testCases, newTestCase]);
        setSelectedTestCase(testCases.length);
    };

    const handleRemoveTestCase = (index: number) => {
        if (!onTestCasesChange) return;
        const newTestCases = testCases.filter((_, i) => i !== index);
        onTestCasesChange(newTestCases);
        if (selectedTestCase >= newTestCases.length) {
            setSelectedTestCase(Math.max(0, newTestCases.length - 1));
        }
    };

    return (
        <div className="flex h-full flex-col">
            {/* Tabs */}
            <div className="flex h-10 flex-none border-b border-white/10 bg-surface-header">
                <button
                    onClick={() => setActiveTab("testcases")}
                    className={cn(
                        "px-4 text-sm font-medium transition-colors border-b-2",
                        activeTab === "testcases"
                            ? "border-accent-cyan text-accent-cyan bg-white/5"
                            : "border-transparent text-text-muted hover:text-text-primary hover:bg-white/5"
                    )}
                >
                    Test Cases
                </button>
                {result && (
                    <button
                        onClick={() => setActiveTab("result")}
                        className={cn(
                            "px-4 text-sm font-medium transition-colors border-b-2",
                            activeTab === "result"
                                ? "border-accent-cyan text-accent-cyan bg-white/5"
                                : "border-transparent text-text-muted hover:text-text-primary hover:bg-white/5"
                        )}
                    >
                        Result <span className={cn(
                            "ml-2 inline-flex h-2 w-2 rounded-full",
                            result.status === "ACCEPTED" ? "bg-accent-green" : "bg-difficulty-hard"
                        )} />
                    </button>
                )}
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-auto p-4 scrollbar-thin scrollbar-thumb-white/10">
                {activeTab === "testcases" && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 overflow-x-auto pb-2">
                            {testCases.map((tc, idx) => (
                                <div key={tc.id} className="flex items-center group">
                                    <button
                                        onClick={() => setSelectedTestCase(idx)}
                                        className={cn(
                                            "rounded-l-md px-3 py-1.5 text-sm font-medium transition-colors whitespace-nowrap",
                                            selectedTestCase === idx
                                                ? "bg-white/10 text-text-primary"
                                                : "bg-surface-card text-text-muted hover:bg-white/5 hover:text-text-primary",
                                            !onTestCasesChange && "rounded-r-md"
                                        )}
                                    >
                                        Case {idx + 1}
                                    </button>
                                    {onTestCasesChange && (
                                        <button
                                            onClick={() => handleRemoveTestCase(idx)}
                                            className={cn(
                                                "rounded-r-md px-2 py-1.5 text-text-muted transition-colors hover:bg-difficulty-hard/20 hover:text-difficulty-hard",
                                                selectedTestCase === idx ? "bg-white/10" : "bg-surface-card"
                                            )}
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </button>
                                    )}
                                </div>
                            ))}
                            {onTestCasesChange && testCases.length < 8 && (
                                <button
                                    onClick={handleAddTestCase}
                                    className="flex items-center gap-1 rounded-md bg-surface-card px-3 py-1.5 text-sm font-medium text-text-muted transition-colors hover:bg-white/5 hover:text-text-primary"
                                >
                                    <Plus className="h-4 w-4" />
                                </button>
                            )}
                        </div>

                        {testCases[selectedTestCase] && (
                            <div className="space-y-4">
                                <div>
                                    <h4 className="mb-2 text-xs font-semibold text-text-muted">Input</h4>
                                    {onTestCasesChange ? (
                                        <textarea
                                            value={testCases[selectedTestCase].input}
                                            onChange={(e) => handleInputChange(e.target.value)}
                                            className="w-full min-h-[100px] rounded-md bg-black/40 border border-white/10 p-3 font-mono text-sm text-text-secondary focus:border-accent-cyan focus:outline-none resize-y"
                                            placeholder="Enter custom input here..."
                                        />
                                    ) : (
                                        <div className="rounded-md bg-surface-card border border-white/10 p-3 font-mono text-sm text-text-secondary whitespace-pre-wrap">
                                            {testCases[selectedTestCase].input}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <h4 className="mb-2 text-xs font-semibold text-text-muted">Expected Output</h4>
                                    {onTestCasesChange ? (
                                        <textarea
                                            value={testCases[selectedTestCase].expectedOutput || ""}
                                            onChange={(e) => handleExpectedOutputChange(e.target.value)}
                                            className="w-full min-h-[100px] rounded-md bg-black/40 border border-white/10 p-3 font-mono text-sm text-text-secondary focus:border-accent-cyan focus:outline-none resize-y"
                                            placeholder="Enter expected output here (optional)..."
                                        />
                                    ) : (
                                        <div className="rounded-md bg-surface-card border border-white/10 p-3 font-mono text-sm text-text-secondary whitespace-pre-wrap">
                                            {testCases[selectedTestCase].expectedOutput}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                        {testCases.length === 0 && (
                            <div className="text-text-muted text-sm italic">
                                No test cases available. {onTestCasesChange && "Click + to add one."}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === "result" && result && (
                    <div className="space-y-4">
                        <div className={cn(
                            "text-xl font-bold",
                            result.status === "ACCEPTED" ? "text-accent-green" : "text-difficulty-hard"
                        )}>
                            {result.status}
                        </div>

                        {/* Failed Test Case Detail */}
                        {result.failedTestCase && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                <div className="rounded-lg border border-difficulty-hard/20 bg-difficulty-hard/5 p-4">
                                    <h4 className="text-xs font-semibold text-difficulty-hard uppercase tracking-wider mb-3">Failed Test Case</h4>
                                    <div className="grid gap-4">
                                        <div>
                                            <span className="text-[10px] text-text-muted uppercase font-bold block mb-1">Input</span>
                                            <div className="bg-black/40 rounded p-2 font-mono text-sm text-text-secondary border border-white/5">
                                                {result.failedTestCase.input}
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <span className="text-[10px] text-text-muted uppercase font-bold block mb-1">Expected</span>
                                                <div className="bg-accent-green/10 rounded p-2 font-mono text-sm text-accent-green border border-accent-green/10">
                                                    {result.failedTestCase.expectedOutput}
                                                </div>
                                            </div>
                                            <div>
                                                <span className="text-[10px] text-text-muted uppercase font-bold block mb-1">Actual</span>
                                                <div className="bg-difficulty-hard/10 rounded p-2 font-mono text-sm text-difficulty-hard border border-difficulty-hard/10">
                                                    {result.failedTestCase.actualOutput}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {result.output && (
                            <div>
                                <h4 className="mb-2 text-xs font-semibold text-text-muted">Console Output</h4>
                                <div className="rounded-md bg-black/50 border border-white/10 p-4 font-mono text-sm text-text-secondary whitespace-pre-wrap overflow-x-auto">
                                    {result.output}
                                </div>
                            </div>
                        )}
                        {result.errorMessage && (
                            <div>
                                <h4 className="mb-2 text-xs font-semibold text-difficulty-hard">Error Details</h4>
                                <div className="rounded-md bg-difficulty-hard/5 border border-difficulty-hard/20 p-4 font-mono text-sm text-difficulty-hard whitespace-pre-wrap overflow-x-auto">
                                    {result.errorMessage}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
