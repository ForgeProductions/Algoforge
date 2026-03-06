"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X, Filter, ChevronDown } from "lucide-react";

interface TrackFiltersProps {
    topics: { name: string; slug: string }[];
}

export function TrackFilters({ topics }: TrackFiltersProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [search, setSearch] = useState(searchParams.get("q") || "");
    const [difficulty, setDifficulty] = useState(searchParams.get("difficulty") || "");
    const [topic, setTopic] = useState(searchParams.get("topic") || "");

    // Update URL when filters change
    const updateFilters = (newFilters: { q?: string; difficulty?: string; topic?: string }) => {
        const params = new URLSearchParams(searchParams.toString());

        if (newFilters.q !== undefined) {
            if (newFilters.q) params.set("q", newFilters.q);
            else params.delete("q");
        }

        if (newFilters.difficulty !== undefined) {
            if (newFilters.difficulty) params.set("difficulty", newFilters.difficulty);
            else params.delete("difficulty");
        }

        if (newFilters.topic !== undefined) {
            if (newFilters.topic) params.set("topic", newFilters.topic);
            else params.delete("topic");
        }

        router.push(`?${params.toString()}`);
    };

    // Debounced search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (search !== (searchParams.get("q") || "")) {
                updateFilters({ q: search });
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [search]);

    const clearFilters = () => {
        setSearch("");
        setDifficulty("");
        setTopic("");
        router.push("?");
    };

    const hasFilters = search || difficulty || topic;

    return (
        <div className="flex flex-wrap items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/10 backdrop-blur-md">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                <input
                    type="text"
                    placeholder="Search problems by name..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent-cyan transition-all"
                />
                {search && (
                    <button
                        onClick={() => setSearch("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}
            </div>

            {/* Difficulty Filter */}
            <div className="relative">
                <select
                    value={difficulty}
                    onChange={(e) => {
                        setDifficulty(e.target.value);
                        updateFilters({ difficulty: e.target.value });
                    }}
                    className="appearance-none bg-white/5 border border-white/10 rounded-lg py-2 pl-4 pr-10 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent-cyan transition-all cursor-pointer"
                >
                    <option value="" className="bg-[#0f172a]">Difficulty: All</option>
                    <option value="EASY" className="bg-[#0f172a]">Easy</option>
                    <option value="MEDIUM" className="bg-[#0f172a]">Medium</option>
                    <option value="HARD" className="bg-[#0f172a]">Hard</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted pointer-events-none" />
            </div>

            {/* Topic Filter */}
            <div className="relative min-w-[150px]">
                <select
                    value={topic}
                    onChange={(e) => {
                        setTopic(e.target.value);
                        updateFilters({ topic: e.target.value });
                    }}
                    className="appearance-none w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-4 pr-10 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent-cyan transition-all cursor-pointer"
                >
                    <option value="" className="bg-[#0f172a]">Topic: All</option>
                    {topics.map((t) => (
                        <option key={t.slug} value={t.slug} className="bg-[#0f172a]">
                            {t.name}
                        </option>
                    ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted pointer-events-none" />
            </div>

            {/* Clear Button */}
            {hasFilters && (
                <button
                    onClick={clearFilters}
                    className="text-xs text-red-400 hover:text-red-300 transition-colors px-2 py-1 flex items-center gap-1"
                >
                    <X className="h-3 w-3" />
                    Clear Filters
                </button>
            )}
        </div>
    );
}
