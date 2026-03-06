import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface ProblemDescriptionProps {
    problem: any;
}

export function ProblemDescription({ problem }: ProblemDescriptionProps) {
    // Safely parse JSON fields for SQLite
    const tags: string[] = typeof problem.tags === 'string' ? JSON.parse(problem.tags) : (problem.tags || []);
    const examples = typeof problem.examples === 'string' ? JSON.parse(problem.examples) : (problem.examples || []);

    return (
        <div className="h-full overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-white/10">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold text-text-primary uppercase tracking-tight">{problem.title}</h1>
                <span className={cn(
                    "rounded-full px-3 py-1 text-xs font-bold border shadow-sm",
                    problem.difficulty === "EASY" && "border-accent-green/30 bg-accent-green/10 text-accent-green",
                    problem.difficulty === "MEDIUM" && "border-accent-yellow/30 bg-accent-yellow/10 text-accent-yellow",
                    problem.difficulty === "HARD" && "border-difficulty-hard/30 bg-difficulty-hard/10 text-difficulty-hard"
                )}>
                    {problem.difficulty}
                </span>
            </div>

            {/* Quick Stats/Tags */}
            <div className="flex gap-2 mb-8 flex-wrap">
                {problem.platformSource && (
                    <span className="rounded-md bg-white/5 px-2.5 py-1 text-[10px] font-bold text-text-muted border border-white/10 uppercase">
                        {problem.platformSource}
                    </span>
                )}
                {problem.timeComplexity && (
                    <span className="rounded-md bg-white/5 px-2.5 py-1 text-[10px] font-bold text-text-muted border border-white/10 uppercase">
                        T: O({problem.timeComplexity})
                    </span>
                )}
                {tags.map((tag: string) => (
                    <span key={tag} className="rounded-md bg-accent-purple/10 px-2.5 py-1 text-[10px] font-bold text-accent-purple border border-accent-purple/20 uppercase">
                        {tag}
                    </span>
                ))}
            </div>

            {/* Description Body */}
            <div className="prose prose-invert prose-sm max-w-none text-text-secondary leading-relaxed">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {problem.description}
                </ReactMarkdown>
            </div>

            {/* Examples */}
            {examples && Array.isArray(examples) && examples.length > 0 && (
                <div className="mt-10 space-y-6">
                    <h3 className="text-sm font-bold text-text-primary uppercase tracking-widest border-l-2 border-accent-cyan pl-3">Examples</h3>
                    {examples.map((ex: any, i: number) => (
                        <div key={i} className="rounded-xl bg-white/[0.03] p-5 border border-white/10 shadow-inner">
                            <div className="space-y-3">
                                <div>
                                    <span className="text-[10px] font-bold text-text-muted uppercase mb-1 block">Input</span>
                                    <div className="font-mono text-sm text-text-primary bg-black/20 p-2 rounded border border-white/5">
                                        {ex.input}
                                    </div>
                                </div>
                                <div>
                                    <span className="text-[10px] font-bold text-text-muted uppercase mb-1 block">Output</span>
                                    <div className="font-mono text-sm text-accent-cyan bg-accent-cyan/5 p-2 rounded border border-accent-cyan/10">
                                        {ex.output}
                                    </div>
                                </div>
                                {ex.explanation && (
                                    <div>
                                        <span className="text-[10px] font-bold text-text-muted uppercase mb-1 block">Explanation</span>
                                        <p className="text-xs text-text-muted italic leading-normal">
                                            {ex.explanation}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Constraints */}
            {problem.constraints && (
                <div className="mt-10 mb-6">
                    <h3 className="text-sm font-bold text-text-primary uppercase tracking-widest border-l-2 border-accent-purple pl-3 mb-4">Constraints</h3>
                    <div className="rounded-xl bg-surface-card p-5 border border-white/10">
                        <div className="prose prose-invert prose-xs text-text-secondary">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {problem.constraints}
                            </ReactMarkdown>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
