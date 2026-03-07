"use client";

import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Loader2, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface PublicSolutionsProps {
  problemId: string;
}

export function PublicSolutions({ problemId }: PublicSolutionsProps) {
  const [solutions, setSolutions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCode, setSelectedCode] = useState<{ code: string; username: string } | null>(null);

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
          className="rounded-xl border border-white/10 bg-surface-card p-4 transition-colors hover:bg-white/[0.03]"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-bold text-text-primary">
              {sol.user.username}
            </span>
            <span className="text-xs text-text-muted">
              {formatDistanceToNow(new Date(sol.createdAt), { addSuffix: true })}
            </span>
          </div>

          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <span className="rounded-md bg-white/5 px-2.5 py-1 text-[10px] font-bold text-text-muted border border-white/10 uppercase">
              {sol.language}
            </span>
            {sol.runtime !== null && (
              <span className="rounded-md bg-accent-cyan/10 px-2.5 py-1 text-[10px] font-bold text-accent-cyan border border-accent-cyan/20">
                {sol.runtime} ms
              </span>
            )}
            {sol.memory !== null && (
              <span className="rounded-md bg-accent-purple/10 px-2.5 py-1 text-[10px] font-bold text-accent-purple border border-accent-purple/20">
                {(sol.memory / 1024).toFixed(1)} MB
              </span>
            )}
          </div>

          <button
            onClick={() => setSelectedCode({ code: sol.code, username: sol.user.username })}
            className="w-full rounded-md bg-white/5 py-2 text-xs font-medium text-white transition-colors hover:bg-white/10"
          >
            View Solution
          </button>
        </div>
      ))}

      <Dialog open={!!selectedCode} onOpenChange={(open) => !open && setSelectedCode(null)}>
        <DialogContent className="max-w-3xl bg-surface-base border-white/10">
          <DialogHeader>
            <DialogTitle className="text-text-primary">Solution by {selectedCode?.username}</DialogTitle>
          </DialogHeader>
          <div className="mt-4 rounded-md overflow-hidden bg-black/40 border border-white/10 p-4 max-h-[60vh] overflow-y-auto">
            <pre className="text-sm font-mono text-text-secondary">
              <code>{selectedCode?.code}</code>
            </pre>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
