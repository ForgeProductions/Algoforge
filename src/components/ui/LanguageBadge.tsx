import { cn } from "@/lib/utils";

interface LanguageBadgeProps {
    language: string;
    className?: string;
    size?: "sm" | "md";
}

export function LanguageBadge({ language, className, size = "md" }: LanguageBadgeProps) {
    const lang = language.toLowerCase();

    const colors = {
        javascript: "bg-accent-yellow/10 text-accent-yellow border-accent-yellow/20",
        typescript: "bg-accent-yellow/10 text-accent-yellow border-accent-yellow/20",
        python: "bg-accent-cyan/10 text-accent-cyan border-accent-cyan/20",
        cpp: "bg-accent-purple/10 text-accent-purple border-accent-purple/20",
        java: "bg-accent-red/10 text-accent-red border-accent-red/20",
        default: "bg-white/5 text-text-muted border-white/10",
    };

    const colorClass = (colors as any)[lang] || colors.default;

    return (
        <span
            className={cn(
                "font-mono font-bold border uppercase transition-colors shrink-0",
                size === "sm" ? "px-1.5 py-0.5 text-[10px] rounded" : "px-2.5 py-1 text-[10px] rounded-md",
                colorClass,
                className
            )}
        >
            {language}
        </span>
    );
}
