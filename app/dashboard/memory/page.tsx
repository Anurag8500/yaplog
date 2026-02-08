"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp, Lock } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// --- Utility ---
function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// --- Types ---
type DayData = {
    id: string;
    date: string;
    isToday?: boolean;
    essence: string;
    highlights?: string[];
    rawInputs: string[];
    structuredUnderstanding: string[];
    summary: string;
};

// --- Mock Data ---
const MEMORY_DATA: DayData[] = [
    {
        id: "today",
        date: "Today, 8 Feb 2026",
        isToday: true,
        essence:
            "Focused technical work with brief distraction. Clear intent to revise tomorrow.",
        highlights: ["DSA Practice", "Focus Dip", "Revision Planned"],
        rawInputs: [
            "Solved 30 DSA questions",
            "Got distracted after lunch",
            "Need to revise tomorrow",
            "Feeling a bit overwhelmed by the system design stuff",
        ],
        structuredUnderstanding: [
            "Completed a significant block of DSA practice (30 questions)",
            "Experienced reduced focus during the afternoon session",
            "Identified a requirement for revision the following day",
            "Expressed feeling overwhelmed regarding system design concepts",
        ],
        summary:
            "A productive day focused on technical practice, despite some mid-day distraction. There is a clear intention to consolidate learning tomorrow.",
    },
    {
        id: "day-1",
        date: "Monday, 7 Feb 2026",
        essence: "New reading habit started, fitness routine reconsidered.",
        highlights: ["Reading", "Fitness Goal", "Coffee Taste"],
        rawInputs: [
            "Started reading the new sci-fi book",
            "Thinking about changing my workout routine",
            "The coffee at the new place was too bitter",
        ],
        structuredUnderstanding: [
            "Began reading a new science fiction novel",
            "Considering modifications to current fitness regimen",
            "Noted dissatisfaction with coffee quality at a new location",
        ],
        summary:
            "A day marked by new beginnings in leisure reading and contemplation of routine adjustments. Sensory preferences regarding coffee were also noted.",
    },
    {
        id: "day-2",
        date: "Sunday, 6 Feb 2026",
        essence: "Deep work on landing page, balanced with life admin.",
        highlights: ["Coding Mode", "Family", "Errands"],
        rawInputs: [
            "Spent all day coding the landing page",
            "Forgot to call mom",
            "Need to buy groceries",
        ],
        structuredUnderstanding: [
            "Dedicated entire day to landing page development",
            "Acknowledged missed communication with mother",
            "Identified need for grocery shopping",
        ],
        summary:
            "High productivity in coding tasks, with a reminder to attend to personal relationships and household necessities.",
    },
    {
        id: "day-3",
        date: "Saturday, 5 Feb 2026",
        essence: "Physical activity boosting mood, followed by strategic planning.",
        highlights: ["Running", "High Energy", "Quarterly Review"],
        rawInputs: [
            "Went for a long run in the morning",
            "Felt great afterwards",
            "Reviewing Q1 goals",
        ],
        structuredUnderstanding: [
            "Completed a long-distance morning run",
            "Reported positive post-exercise physical and mental state",
            "Engaged in review of first-quarter objectives",
        ],
        summary:
            "A physically active start to the weekend contributing to a positive mood, followed by strategic planning and goal review.",
    },
];

// --- Components ---

const DetailSection = ({
    title,
    children,
    className,
}: {
    title: string;
    children: React.ReactNode;
    className?: string;
}) => (
    <div className={cn("space-y-3", className)}>
        <h4 className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
            {title}
        </h4>
        {children}
    </div>
);

const Chip = ({ label }: { label: string }) => (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-zinc-800/50 text-zinc-400 border border-zinc-800">
        {label}
    </span>
);

