"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X, ChevronDown, Filter } from "lucide-react";

interface ProblemsFiltersProps {
    allTags: string[];
}

export function ProblemsFilters({ allTags }: ProblemsFiltersProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [search, setSearch] = useState(searchParams.get("q") || "");
    const [difficulty, setDifficulty] = useState(searchParams.get("difficulty") || "");
    const [track, setTrack] = useState(searchParams.get("track") || "");
    const [tag, setTag] = useState(searchParams.get("tag") || "");

    // Update URL when filters change
    const updateFilters = (newFilters: { q?: string; difficulty?: string; track?: string; tag?: string }) => {
        const params = new URLSearchParams(searchParams.toString());

        // Reset page when filters change
        params.delete("page");

        if (newFilters.q !== undefined) {
            if (newFilters.q) params.set("q", newFilters.q);
            else params.delete("q");
        }

        if (newFilters.difficulty !== undefined) {
            if (newFilters.difficulty) params.set("difficulty", newFilters.difficulty);
            else params.delete("difficulty");
        }

        if (newFilters.track !== undefined) {
            if (newFilters.track) params.set("track", newFilters.track);
            else params.delete("track");
        }

        if (newFilters.tag !== undefined) {
            if (newFilters.tag) params.set("tag", newFilters.tag);
            else params.delete("tag");
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
        setTrack("");
        setTag("");
        router.push("?");
    };

    const hasFilters = search || difficulty || track || tag;

    return (
        <div className="flex flex-wrap items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/10 backdrop-blur-md">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[250px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                <input
                    type="text"
                    placeholder="Search problems by name or slug..."
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

            <div className="flex flex-wrap items-center gap-3">
                {/* Difficulty Filter */}
                <div className="relative min-w-[120px]">
                    <select
                        value={difficulty}
                        onChange={(e) => {
                            setDifficulty(e.target.value);
                            updateFilters({ difficulty: e.target.value });
                        }}
                        className="appearance-none w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-4 pr-10 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent-cyan transition-all cursor-pointer"
                    >
                        <option value="" className="bg-[#0f172a]">Difficulty: All</option>
                        <option value="EASY" className="bg-[#0f172a]">Easy</option>
                        <option value="MEDIUM" className="bg-[#0f172a]">Medium</option>
                        <option value="HARD" className="bg-[#0f172a]">Hard</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted pointer-events-none" />
                </div>

                {/* Track Filter */}
                <div className="relative min-w-[100px]">
                    <select
                        value={track}
                        onChange={(e) => {
                            setTrack(e.target.value);
                            updateFilters({ track: e.target.value });
                        }}
                        className="appearance-none w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-4 pr-10 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent-cyan transition-all cursor-pointer"
                    >
                        <option value="" className="bg-[#0f172a]">Track: All</option>
                        <option value="DSA" className="bg-[#0f172a]">DSA</option>
                        <option value="CP" className="bg-[#0f172a]">CP</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted pointer-events-none" />
                </div>

                {/* Tag Filter */}
                <div className="relative min-w-[140px]">
                    <select
                        value={tag}
                        onChange={(e) => {
                            setTag(e.target.value);
                            updateFilters({ tag: e.target.value });
                        }}
                        className="appearance-none w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-4 pr-10 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent-cyan transition-all cursor-pointer"
                    >
                        <option value="" className="bg-[#0f172a]">Tag: All</option>
                        {allTags.map((t) => (
                            <option key={t} value={t} className="bg-[#0f172a]">
                                {t}
                            </option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted pointer-events-none" />
                </div>
            </div>

            {/* Clear Button */}
            {hasFilters && (
                <button
                    onClick={clearFilters}
                    className="text-xs text-red-400 hover:text-red-300 transition-colors px-2 py-1 flex items-center gap-1 border-l border-white/10 ml-2 shadow-sm"
                >
                    <X className="h-3 w-3" />
                    Clear Results
                </button>
            )}
        </div>
    );
}
