"use client";

import { useState } from "react";
import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown, CheckCircle2, Circle } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}
import Link from "next/link";
import { ProblemTable } from "./ProblemTable";

export interface TrackTopic {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    icon: string | null;
    subtopics: TrackSubtopic[];
}

export interface TrackSubtopic {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    problems: TrackProblem[];
}

export interface TrackProblem {
    id: string;
    title: string;
    slug: string;
    difficulty: "EASY" | "MEDIUM" | "HARD";
    platformSource: string | null;
    platformUrl: string | null;
    rating: number | null;
    isSolved?: boolean;
}

interface TrackAccordionProps {
    topics: TrackTopic[];
    defaultExpanded?: boolean;
}

export function TrackAccordion({ topics, defaultExpanded = false }: TrackAccordionProps) {
    const defaultValues = defaultExpanded ? topics.map(t => t.id) : [];

    return (
        <Accordion.Root type="multiple" defaultValue={defaultValues} className="space-y-4">
            {topics.map((topic, topicIndex) => {
                const totalProblems = topic.subtopics.reduce((acc, sub) => acc + sub.problems.length, 0);
                const solvedProblems = topic.subtopics.reduce(
                    (acc, sub) => acc + sub.problems.filter(p => p.isSolved).length,
                    0
                );
                const progressPercentage = totalProblems === 0 ? 0 : Math.round((solvedProblems / totalProblems) * 100);

                return (
                    <Accordion.Item
                        key={topic.id}
                        value={topic.id}
                        className="overflow-hidden rounded-xl border border-white/10 bg-surface-base shadow-sm backdrop-blur-md"
                    >
                        <Accordion.Header className="flex">
                            <Accordion.Trigger className="group flex w-full items-center justify-between p-4 transition-colors hover:bg-white/5 data-[state=open]:bg-white/5">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/5 font-mono text-xl font-bold text-accent-cyan">
                                        {topicIndex + 1}
                                    </div>
                                    <div className="text-left">
                                        <h2 className="text-lg font-bold text-text-primary">{topic.name}</h2>
                                        <div className="flex items-center gap-2 mt-1">
                                            <div className="h-1.5 w-32 rounded-full bg-white/10">
                                                <div
                                                    className="h-full rounded-full bg-accent-cyan transition-all duration-500"
                                                    style={{ width: `${progressPercentage}%` }}
                                                />
                                            </div>
                                            <span className="text-xs font-mono text-text-muted">
                                                {solvedProblems}/{totalProblems} Solved
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <ChevronDown className="h-5 w-5 text-text-muted transition-transform duration-300 group-data-[state=open]:rotate-180" />
                            </Accordion.Trigger>
                        </Accordion.Header>

                        <Accordion.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                            <div className="border-t border-white/10 p-4 space-y-6">
                                {topic.subtopics.map((subtopic) => (
                                    <div key={subtopic.id} className="space-y-3">
                                        <h3 className="text-md font-semibold text-text-secondary pl-2 border-l-2 border-accent-cyan/50">
                                            {subtopic.name}
                                        </h3>
                                        <ProblemTable problems={subtopic.problems} />
                                    </div>
                                ))}
                            </div>
                        </Accordion.Content>
                    </Accordion.Item>
                );
            })}
        </Accordion.Root>
    );
}
