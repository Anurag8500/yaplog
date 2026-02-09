"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, ArrowRight, Sparkles, Check, RotateCcw, Pencil, Loader2, Square } from "lucide-react";
import { cn } from "@/lib/utils";

type TalkState = "idle" | "listening" | "processing" | "preview" | "edit";

export default function TalkPage() {
    const [state, setState] = useState<TalkState>("idle");
    const [inputText, setInputText] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [bullets, setBullets] = useState([
        "Completed 3 DSA lectures today",
        "Noticed reduced focus during the second session",
        "Plans to revise tomorrow morning"
    ]);

    const inputRef = useRef<HTMLTextAreaElement>(null);
    const analysisRef = useRef<HTMLDivElement>(null);

    // Auto-focus on load
    useEffect(() => {
        if (state === "idle" && inputRef.current) {
            inputRef.current.focus();
        }
    }, [state]);

    // Auto-scroll to analysis when it appears
    useEffect(() => {
        if ((state === "preview" || state === "edit") && analysisRef.current) {
            // Slight delay to ensure the element is rendered and animation has started
            setTimeout(() => {
                analysisRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
            }, 500);
        }
    }, [state]);

    const handleMicClick = () => {
        if (state === "idle") {
            setState("listening");
            // Mock interaction
            setTimeout(() => {
                setState("processing");
                setTimeout(() => {
                    setState("preview");
                }, 2000);
            }, 3000);
        } else if (state === "listening") {
            setState("processing");
            setTimeout(() => {
                setState("preview");
            }, 2000);
        }
    };

    const handleContinue = async () => {
        if (!inputText.trim()) return;
        
        setState("processing");
        setError(null);

        try {
            const res = await fetch("/api/memory", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content: inputText }),
            });

            if (!res.ok) {
                if (res.status === 401) {
                    throw new Error("Please sign in again to continue");
                }
                throw new Error("Failed to save memory");
            }

            // Success
            handleReset();
        } catch (err: any) {
            console.error("Submission error:", err);
            setError(err.message || "Something went wrong");
            setState("idle");
        }
    };

    const handleReset = () => {
        setState("idle");
        setInputText("");
        setError(null);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <div className="min-h-screen w-full flex flex-col items-center pt-20 px-4 md:px-8 relative bg-black selection:bg-amber-500/30 selection:text-amber-100">

            {/* 1. Header (Refined Size & Text) */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-12 space-y-3 relative z-10"
            >
                <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-white drop-shadow-xl">
                    TALK
                </h1>
                <p className="text-neutral-400 font-medium text-sm tracking-wide opacity-80">
                    Think out loud. I’ll make sense of it.
                </p>
                {/* Subtle separator */}
                <div className="w-12 h-1 bg-amber-500/20 rounded-full mx-auto mt-6" />
            </motion.div>

            {/* 2. Main Input Section (3D & Clean) */}
            <motion.div
                layout
                className={cn(
                    "w-full max-w-2xl transition-all duration-300 relative z-10 group",
                    // Shape
                    "rounded-[2rem]",
                    // 3D Depth Look: Dark Gradient + Top Highlight + Deep Shadow
                    "bg-linear-to-b from-neutral-800 to-neutral-900",
                    "border border-white/5",
                    "shadow-[0_20px_40px_-10px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.1)]", // The "Clean 3D" lift

                    state === "listening" && "shadow-[0_20px_50px_-10px_rgba(245,158,11,0.15),inset_0_1px_0_rgba(255,255,255,0.1)] border-amber-500/30"
                )}
            >
                {/* Input Area */}
                <div className="p-8 relative">
                    <textarea
                        ref={inputRef}
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                handleContinue();
                            }
                        }}
                        placeholder="What's on your mind?"
                        className="w-full bg-transparent text-xl md:text-2xl text-white placeholder:text-neutral-600 font-light focus:outline-none resize-none min-h-[140px] leading-relaxed"
                        disabled={state !== "idle" && state !== "listening"}
                    />
                    {error && (
                        <p className="mt-2 text-red-500 text-sm font-medium animate-pulse">
                            {error}
                        </p>
                    )}
                </div>

                {/* Integrated Action Bar */}
                <div className="px-8 pb-6 flex items-center justify-between">

                    {/* Left: Draft Status (Clean Pill) */}
                    <div className="w-28">
                        <AnimatePresence>
                            {inputText.length > 0 && state === "idle" && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="bg-neutral-950/50 px-3 py-1.5 rounded-full inline-flex items-center gap-2 border border-white/5"
                                >
                                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                    <span className="text-[10px] font-bold tracking-wider text-neutral-400 uppercase">Draft</span>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Center: Modern Mic (Floating) */}
                    <button
                        onClick={handleMicClick}
                        disabled={state === "processing" || state === "preview"}
                        className={cn(
                            "relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl",
                            state === "listening"
                                ? "bg-amber-500 text-black scale-110 shadow-amber-500/30"
                                : "bg-neutral-800 text-neutral-400 hover:bg-neutral-700 hover:text-white hover:scale-105 border border-white/5"
                        )}
                    >
                        <AnimatePresence mode="wait">
                            {state === "listening" ? (
                                <motion.div
                                    key="listening"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    exit={{ scale: 0 }}
                                >
                                    <Square className="w-5 h-5 fill-current" />
                                    {/* Subtle Pulse */}
                                    <motion.div
                                        animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                                        transition={{ repeat: Infinity, duration: 2 }}
                                        className="absolute inset-0 rounded-full border border-black/20"
                                    />
                                </motion.div>
                            ) : state === "processing" ? (
                                <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
                            ) : (
                                <Mic key="mic" className="w-6 h-6" />
                            )}
                        </AnimatePresence>
                    </button>

                    {/* Right: Continue Action (Modern Pill) */}
                    <div className="w-28 flex justify-end">
                        <AnimatePresence>
                            {inputText.length > 0 && state === "idle" && (
                                <motion.button
                                    initial={{ opacity: 0, x: 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 10 }}
                                    onClick={handleContinue}
                                    className="group flex items-center gap-2 pr-2 pl-4 py-2 rounded-full bg-white text-black text-sm font-bold hover:bg-neutral-200 transition-all shadow-lg hover:shadow-white/10"
                                >
                                    Next
                                    <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center group-hover:bg-neutral-800">
                                        <ArrowRight className="w-3 h-3" />
                                    </div>
                                </motion.button>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </motion.div>


            {/* 3. AI Understanding Card (Clean & 3D) */}
            <AnimatePresence>
                {(state === "preview" || state === "edit") && (
                    <motion.div
                        ref={analysisRef}
                        initial={{ opacity: 0, y: 20, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.98 }}
                        transition={{ duration: 0.4, type: "spring", bounce: 0.2 }}
                        className="w-full max-w-2xl mt-6 pb-20"
                    >
                        <div className="relative overflow-hidden rounded-[2rem] bg-neutral-900 border border-white/5 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.5)]">

                            {/* Header Gradient */}
                            <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent opacity-30" />

                            <div className="p-8">
                                {/* Label */}
                                <div className="flex items-center gap-2 mb-6">
                                    <Sparkles className="w-4 h-4 text-amber-500" />
                                    <span className="text-xs font-bold tracking-widest text-neutral-500 uppercase">Analysis</span>
                                </div>

                                {/* Content */}
                                <ul className="space-y-4 mb-8">
                                    {bullets.map((item, i) => (
                                        <motion.li
                                            key={i}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                            className="flex items-start gap-4"
                                        >
                                            <div className="mt-2 w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                                            {state === "edit" ? (
                                                <input
                                                    value={item}
                                                    onChange={(e) => {
                                                        const newBullets = [...bullets];
                                                        newBullets[i] = e.target.value;
                                                        setBullets(newBullets);
                                                    }}
                                                    className="flex-1 bg-transparent border-b border-neutral-700 pb-1 text-lg text-white focus:outline-none focus:border-amber-500 transition-colors font-light"
                                                    autoFocus={i === 0}
                                                />
                                            ) : (
                                                <span className="text-lg text-neutral-200 font-light leading-relaxed">
                                                    {item}
                                                </span>
                                            )}
                                        </motion.li>
                                    ))}
                                </ul>

                                {/* Modern Clean Actions (Refined) */}
                                <div className="flex items-center gap-3 pt-6 border-t border-white/5">
                                    <button
                                        onClick={handleReset}
                                        className="px-5 py-3 rounded-full text-xs font-bold text-neutral-500 hover:text-white hover:bg-neutral-800 transition-colors border border-transparent hover:border-neutral-800"
                                    >
                                        Start Over
                                    </button>

                                    <div className="flex-1" />

                                    <button
                                        onClick={() => setState(state === "edit" ? "preview" : "edit")}
                                        className={cn(
                                            "px-5 py-3 rounded-full text-xs font-bold border transition-all flex items-center gap-2",
                                            state === "edit"
                                                ? "bg-neutral-800 border-neutral-700 text-white"
                                                : "border-neutral-800 bg-black/20 text-neutral-400 hover:border-neutral-600 hover:text-white hover:bg-neutral-800"
                                        )}
                                    >
                                        <Pencil className="w-3 h-3" />
                                        {state === "edit" ? "Done" : "Edit"}
                                    </button>

                                    <button
                                        onClick={handleReset}
                                        className="px-6 py-3 rounded-full border border-amber-500/30 text-amber-500 text-xs font-bold hover:bg-amber-500/10 transition-all flex items-center gap-2 shadow-[0_0_15px_-5px_rgba(245,158,11,0.2)] hover:shadow-[0_0_20px_-5px_rgba(245,158,11,0.4)]"
                                    >
                                        <Check className="w-3.5 h-3.5" />
                                        Looks Good
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Footer Context */}
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-4 mb-12 text-[10px] text-neutral-700 font-bold tracking-widest uppercase"
            >
                Encrypted & Private
            </motion.p>

        </div>
    );
}
