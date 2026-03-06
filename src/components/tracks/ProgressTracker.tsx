"use client";

import { useEffect, useState, useRef } from "react";

interface ProgressTrackerProps {
    total: number;
    easy: number;
    medium: number;
    hard: number;
    solvedEasy: number;
    solvedMedium: number;
    solvedHard: number;
}

export function ProgressTracker({
    total, easy, medium, hard,
    solvedEasy, solvedMedium, solvedHard
}: ProgressTrackerProps) {
    const solved = solvedEasy + solvedMedium + solvedHard;
    const [animatedSolved, setAnimatedSolved] = useState(0);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Animate the number counting up
        const duration = 1200;
        const steps = 30;
        const increment = solved / steps;
        let current = 0;
        const timer = setInterval(() => {
            current += increment;
            if (current >= solved) {
                setAnimatedSolved(solved);
                clearInterval(timer);
            } else {
                setAnimatedSolved(Math.floor(current));
            }
        }, duration / steps);
        return () => clearInterval(timer);
    }, [solved]);

    // SVG donut chart parameters
    const size = 180;
    const strokeWidth = 14;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;

    // Calculate arc lengths for each segment
    const solvedFraction = total === 0 ? 0 : solved / total;
    const easyFraction = total === 0 ? 0 : solvedEasy / total;
    const mediumFraction = total === 0 ? 0 : solvedMedium / total;
    const hardFraction = total === 0 ? 0 : solvedHard / total;

    // Gap between segments (in fraction)
    const gap = total === 0 ? 0 : 0.008;
    const segments = [
        { fraction: easyFraction, color: "#00b8a3" },   // green/teal
        { fraction: mediumFraction, color: "#ffc01e" },  // yellow/amber
        { fraction: hardFraction, color: "#ff375f" },    // red/pink
    ].filter(s => s.fraction > 0);

    // Background arc (remaining unsolved)
    const remainingFraction = 1 - solvedFraction;

    // Build segment offsets
    let cumulativeOffset = 0;
    const segmentArcs = segments.map((seg, i) => {
        const adjustedFraction = seg.fraction - (segments.length > 1 ? gap : 0);
        const dashArray = `${adjustedFraction * circumference} ${circumference}`;
        const rotation = cumulativeOffset * 360 - 90; // start from top
        cumulativeOffset += seg.fraction;
        return { ...seg, dashArray, rotation, adjustedFraction };
    });

    // Small glowing dots at segment boundaries
    const dotPositions = (() => {
        const dots: { x: number; y: number; color: string }[] = [];
        let cumFrac = 0;
        for (const seg of segments) {
            // Dot at the start of each segment
            const startAngle = cumFrac * 2 * Math.PI - Math.PI / 2;
            dots.push({
                x: size / 2 + radius * Math.cos(startAngle),
                y: size / 2 + radius * Math.sin(startAngle),
                color: seg.color,
            });
            cumFrac += seg.fraction;
        }
        return dots;
    })();

    return (
        <div className="flex items-center gap-8">
            {/* Left: Difficulty breakdown */}
            <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold" style={{ color: "#00b8a3" }}>Easy</span>
                    <span className="text-sm font-mono text-text-secondary">
                        {solvedEasy}/{easy}
                    </span>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold" style={{ color: "#ffc01e" }}>Med</span>
                    <span className="text-sm font-mono text-text-secondary">
                        {solvedMedium}/{medium}
                    </span>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold" style={{ color: "#ff375f" }}>Hard</span>
                    <span className="text-sm font-mono text-text-secondary">
                        {solvedHard}/{hard}
                    </span>
                </div>
            </div>

            {/* Right: SVG donut chart */}
            <div className="relative">
                <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                    {/* Background circle */}
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        fill="none"
                        stroke="rgba(255,255,255,0.08)"
                        strokeWidth={strokeWidth}
                    />

                    {/* Solved segments */}
                    {mounted && segmentArcs.map((seg, i) => (
                        <circle
                            key={i}
                            cx={size / 2}
                            cy={size / 2}
                            r={radius}
                            fill="none"
                            stroke={seg.color}
                            strokeWidth={strokeWidth}
                            strokeDasharray={seg.dashArray}
                            strokeDashoffset={0}
                            strokeLinecap="round"
                            transform={`rotate(${seg.rotation} ${size / 2} ${size / 2})`}
                            style={{
                                transition: "stroke-dasharray 1.2s ease-out",
                                filter: `drop-shadow(0 0 6px ${seg.color}50)`,
                            }}
                        />
                    ))}

                    {/* Glowing dots at segment boundaries */}
                    {mounted && dotPositions.map((dot, i) => (
                        <circle
                            key={`dot-${i}`}
                            cx={dot.x}
                            cy={dot.y}
                            r={4}
                            fill={dot.color}
                            style={{
                                filter: `drop-shadow(0 0 4px ${dot.color})`,
                            }}
                        />
                    ))}
                </svg>

                {/* Center text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-text-primary">
                        {mounted ? animatedSolved : 0}
                    </span>
                    <span className="text-xs text-text-muted font-mono">/{total}</span>
                    <span className="text-xs text-text-secondary mt-0.5">Solved</span>
                </div>
            </div>
        </div>
    );
}
