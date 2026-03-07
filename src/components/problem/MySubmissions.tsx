"use client";

import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Loader2, Code2, Globe, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { LanguageBadge } from "@/components/ui/LanguageBadge";
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
  const [isPublicLoading, setIsPublicLoading] = useState<string | null>(null);
  const [shareDialog, setShareDialog] = useState<{ isOpen: boolean; submissionId: string; description: string } | null>(null);
  const [expandedSubmission, setExpandedSubmission] = useState<string | null>(null);

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

  const togglePublic = async (submissionId: string, currentStatus: boolean, description?: string) => {
    setIsPublicLoading(submissionId);
    try {
      const res = await fetch(`/api/submissions/${submissionId}/public`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          isPublic: !currentStatus,
          publicDescription: description
        }),
      });
      if (res.ok) {
        setSubmissions((prev) =>
          prev.map((sub) =>
            sub.id === submissionId ? { ...sub, isPublic: !currentStatus, publicDescription: description } : sub
          )
        );
        setShareDialog(null);
      }
    } catch (error) {
      console.error("Failed to update public status", error);
    } finally {
      setIsPublicLoading(null);
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
          className="rounded-xl border border-white/10 bg-surface-card p-4 transition-colors hover:bg-white/[0.01]"
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
              <LanguageBadge language={sub.language} size="sm" />
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

          {sub.isPublic && sub.publicDescription && (
            <div className="mb-4 rounded-md bg-white/5 p-2.5 text-xs text-text-secondary border border-white/5">
              <span className="text-accent-cyan font-bold mr-2">Public Note:</span>
              <span className="italic">"{sub.publicDescription}"</span>
            </div>
          )}

          <div className="flex items-center gap-2 mb-3">
            <button
              onClick={() => setExpandedSubmission(expandedSubmission === sub.id ? null : sub.id)}
              className="flex-1 rounded-md bg-white/5 py-1.5 text-xs font-medium text-white transition-colors hover:bg-white/10"
            >
              {expandedSubmission === sub.id ? "Hide Code" : "Show Code"}
            </button>
            <button
              disabled={isPublicLoading === sub.id}
              onClick={() => {
                if (sub.isPublic) {
                  togglePublic(sub.id, true);
                } else {
                  setShareDialog({ isOpen: true, submissionId: sub.id, description: "" });
                }
              }}
              className={cn(
                "flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                sub.isPublic
                  ? "bg-accent-cyan/10 text-accent-cyan hover:bg-accent-cyan/20 border border-accent-cyan/30"
                  : "bg-accent-purple/20 text-accent-purple hover:bg-accent-purple/30 border border-accent-purple/40 shadow-sm"
              )}
            >
              {isPublicLoading === sub.id ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : sub.isPublic ? (
                <>
                  <Globe className="h-4 w-4" />
                  <span>Public</span>
                </>
              ) : (
                <>
                  <Share2 className="h-4 w-4" />
                  <span>Share Solution</span>
                </>
              )}
            </button>
          </div>

          {expandedSubmission === sub.id && (
            <div className="mt-2 rounded-md overflow-hidden bg-black/40 border border-white/5 p-3 animate-in fade-in slide-in-from-top-2 duration-200">
              <pre className="text-xs font-mono text-text-secondary max-h-[300px] overflow-y-auto thin-scrollbar">
                <code>{sub.code}</code>
              </pre>
            </div>
          )}
        </div>
      ))}

      <Dialog open={!!shareDialog} onOpenChange={(open) => !open && setShareDialog(null)}>
        <DialogContent className="max-w-md bg-surface-base/95 backdrop-blur-xl border-white/10 text-text-primary shadow-2xl">
          <DialogHeader>
            <DialogTitle>Share Solution</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-text-muted">
              Make your solution public for others to see. You can add a short note about your approach.
            </p>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider text-text-muted">Message (optional)</label>
              <textarea
                className="w-full rounded-md border border-white/10 bg-white/5 p-3 text-sm focus:border-accent-cyan focus:outline-none transition-colors"
                placeholder="Explain your approach..."
                rows={3}
                value={shareDialog?.description || ""}
                onChange={(e) => setShareDialog(prev => prev ? { ...prev, description: e.target.value } : null)}
              />
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShareDialog(null)}
                className="flex-1 rounded-md bg-white/5 py-2 text-sm font-medium hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => shareDialog && togglePublic(shareDialog.submissionId, false, shareDialog.description)}
                className="flex-1 rounded-md bg-accent-cyan py-2 text-sm font-bold text-black hover:bg-accent-cyan/90 transition-colors"
              >
                Make Public
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
