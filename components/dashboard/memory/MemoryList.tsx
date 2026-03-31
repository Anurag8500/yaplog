"use client";

import React, { useState, useEffect } from "react";
import { MemoryCard, ExpandedMemoryCard, type DayData } from "./MemoryCard";
import { AnimatePresence, motion, LayoutGroup } from "framer-motion";

interface MemoryListProps {
    days: DayData[];
}

export const MemoryList = ({ days }: MemoryListProps) => {
    // We don't want to show the modal initially on load if nothing was clicked,
    // so let's default to null instead of opening today's memory right away,
    // since the user wants it to be a "cool pop out". 
    const [expandedMemoryId, setExpandedMemoryId] = useState<string | null>(null);

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (expandedMemoryId) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [expandedMemoryId]);

    const handleToggle = (id: string) => {
        setExpandedMemoryId(prevId => (prevId === id ? null : id));
    };

    const todayData = days.find((d) => d.isToday);
    const previousDays = days.filter((d) => !d.isToday);
    const activeData = days.find(d => d.id === expandedMemoryId);

    return (
        <LayoutGroup>
            <div className="space-y-12 relative w-full">
                {/* Today Section */}
                {todayData && (
                    <section>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-sm font-medium text-zinc-400 uppercase tracking-wider">
                                Today
                            </h2>
                            <span className="text-xs text-yellow-500/60 animate-pulse">
                                Updates automatically as you talk
                            </span>
                        </div>

                        <MemoryCard
                            data={todayData}
                            onClick={() => handleToggle(todayData.id)}
                        />
                    </section>
                )}

                {/* Previous Days Section */}
                {previousDays.length > 0 && (
                    <section>
                        <h2 className="text-sm font-medium text-zinc-500 uppercase tracking-wider mb-6">
                            Previous Days
                        </h2>

                        <div className="space-y-4">
                            {previousDays.map((day) => (
                                <MemoryCard
                                    key={day.id}
                                    data={day}
                                    onClick={() => handleToggle(day.id)}
                                />
                            ))}
                        </div>
                    </section>
                )}

                {/* Expanded Modal Overlay */}
                <AnimatePresence>
                    {activeData && (
                        <div 
                            className="fixed inset-y-0 right-0 z-40 flex items-center justify-center pointer-events-none transition-all duration-300 ease-in-out"
                            style={{ left: "var(--sidebar-offset)" }}
                        >
                            {/* Backdrop */}
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setExpandedMemoryId(null)}
                                className="absolute inset-0 bg-black/95 backdrop-blur-xl pointer-events-auto"
                            />
                            
                            {/* Card Wrapper - Takes full available space with minimal padding on large screens */}
                            <div className="relative w-full h-full pointer-events-none flex justify-center items-center p-0 md:p-6 lg:p-8">
                                <ExpandedMemoryCard 
                                    data={activeData} 
                                    onClose={() => setExpandedMemoryId(null)} 
                                />
                            </div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </LayoutGroup>
    );
};
