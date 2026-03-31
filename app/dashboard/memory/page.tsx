"use client";

import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { MemoryList } from "@/components/dashboard/memory/MemoryList";
import { type DayData } from "@/components/dashboard/memory/MemoryCard";

// --- Types ---
type Memory = {
    _id: string;
    userId: string;
    content: string;
    date: string;
    createdAt: string;
    essence?: string | null;
    structuredUnderstanding?: string[];
    summary?: string | null;
    processed?: boolean;
};

export default function MemoryPage() {
    const [days, setDays] = useState<DayData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let timeoutId: NodeJS.Timeout;
        let isMounted = true;

        async function fetchMemories() {
            try {
                const res = await fetch("/api/memory");
                if (res.ok && isMounted) {
                    const { memories } = await res.json();
                    const grouped = groupMemories(memories);
                    setDays(grouped);

                    // Polling Logic:
                    // If Today exists and is NOT processed, poll again in 5s.
                    const today = grouped.find(d => d.isToday);
                    if (today && !today.processed) {
                        timeoutId = setTimeout(fetchMemories, 5000);
                    }
                }
            } catch (e) {
                console.error("Failed to fetch memories:", e);
            } finally {
                if (isMounted) setLoading(false);
            }
        }

        fetchMemories();

        return () => {
            isMounted = false;
            clearTimeout(timeoutId);
        };
    }, []);

    function groupMemories(memories: Memory[]): DayData[] {
        if (!memories || memories.length === 0) return [];

        const groups: Record<string, Memory[]> = {};
        
        // Group by date
        memories.forEach(m => {
            if (!groups[m.date]) {
                groups[m.date] = [];
            }
            groups[m.date].push(m);
        });

        // Convert to DayData
        const dayDataList: DayData[] = Object.keys(groups).map(dateStr => {
            // Sort memories by createdAt ascending for timeline
            const timelineMemories = [...groups[dateStr]].sort((a, b) => 
                new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            );

            // Sort memories by createdAt descending for essence/summary (latest first)
            const sortedMemoriesDesc = [...groups[dateStr]].sort((a, b) => 
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );

            const latestMemory = sortedMemoriesDesc[0]; 
            const processed = latestMemory.processed === true;
            
            // Format date for display
            const [year, month, day] = dateStr.split('-').map(Number);
            const dateObj = new Date(year, month - 1, day);
            
            const today = new Date();
            const isToday = 
                dateObj.getDate() === today.getDate() &&
                dateObj.getMonth() === today.getMonth() &&
                dateObj.getFullYear() === today.getFullYear();

            const formattedDate = dateObj.toLocaleDateString("en-GB", { 
                weekday: 'long', 
                day: 'numeric', 
                month: 'short', 
                year: 'numeric' 
            });

            const displayDate = isToday 
                ? `Today, ${dateObj.getDate()} ${dateObj.toLocaleDateString('en-GB', { month: 'short' })} ${dateObj.getFullYear()}`
                : formattedDate;

            // 1. Essence Logic
            let essence = "";
            if (isToday && !processed) {
                essence = "Understanding your day…";
            } else if (processed) {
                essence = latestMemory.essence || "";
            } else {
                essence = "Memory recorded."; 
            }

            // 2. Structured Understanding Logic
            const structuredUnderstanding = (processed && latestMemory.structuredUnderstanding && latestMemory.structuredUnderstanding.length > 0)
                ? latestMemory.structuredUnderstanding
                : [];

            // 3. Summary Logic
            let summary = "";
            if (isToday && !processed) {
                summary = "Your day is being gently summarized.";
            } else if (processed) {
                summary = latestMemory.summary || "";
            } else {
                summary = "";
            }

            // 4. Timeline Logic
            const timeline = timelineMemories.map(m => ({
                time: new Date(m.createdAt).toLocaleTimeString('en-GB', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                }),
                content: m.content
            }));

            return {
                id: dateStr,
                date: displayDate,
                isToday,
                essence,
                entryCount: groups[dateStr].length,
                timeline,
                structuredUnderstanding,
                summary,
                processed,
            };
        });

        // Sort by date descending
        return dayDataList.sort((a, b) => b.id.localeCompare(a.id));
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-yellow-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-zinc-200 px-6 py-16 md:px-12 lg:px-24 max-w-4xl mx-auto font-sans selection:bg-yellow-500/20 selection:text-yellow-200">
            {/* Page Header */}
            <header className="text-center mb-12 space-y-3 relative z-10">
                <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-white drop-shadow-xl uppercase">
                    Memory
                </h1>
                <p className="text-neutral-400 font-medium text-sm tracking-wide opacity-80">
                    Your life, structured and remembered over time.
                </p>
                <div className="w-12 h-1 bg-yellow-500/20 rounded-full mx-auto mt-6" />
            </header>

            {days.length === 0 ? (
                <div className="text-center py-20">
                    <p className="text-zinc-500 text-lg">No memories found.</p>
                </div>
            ) : (
                <MemoryList days={days} />
            )}
        </div>
    );
}
