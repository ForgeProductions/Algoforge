"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Flame, Trophy } from "lucide-react";

interface StreakCalendarProps {
    /** Array of date strings (YYYY-MM-DD) when the user solved at least one problem */
    activeDates: string[];
    currentStreak: number;
    bestStreak: number;
}

const MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
];
const DAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

export function StreakCalendar({
    activeDates,
    currentStreak,
    bestStreak,
}: StreakCalendarProps) {
    const [displayDate, setDisplayDate] = useState(() => new Date());
    const [now, setNow] = useState(new Date());

    // Live countdown timer
    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

    const activeSet = new Set(activeDates);

    const year = displayDate.getFullYear();
    const month = displayDate.getMonth();

    // First day of month (0=Sun..6=Sat) and number of days
    const firstDayOfWeek = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Day number in the year
    const startOfYear = new Date(year, 0, 0);
    const diff = today.getTime() - startOfYear.getTime();
    const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));

    // Time left in the day
    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);
    const msLeft = Math.max(0, endOfDay.getTime() - now.getTime());
    const hoursLeft = Math.floor(msLeft / (1000 * 60 * 60));
    const minutesLeft = Math.floor((msLeft % (1000 * 60 * 60)) / (1000 * 60));
    const secondsLeft = Math.floor((msLeft % (1000 * 60)) / 1000);

    const prevMonth = () => {
        setDisplayDate(new Date(year, month - 1, 1));
    };
    const nextMonth = () => {
        const nextDate = new Date(year, month + 1, 1);
        if (nextDate <= today) {
            setDisplayDate(nextDate);
        }
    };

    // Build grid cells
    const cells: (number | null)[] = [];
    for (let i = 0; i < firstDayOfWeek; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);

    const isToday = (day: number) => {
        return year === today.getFullYear() && month === today.getMonth() && day === today.getDate();
    };

    const isActive = (day: number) => {
        const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        return activeSet.has(dateStr);
    };

    const isFuture = (day: number) => {
        const date = new Date(year, month, day);
        return date > today;
    };

    return (
        <div className="flex flex-col w-full max-w-[340px]">
            {/* Header: Month navigation */}
            <div className="flex items-center justify-between mb-3">
                <button
                    onClick={prevMonth}
                    className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-text-secondary hover:text-text-primary"
                >
                    <ChevronLeft className="h-4 w-4" />
                </button>
                <h3 className="text-base font-bold text-text-primary">
                    {MONTH_NAMES[month]} {year}
                </h3>
                <button
                    onClick={nextMonth}
                    className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-text-secondary hover:text-text-primary disabled:opacity-30 disabled:hover:bg-transparent"
                    disabled={new Date(year, month + 1, 1) > today}
                >
                    <ChevronRight className="h-4 w-4" />
                </button>
            </div>

            {/* Day info row */}
            <div className="flex items-center justify-between mb-3 px-1">
                <span className="text-sm font-bold text-text-primary">
                    Day {dayOfYear}
                </span>
                <span className="text-xs font-mono text-text-muted">
                    {String(hoursLeft).padStart(2, "0")} : {String(minutesLeft).padStart(2, "0")} : {String(secondsLeft).padStart(2, "0")} left
                </span>
            </div>

            {/* Day labels */}
            <div className="grid grid-cols-7 gap-1 mb-1">
                {DAY_LABELS.map((label, i) => (
                    <div
                        key={i}
                        className="h-8 flex items-center justify-center text-xs font-semibold text-text-muted"
                    >
                        {label}
                    </div>
                ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1">
                {cells.map((day, i) => {
                    if (day === null) {
                        return <div key={`empty-${i}`} className="h-9" />;
                    }

                    const todayMatch = isToday(day);
                    const active = isActive(day);
                    const future = isFuture(day);

                    return (
                        <div
                            key={day}
                            className={`
                h-9 flex items-center justify-center rounded-full text-sm font-medium transition-all duration-200
                ${todayMatch
                                    ? "ring-2 ring-accent-purple text-text-primary font-bold"
                                    : active
                                        ? "bg-accent-green/20 text-accent-green font-semibold"
                                        : future
                                            ? "text-text-muted/40"
                                            : "text-text-muted hover:bg-white/5"
                                }
              `}
                        >
                            {day}
                        </div>
                    );
                })}
            </div>

            {/* Streak stats */}
            <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="flex items-center gap-2.5 rounded-xl bg-white/5 p-3 border border-white/5">
                    <Flame className="h-5 w-5 text-orange-400" />
                    <div>
                        <p className="text-xs text-text-muted">Current Streak</p>
                        <p className="text-sm font-bold text-text-primary">{currentStreak} days</p>
                    </div>
                </div>
                <div className="flex items-center gap-2.5 rounded-xl bg-white/5 p-3 border border-white/5">
                    <Trophy className="h-5 w-5 text-yellow-400" />
                    <div>
                        <p className="text-xs text-text-muted">Best Streak</p>
                        <p className="text-sm font-bold text-text-primary">{bestStreak} days</p>
                    </div>
                </div>
            </div>

            {/* Footer message */}
            <p className="text-xs text-text-muted text-center mt-3 flex items-center justify-center gap-1.5">
                <span>🔥</span> Solve one problem a day to keep your streak
            </p>
        </div>
    );
}
