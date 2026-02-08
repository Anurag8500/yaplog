"use client";

import React, { useState, useRef, useEffect } from "react";
import { Sparkles, ArrowRight, CornerDownLeft, Search, Mic } from "lucide-react";
import Link from "next/link";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// --- Utility ---
function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// --- Mock Data ---
const MOCK_ANSWER = {
    textPoints: [
        "You studied DSA on 4 different days.",
        "Focus was strongest in the morning sessions.",
        "Distraction often occurred after lunch.",
        "You consistently planned revision for the next day.",
    ],
    contextNote: "Based on entries from Feb 1 – Feb 8",
    evidence: [
        {
            id: "ev-1",
            date: "Feb 6",
            snippet: "Solved 30 DSA questions, focus dipped after lunch",
            link: "/dashboard/memory#day-2", // Mock link
        },
        {
            id: "ev-2",
            date: "Feb 8",
            snippet: "Planned revision for the following morning",
            link: "/dashboard/memory#today", // Mock link
        },
    ],
};

const SUGGESTIONS = [
    "What did I do last week?",
    "When did I last study DSA?",
    "How productive was I this month?",
    "What patterns do you notice in my focus?",
    "Summarize my recent progress",
];

export default function AskPage() {
    const [query, setQuery] = useState("");
    const [status, setStatus] = useState<"idle" | "searching" | "answered">(
        "idle"
    );
    const [answer, setAnswer] = useState<typeof MOCK_ANSWER | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        setStatus("searching");
        setAnswer(null);

        // Mock API call
        setTimeout(() => {
            setStatus("answered");
            setAnswer(MOCK_ANSWER);
        }, 1500);
    };

    const handleSuggestionClick = (suggestion: string) => {
        setQuery(suggestion);
        inputRef.current?.focus();
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-zinc-200 px-6 py-12 md:px-12 lg:px-24 max-w-4xl mx-auto font-sans selection:bg-yellow-500/20 selection:text-yellow-200">
            {/* 1. Page Header */}
            {/* 1. Page Header */}
            <header className="text-center mb-12 space-y-3 relative z-10">
                <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-white drop-shadow-xl uppercase">
                    Ask
                </h1>
                <p className="text-neutral-400 font-medium text-sm tracking-wide opacity-80">
                    Ask your memory questions. I’ll find the answer.
                </p>
                {/* Subtle separator */}
                <div className="w-12 h-1 bg-yellow-500/20 rounded-full mx-auto mt-6" />
            </header>

            {/* 2. Ask Input Section */}
            <section className="mb-16">
                <form onSubmit={handleSubmit} className="relative max-w-2xl mx-auto md:mx-0">
                    <div className="relative group">
                        <input
                            ref={inputRef}
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Ask your memory anything..."
                            className="w-full bg-zinc-900/50 border border-zinc-800 text-white p-5 pr-14 rounded-2xl focus:outline-none focus:ring-1 focus:ring-yellow-500/50 focus:border-yellow-500/50 transition-all placeholder:text-zinc-600 text-lg shadow-xl shadow-black/20"
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-3">
                            {query.length === 0 && (
                                <Mic className="w-5 h-5 text-zinc-600" />
                            )}
                            {query.length > 0 && (
                                <button
                                    type="submit"
                                    disabled={status === "searching"}
                                    className="bg-yellow-500 text-black p-2 rounded-lg hover:bg-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    {status === "searching" ? (
                                        <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                                    ) : (
                                        <ArrowRight className="w-4 h-4" />
                                    )}
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Suggestions (Only show if idle) */}
                    {status === "idle" && (
                        <div className="mt-6 flex flex-wrap gap-2 justify-center md:justify-start">
                            {SUGGESTIONS.map((s) => (
                                <button
                                    key={s}
                                    type="button"
                                    onClick={() => handleSuggestionClick(s)}
                                    className="px-3 py-1.5 bg-zinc-900/30 border border-zinc-800 rounded-full text-xs text-zinc-500 hover:text-zinc-300 hover:border-zinc-700 transition-colors"
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    )}
                </form>
            </section>

            {/* 3. Loading / Thinking State */}
            {status === "searching" && (
                <div className="flex flex-col items-center md:items-start space-y-4 animate-pulse duration-1000">
                    <div className="flex items-center gap-3 text-yellow-500/80">
                        <Sparkles className="w-5 h-5" />
                        <span className="text-sm font-medium">Searching your memory...</span>
                    </div>
                    <div className="space-y-2 w-full max-w-2xl">
                        <div className="h-4 bg-zinc-900/50 rounded w-3/4"></div>
                        <div className="h-4 bg-zinc-900/50 rounded w-1/2"></div>
                    </div>
                </div>
            )}

            {/* 4. AI Answer Section */}
            {status === "answered" && answer && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">

                    {/* 4.1 Primary Answer */}
                    <div className="bg-zinc-900/20 border border-zinc-800/50 rounded-2xl p-6 mb-8 relative overflow-hidden group">
                        {/* Subtle glow effect */}
                        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-yellow-500/20 to-transparent opacity-50" />

                        <h3 className="text-xs font-medium text-yellow-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <Sparkles className="w-3 h-3" />
                            Answer
                        </h3>

                        <ul className="space-y-3 mb-6">
                            {answer.textPoints.map((point, i) => (
                                <li key={i} className="flex gap-3 text-zinc-200 font-light leading-relaxed">
                                    <span className="text-zinc-600 mt-2 text-[6px] shrink-0">●</span>
                                    <span>{point}</span>
                                </li>
                            ))}
                        </ul>

                        {/* 4.2 Time & Confidence Context */}
                        <p className="text-xs text-zinc-600 italic border-t border-zinc-800/50 pt-4">
                            {answer.contextNote}
                        </p>
                    </div>

                    {/* 5. Memory Evidence Section */}
                    <div className="mb-12">
                        <h3 className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <Search className="w-3 h-3" />
                            Based on these memories
                        </h3>

                        <div className="grid gap-3">
                            {answer.evidence.map((item) => (
                                <Link
                                    key={item.id}
                                    href={item.link}
                                    className="flex items-start gap-4 p-4 rounded-xl border border-zinc-800/50 hover:bg-zinc-900/40 hover:border-zinc-700 transition-all group"
                                >
                                    <div className="text-xs font-medium text-zinc-500 bg-zinc-900 px-2 py-1 rounded shrink-0 group-hover:text-zinc-300 transition-colors">
                                        {item.date}
                                    </div>
                                    <p className="text-sm text-zinc-400 group-hover:text-zinc-200 transition-colors line-clamp-2">
                                        {item.snippet}
                                    </p>
                                    <CornerDownLeft className="w-3.5 h-3.5 text-zinc-700 ml-auto mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* 6. Follow-up Suggestions (Optional) */}
                    <div className="flex flex-wrap gap-2">
                        <span className="text-xs text-zinc-600 py-1.5 px-1">Follow up:</span>
                        {["Compare with last week", "Show only DSA-related days"].map((s) => (
                            <button
                                key={s}
                                onClick={() => handleSuggestionClick(s)}
                                className="px-3 py-1.5 bg-zinc-950 border border-zinc-800/60 rounded-full text-xs text-zinc-500 hover:text-yellow-500/80 hover:border-yellow-500/30 transition-colors"
                            >
                                {s}
                            </button>
                        ))}
                    </div>

                </div>
            )}
        </div>
    );
}
