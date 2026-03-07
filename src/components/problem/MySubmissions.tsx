"use client";

import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Loader2, Code2, Globe, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface MySubmissionsProps {
  problemId: string;
  user: any;
}

export function MySubmissions({ problemId, user }: MySubmissionsProps) {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCode, setSelectedCode] = useState<string | null>(null);

  const fetchSubmissions = async () => {
    try {
      const res = await fetch(`/api/submissions?problemId=${problemId}`);
      if (res.ok) {
        const data = await res.json();
        setSubmissions(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch submissions", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchSubmissions();
    } else {
      setLoading(false);
    }
  }, [problemId, user]);

  const togglePublic = async (submissionId: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/submissions/${submissionId}/public`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublic: !currentStatus }),
      });
      if (res.ok) {
        setSubmissions((prev) =>
          prev.map((sub) =>
            sub.id === submissionId ? { ...sub, isPublic: !currentStatus } : sub
          )
        );
      }
    } catch (error) {
      console.error("Failed to update public status", error);
    }
  };

  if (!user) {
    return (
      <div className="flex h-full items-center justify-center p-6 text-center text-text-muted">
        Please log in to view your submissions.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <Loader2 className="h-6 w-6 animate-spin text-accent-cyan" />
      </div>
    );
  }

  if (submissions.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-6 text-center">
        <Code2 className="mb-4 h-12 w-12 text-white/10" />
        <p className="text-text-muted">You have not submitted any solutions for this problem yet.</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      {submissions.map((sub) => (
        <div
          key={sub.id}
          className="rounded-xl border border-white/10 bg-surface-card p-4 transition-colors hover:bg-white/[0.03]"
        >
          <div className="flex items-center justify-between mb-3">
            <span
              className={cn(
                "text-sm font-bold uppercase tracking-wide",
                sub.status === "ACCEPTED"
                  ? "text-accent-green"
                  : sub.status === "PENDING" || sub.status === "RUNNING"
                  ? "text-accent-yellow"
                  : "text-difficulty-hard"
              )}
            >
              {sub.status.replace(/_/g, " ")}
            </span>
            <span className="text-xs text-text-muted">
              {formatDistanceToNow(new Date(sub.createdAt), { addSuffix: true })}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 mb-4 text-xs text-text-secondary">
            <div>
              <span className="block text-text-muted mb-1 uppercase text-[10px] tracking-wider">Language</span>
              <span className="font-mono">{sub.language}</span>
            </div>
            <div>
              <span className="block text-text-muted mb-1 uppercase text-[10px] tracking-wider">Runtime</span>
              <span className="font-mono">{sub.runtime !== null ? `${sub.runtime} ms` : "N/A"}</span>
            </div>
            <div>
              <span className="block text-text-muted mb-1 uppercase text-[10px] tracking-wider">Memory</span>
              <span className="font-mono">{sub.memory !== null ? `${(sub.memory / 1024).toFixed(1)} MB` : "N/A"}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 border-t border-white/10 pt-3">
            <button
              onClick={() => setSelectedCode(sub.code)}
              className="flex-1 rounded-md bg-white/5 py-1.5 text-xs font-medium text-white transition-colors hover:bg-white/10"
            >
              View Code
            </button>
            <button
              onClick={() => togglePublic(sub.id, sub.isPublic)}
              className={cn(
                "flex items-center justify-center rounded-md p-1.5 transition-colors",
                sub.isPublic
                  ? "bg-accent-cyan/10 text-accent-cyan hover:bg-accent-cyan/20"
                  : "bg-white/5 text-text-muted hover:bg-white/10"
              )}
              title={sub.isPublic ? "Make Private" : "Make Public"}
            >
              {sub.isPublic ? <Globe className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
            </button>
          </div>
        </div>
      ))}

      <Dialog open={!!selectedCode} onOpenChange={(open) => !open && setSelectedCode(null)}>
        <DialogContent className="max-w-3xl bg-surface-base border-white/10">
          <DialogHeader>
            <DialogTitle className="text-text-primary">Submission Code</DialogTitle>
          </DialogHeader>
          <div className="mt-4 rounded-md overflow-hidden bg-black/40 border border-white/10 p-4 max-h-[60vh] overflow-y-auto">
            <pre className="text-sm font-mono text-text-secondary">
              <code>{selectedCode}</code>
            </pre>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
