"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const codeSnippet = [
    "def twoSum(nums, target):",
    "    seen = {}",
    "    for i, num in enumerate(nums):",
    "        diff = target - num",
    "        if diff in seen:",
    "            return [seen[diff], i]",
    "        seen[num] = i"
];

const traceSteps = [
    { line: 1, vars: {} },
    { line: 2, vars: { seen: "{}" } },
    { line: 3, vars: { i: 0, num: 2, diff: 7, seen: "{}" } },
    { line: 4, vars: { i: 0, num: 2, diff: 7, seen: "{}" } },
    { line: 7, vars: { i: 0, num: 2, diff: 7, seen: "{2:0}" } },
    { line: 3, vars: { i: 1, num: 7, diff: 2, seen: "{2:0}" } },
    { line: 4, vars: { i: 1, num: 7, diff: 2, seen: "{2:0}" } },
    { line: 5, vars: { i: 1, num: 7, diff: 2, seen: "{2:0}" } },
    { line: 6, vars: { i: 1, num: 7, diff: 2, seen: "{2:0}" }, result: "[0, 1]" },
];

export function VisualHero() {
    const [stepIdx, setStepIdx] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setStepIdx((prev) => (prev + 1) % traceSteps.length);
        }, 2000);
        return () => clearInterval(timer);
    }, []);

    const currentStep = traceSteps[stepIdx];

    return (
        <div className="relative w-full max-w-2xl perspective-1000">
            <motion.div
                initial={{ rotateY: -5, rotateX: 5 }}
                animate={{ rotateY: 5, rotateX: -5 }}
                transition={{ duration: 4, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
                className="rounded-xl border border-white/10 bg-[#0d1117]/80 p-6 shadow-2xl backdrop-blur-xl"
            >
                <div className="mb-4 flex items-center justify-between border-b border-white/5 pb-3">
                    <div className="flex gap-1.5">
                        <div className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
                        <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
                        <div className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
                    </div>
                    <div className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">
                        Live Visualizer Mockup
                    </div>
                </div>

                <div className="grid grid-cols-12 gap-6">
                    {/* Code Side */}
                    <div className="col-span-12 lg:col-span-7 font-mono text-[13px] leading-relaxed">
                        {codeSnippet.map((line, i) => {
                            const lineNum = i + 1;
                            const isActive = currentStep.line === lineNum;
                            return (
                                <div
                                    key={i}
                                    className={`flex gap-4 transition-colors duration-300 ${isActive ? "bg-accent-cyan/10 border-l border-accent-cyan" : "border-l border-transparent"
                                        }`}
                                >
                                    <span className={`w-6 text-right opacity-30 select-none ${isActive ? "text-accent-cyan opacity-100" : ""}`}>
                                        {lineNum}
                                    </span>
                                    <pre className={`${isActive ? "text-white" : "text-gray-500"}`}>{line}</pre>
                                </div>
                            );
                        })}
                    </div>

                    {/* Variables Side */}
                    <div className="col-span-12 lg:col-span-5 flex flex-col gap-4">
                        <div className="rounded-lg bg-black/40 p-3 border border-white/5">
                            <h4 className="text-[10px] font-bold uppercase text-accent-purple mb-2 tracking-wider">Variables</h4>
                            <div className="space-y-2">
                                {Object.entries(currentStep.vars).length > 0 ? (
                                    Object.entries(currentStep.vars).map(([name, val]) => (
                                        <motion.div
                                            key={name}
                                            initial={{ opacity: 0, x: -5 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className="flex justify-between text-xs font-mono"
                                        >
                                            <span className="text-blue-400">{name}</span>
                                            <span className="text-green-400">{String(val)}</span>
                                        </motion.div>
                                    ))
                                ) : (
                                    <span className="text-xs text-gray-600 italic">Initializing...</span>
                                )}
                            </div>
                        </div>

                        {currentStep.result && (
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="rounded-lg bg-accent-green/10 p-3 border border-accent-green/20"
                            >
                                <div className="text-[10px] font-bold uppercase text-accent-green mb-1">Return Value</div>
                                <div className="font-mono text-sm text-white">{currentStep.result}</div>
                            </motion.div>
                        )}
                    </div>
                </div>
            </motion.div>

            {/* Decorative Orbs */}
            <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-accent-purple/20 blur-3xl" />
            <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-accent-cyan/20 blur-3xl" />
        </div>
    );
}
