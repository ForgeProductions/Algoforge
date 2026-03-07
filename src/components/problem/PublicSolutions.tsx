"use client";

import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Loader2, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { LanguageBadge } from "@/components/ui/LanguageBadge";

interface PublicSolutionsProps {
  problemId: string;
}

export function PublicSolutions({ problemId }: PublicSolutionsProps) {
  const [solutions, setSolutions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedSolution, setExpandedSolution] = useState<string | null>(null);

  const fetchSolutions = async () => {
    try {
      const res = await fetch(`/api/submissions/public?problemId=${problemId}`);
      if (res.ok) {
        const data = await res.json();
        setSolutions(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch public solutions", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSolutions();
  }, [problemId]);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <Loader2 className="h-6 w-6 animate-spin text-accent-purple" />
      </div>
    );
  }

  if (solutions.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-6 text-center">
        <Users className="mb-4 h-12 w-12 text-white/10" />
        <p className="text-text-muted">No one has shared their solution for this problem yet. Be the first!</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      {solutions.map((sol) => (
        <div
          key={sol.id}
          className="rounded-xl border border-white/10 bg-surface-card p-4 transition-colors hover:bg-white/[0.01]"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-bold text-text-primary">
              {sol.user.name || `@${sol.user.username}`}
            </span>
            <span className="text-xs text-text-muted">
              {formatDistanceToNow(new Date(sol.createdAt), { addSuffix: true })}
            </span>
          </div>

          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <LanguageBadge language={sol.language} />
            {sol.runtime !== null && (
              <span className="rounded-md bg-accent-cyan/10 px-2.5 py-1 text-[10px] font-bold text-accent-cyan border border-accent-cyan/20 font-mono">
                {sol.runtime} ms
              </span>
            )}
            {sol.memory !== null && (
              <span className="rounded-md bg-accent-purple/10 px-2.5 py-1 text-[10px] font-bold text-accent-purple border border-accent-purple/20 font-mono">
                {(sol.memory / 1024).toFixed(1)} MB
              </span>
            )}
          </div>

          {sol.publicDescription && (
            <div className="mb-4 rounded-md bg-white/5 p-3 text-xs text-text-secondary border border-white/5 relative overflow-hidden group border-l-2 border-l-accent-purple/50">
              <p className="italic text-text-primary/90 leading-relaxed group-hover:text-white transition-colors">
                "{sol.publicDescription}"
              </p>
            </div>
          )}

          <button
            onClick={() => setExpandedSolution(expandedSolution === sol.id ? null : sol.id)}
            className="w-full rounded-md bg-white/5 py-2 text-xs font-medium text-white transition-colors hover:bg-white/10 border border-white/10"
          >
            {expandedSolution === sol.id ? "Hide Solution" : "View Solution"}
          </button>

          {expandedSolution === sol.id && (
            <div className="mt-3 rounded-md overflow-hidden bg-black/40 border border-white/5 p-4 animate-in fade-in slide-in-from-top-2 duration-200 shadow-inner">
              <pre className="text-xs font-mono text-text-secondary max-h-[400px] overflow-y-auto thin-scrollbar leading-relaxed">
                <code className="block">{sol.code}</code>
              </pre>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
