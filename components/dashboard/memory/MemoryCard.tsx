"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { X, Clock, BrainCircuit, Sparkles } from "lucide-react";

type TimelineEntry = {
    time: string;
    content: string;
};

export type DayData = {
    id: string;
    date: string;
    isToday?: boolean;
    essence: string;
    entryCount: number;
    timeline: TimelineEntry[];
    structuredUnderstanding: string[];
    summary: string;
    processed: boolean;
};

interface MemoryCardProps {
    data: DayData;
    onClick: () => void;
}

export const MemoryCard = ({ data, onClick }: MemoryCardProps) => {
    return (
        <motion.div
            layoutId={`memory-card-${data.id}`}
            onClick={onClick}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="group relative rounded-2xl border bg-zinc-900/40 border-neutral-800 hover:border-yellow-500/40 hover:shadow-[0_0_30px_-10px_rgba(234,179,8,0.15)] transition-colors duration-300 overflow-hidden cursor-pointer"
        >
            <div className="p-6 select-none relative z-10">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <motion.h3 
                            layoutId={`memory-date-${data.id}`}
                            className={cn(
                                "text-lg font-bold tracking-tight",
                                data.isToday ? "text-yellow-500" : "text-white group-hover:text-yellow-100 transition-colors"
                            )}>
                            {data.date}
                        </motion.h3>
                        {data.isToday && (
                            <span className="relative flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-yellow-500"></span>
                            </span>
                        )}
                    </div>
                    
                    <motion.p 
                        layoutId={`memory-essence-${data.id}`}
                        className="text-xl font-medium text-zinc-300 leading-snug">
                        {data.essence}
                    </motion.p>

                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/5">
                        <div className="flex items-center gap-2 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                            <Clock className="w-3.5 h-3.5" />
                            {data.entryCount} {data.entryCount === 1 ? 'entry' : 'entries'}
                        </div>
                        <span className="text-yellow-500/0 group-hover:text-yellow-500/70 text-sm font-medium transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                            Expand +
                        </span>
                    </div>
                </div>
            </div>
            
            {/* Subtle background glow effect on hover */}
            <div className="absolute inset-0 z-0 bg-gradient-to-br from-yellow-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </motion.div>
    );
};

// Expanded Component to be used in the Modal
export const ExpandedMemoryCard = ({ data, onClose }: { data: DayData; onClose: () => void }) => {
    return (
        <motion.div
            layoutId={`memory-card-${data.id}`}
            className="w-full h-full max-w-none max-h-none overflow-y-auto custom-scrollbar bg-zinc-950/90 backdrop-blur-2xl border border-yellow-500/10 rounded-none md:rounded-[2.5rem] shadow-[0_0_120px_-20px_rgba(234,179,8,0.1)] flex flex-col relative z-50 mx-auto pointer-events-auto"
        >
            {/* Close Button */}
            <button 
                onClick={onClose}
                className="absolute top-6 right-6 p-3 rounded-full bg-black/40 backdrop-blur-md text-neutral-400 hover:text-white hover:bg-black/60 hover:scale-105 active:scale-95 transition-all z-50 border border-white/5"
            >
                <X className="w-6 h-6" />
            </button>

            {/* Immersive Header Area */}
            <div className="relative min-h-[40vh] md:min-h-[45vh] flex flex-col justify-end p-8 md:p-16 border-b border-yellow-500/10 overflow-hidden shrink-0">
                {/* Background Ambient Glows */}
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-yellow-500/10 via-yellow-500/5 to-transparent rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-full h-[300px] bg-gradient-to-t from-zinc-950 to-transparent pointer-events-none z-10" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay pointer-events-none"></div>

                <div className="relative z-20 max-w-5xl space-y-8">
                    <motion.div 
                        layoutId={`memory-date-${data.id}`}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-sm font-semibold tracking-widest backdrop-blur-md"
                    >
                        <Sparkles className="w-4 h-4" />
                        {data.date}
                    </motion.div>
                    
                    <motion.p 
                        layoutId={`memory-essence-${data.id}`}
                        className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] tracking-tight text-balance">
                        {data.essence}
                    </motion.p>
                </div>
            </div>

            {/* Details Content Container */}
            <div className="p-8 md:p-16 lg:p-24 flex-1 flex justify-center w-full">
                <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
                    
                    {/* Left Column: Summary & Insights */}
                    <div className="lg:col-span-7 space-y-16">
                        {/* Summary */}
                        {data.summary && (
                            <motion.div 
                                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.6, ease: "easeOut" }}
                                className="space-y-6"
                            >
                                <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-yellow-500 flex items-center gap-3">
                                    <BrainCircuit className="w-5 h-5" /> Executive Summary
                                </h4>
                                <div className="p-8 md:p-10 rounded-3xl bg-zinc-900/40 backdrop-blur-sm border-l-2 border-yellow-500 border-t border-r border-b border-white/5 relative group">
                                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl pointer-events-none" />
                                    <p className="text-zinc-300 leading-relaxed text-lg md:text-xl font-light">{data.summary}</p>
                                </div>
                            </motion.div>
                        )}

                        {/* Structured Understanding */}
                        {data.structuredUnderstanding.length > 0 && (
                            <motion.div 
                                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
                                className="space-y-8"
                            >
                                <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-neutral-400">
                                    Core Insights
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                                    {data.structuredUnderstanding.map((item, idx) => (
                                        <div key={idx} className="flex flex-col gap-4 p-6 rounded-3xl bg-zinc-900/30 border border-white/5 hover:bg-zinc-900/50 hover:border-yellow-500/20 transition-all duration-300 group">
                                            <div className="w-8 h-8 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-500 text-sm font-bold group-hover:scale-110 transition-transform">{(idx+1)}</div>
                                            <span className="text-zinc-300 text-base md:text-lg leading-relaxed font-light">{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* Right Column: Timeline */}
                    <div className="lg:col-span-5 relative">
                        {/* Sticky wrapper for timeline so it stays visible if left col is taller */}
                        <div className="sticky top-12">
                            <motion.div 
                                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
                                className="space-y-10"
                            >
                                <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-neutral-400 flex items-center justify-between border-b border-white/5 pb-4">
                                    <span>Chronology</span>
                                    <span className="text-[10px] bg-yellow-500/10 text-yellow-500 px-3 py-1 rounded-full uppercase tracking-wider">{data.entryCount} entries</span>
                                </h4>
                                
                                <div className="relative pl-8 ml-3 space-y-10 before:absolute before:inset-y-3 before:left-[11px] before:w-px before:bg-gradient-to-b before:from-yellow-500/50 before:via-neutral-800 before:to-transparent">
                                    {data.timeline.map((entry, idx) => (
                                        <div key={idx} className="relative group">
                                            {/* Timeline Node */}
                                            <div className="absolute -left-[40.5px] top-2 w-4 h-4 rounded-full bg-zinc-950 border-[3px] border-neutral-700 group-hover:border-yellow-500 transition-colors z-10 shadow-[0_0_10px_rgba(0,0,0,0.5)]" />
                                            
                                            <div className="flex flex-col gap-3">
                                                <span className="text-xs text-yellow-500/80 font-bold tracking-widest">{entry.time}</span>
                                                <p className="text-neutral-300 text-base leading-relaxed bg-zinc-900/30 p-5 rounded-2xl border border-white/5 inline-block group-hover:bg-zinc-900 group-hover:border-yellow-500/10 transition-colors font-light">
                                                    {entry.content}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        </div>
                    </div>
                    
                </div>
            </div>
        </motion.div>
    );
};