const MemoryCard = ({ data }: { data: DayData }) => {
    const [isExpanded, setIsExpanded] = useState(data.isToday || false);

    return (
        <div
            className={cn(
                "group relative rounded-2xl border transition-all duration-500 overflow-hidden",
                data.isToday
                    ? "bg-zinc-900/40 border-yellow-500/20 shadow-[0_0_30px_-10px_rgba(234,179,8,0.1)]"
                    : "bg-zinc-900/20 border-zinc-800 hover:bg-zinc-900/30 hover:border-zinc-700/50"
            )}
        >
            {/* 1. Header / Essence Layer (Always Visible) */}
            <div
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-6 cursor-pointer select-none"
            >
                <div className="flex justify-between items-start gap-4">
                    <div className="space-y-4 flex-1">
                        <div className="flex items-center gap-3">
                            <h3
                                className={cn(
                                    "text-base font-medium",
                                    data.isToday ? "text-yellow-500" : "text-zinc-200"
                                )}
                            >
                                {data.date}
                            </h3>
                            {data.isToday && (
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
                                </span>
                            )}
                        </div>

                        <p className="text-lg md:text-xl font-light text-zinc-300 leading-relaxed max-w-2xl">
                            {data.essence}
                        </p>

                        {data.highlights && data.highlights.length > 0 && (
                            <div className="flex flex-wrap gap-2 pt-1">
                                {data.highlights.map((tag) => (
                                    <Chip key={tag} label={tag} />
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="pt-1 text-zinc-600 group-hover:text-zinc-400 transition-colors">
                        {isExpanded ? (
                            <ChevronUp className="w-5 h-5" />
                        ) : (
                            <ChevronDown className="w-5 h-5" />
                        )}
                    </div>
                </div>
            </div>

            {/* 2. Expandable Details Layer */}
            <div
                className={cn(
                    "grid transition-[grid-template-rows] duration-500 ease-in-out",
                    isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                )}
            >
                <div className="overflow-hidden">
                    <div className="px-6 pb-6 pt-2 border-t border-zinc-800/30">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 mt-6">
                            {/* A. What you said */}
                            <DetailSection title="What you shared">
                                <ul className="space-y-3">
                                    {data.rawInputs.map((item, idx) => (
                                        <li
                                            key={idx}
                                            className="flex gap-3 text-zinc-500 font-light text-sm leading-relaxed"
                                        >
                                            <span className="text-zinc-700 mt-1.5 text-[6px]">
                                                ●
                                            </span>
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </DetailSection>

                            {/* B. What YAPLOG understood */}
                            <DetailSection title="What YAPLOG understood">
                                <ul className="space-y-3">
                                    {data.structuredUnderstanding.map((item, idx) => (
                                        <li
                                            key={idx}
                                            className="flex gap-3 text-zinc-300 text-sm leading-relaxed"
                                        >
                                            <span className="text-yellow-500/50 mt-1.5 text-[8px]">
                                                ❖
                                            </span>
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </DetailSection>
                        </div>

                        {/* C. Daily Summary */}
                        <div className="mt-8 pt-8 border-t border-zinc-800/30">
                            <h4 className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-3">
                                Daily summary
                            </h4>
                            <p className="text-zinc-400 font-light italic text-sm leading-relaxed max-w-3xl">
                                {data.summary}
                            </p>
                        </div>

                        {/* 3. Trust Footer (Only visible when expanded, mainly for Today) */}
                        {data.isToday && (
                            <div className="mt-8 pt-6 border-t border-zinc-800/30 flex items-center justify-center gap-2 text-[10px] text-zinc-700 uppercase tracking-widest font-medium opacity-60">
                                <Lock className="w-3 h-3" />
                                <span>Encrypted</span>
                                <span className="w-0.5 h-0.5 bg-zinc-700 rounded-full mx-1"></span>
                                <span>Private</span>
                                <span className="w-0.5 h-0.5 bg-zinc-700 rounded-full mx-1"></span>
                                <span>Stored locally to you</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function MemoryPage() {
    const todayData = MEMORY_DATA.find((d) => d.isToday);
    const previousDays = MEMORY_DATA.filter((d) => !d.isToday);

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-zinc-200 px-6 py-16 md:px-12 lg:px-24 max-w-4xl mx-auto font-sans selection:bg-yellow-500/20 selection:text-yellow-200">
            {/* Page Header */}
            {/* Page Header */}
            <header className="text-center mb-12 space-y-3 relative z-10">
                <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-white drop-shadow-xl uppercase">
                    Memory
                </h1>
                <p className="text-neutral-400 font-medium text-sm tracking-wide opacity-80">
                    Your life, structured and remembered over time.
                </p>
                {/* Subtle separator */}
                <div className="w-12 h-1 bg-yellow-500/20 rounded-full mx-auto mt-6" />
            </header>

            {/* Section 1: Today */}
            <section className="mb-20">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-sm font-medium text-zinc-400 uppercase tracking-wider">
                        Today
                    </h2>
                    <span className="text-xs text-yellow-500/60 animate-pulse">
                        Updates automatically as you talk
                    </span>
                </div>

                {todayData && <MemoryCard data={todayData} />}
            </section>

            {/* Section 2: Previous Days */}
            <section className="mb-24">
                <h2 className="text-sm font-medium text-zinc-500 uppercase tracking-wider mb-6">
                    Previous Days
                </h2>

                <div className="space-y-4">
                    {previousDays.map((day) => (
                        <MemoryCard key={day.id} data={day} />
                    ))}
                </div>
            </section>
        </div>
    );
}
