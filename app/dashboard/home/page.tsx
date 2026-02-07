import Link from "next/link";
import { ArrowRight, Mic, Sparkles, Brain, History, Layers } from "lucide-react";
import { Card } from "@/components/dashboard/Card";

function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
}

export default function DashboardHomePage() {
    const greeting = getGreeting();

    return (
        <div className="space-y-16 py-12 animate-in fade-in duration-1000 ease-out">

            {/* 1. Greeting Section */}
            <section className="text-center space-y-4">
                <h1 className="text-5xl md:text-6xl font-extralight text-white tracking-tight">
                    {greeting}, Anurag.
                </h1>
                <p className="text-xl text-neutral-400 font-light">
                    You can think out loud here.
                </p>
            </section>

            {/* 2. Primary Action: Start Talking */}
            <section className="flex justify-center">
                <Link
                    href="/dashboard/talk"
                    className="group relative block w-full max-w-3xl"
                >
                    <div className="absolute -inset-4 bg-amber-500/10 rounded-[2rem] blur-2xl opacity-0 group-hover:opacity-100 transition duration-1000" />

                    <div className="relative flex items-center justify-between bg-neutral-900/40 border border-neutral-800 hover:border-amber-500/30 px-10 py-12 rounded-[2rem] backdrop-blur-md transition-all duration-500 group-active:scale-[0.99]">
                        <div className="flex items-center gap-8">
                            <div className="h-16 w-16 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center justify-center text-amber-500 shadow-[0_0_30px_-10px_rgba(245,158,11,0.3)] group-hover:shadow-[0_0_40px_-10px_rgba(245,158,11,0.5)] transition-all duration-500">
                                <Mic className="w-8 h-8" />
                            </div>
                            <div className="space-y-2 text-left">
                                <h2 className="text-3xl font-normal text-white tracking-wide">
                                    Start Talking
                                </h2>
                                <p className="text-neutral-400 text-lg font-light group-hover:text-neutral-300 transition-colors">
                                    Talk through a thought, memory, or plan.
                                </p>
                            </div>
                        </div>

                        <div className="h-12 w-12 rounded-full border border-neutral-800 flex items-center justify-center text-neutral-500 group-hover:text-amber-400 group-hover:border-amber-500/30 transition-all duration-300 transform group-hover:translate-x-1">
                            <ArrowRight className="w-5 h-5" />
                        </div>
                    </div>
                </Link>
            </section>

            {/* 3. Secondary Cards Grid - TIGHTER SPACING, NO JUSTIFY-BETWEEN */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">

                {/* Card 1: Today - Tighter Grouping */}
                <Card className="relative overflow-hidden group flex flex-col min-h-[260px] bg-neutral-950 border-neutral-800 hover:border-amber-500/30 transition-all duration-500 p-8">
                    <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-40 transition-opacity">
                        <Layers className="w-20 h-20 text-neutral-500 group-hover:text-amber-900/40 rotate-12 transition-colors duration-500" />
                    </div>

                    <div className="relative z-10 mb-6">
                        <span className="text-[10px] font-bold tracking-[0.2em] text-neutral-500 uppercase mb-4 block group-hover:text-amber-500 transition-colors duration-300">
                            TODAY
                        </span>
                        <div className="flex items-baseline gap-2">
                            <span className="text-5xl font-extralight text-white tracking-tighter group-hover:text-amber-50 transition-colors">2</span>
                            <span className="text-lg text-neutral-400 font-light">Active Threads</span>
                        </div>
                    </div>

                    <div className="relative z-10 pt-6 border-t border-neutral-900/60 group-hover:border-amber-900/30 transition-colors mt-auto">
                        <ul className="space-y-3">
                            <li className="flex items-start gap-3">
                                <span className="w-1.5 h-1.5 rounded-full bg-neutral-700 mt-2.5 group-hover:bg-amber-500 transition-colors duration-500" />
                                <span className="text-sm text-neutral-400 font-light group-hover:text-neutral-200 transition-colors">
                                    Review Q1 goals
                                </span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="w-1.5 h-1.5 rounded-full bg-neutral-700 mt-2.5 group-hover:bg-amber-500 transition-colors duration-500" />
                                <span className="text-sm text-neutral-400 font-light group-hover:text-neutral-200 transition-colors">
                                    Finalize design scope
                                </span>
                            </li>
                        </ul>
                    </div>
                </Card>

                {/* Card 2: Insight - Tighter Grouping */}
                <Card className="relative overflow-hidden group flex flex-col min-h-[260px] bg-neutral-950 border-neutral-800 hover:border-amber-500/30 transition-all duration-500 p-8">
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-950/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    <div className="absolute top-4 right-4">
                        <Sparkles className="w-5 h-5 text-neutral-700 group-hover:text-amber-500 transition-colors duration-500" />
                    </div>

                    <div className="relative z-10 mb-4">
                        <span className="text-[10px] font-bold tracking-[0.2em] text-neutral-500 uppercase mb-4 block group-hover:text-amber-500 transition-colors duration-300">
                            INSIGHT
                        </span>
                        <h3 className="text-xl font-normal text-white mb-2 group-hover:text-amber-50 transition-colors">
                            Creative Mornings
                        </h3>
                    </div>

                    <div className="relative z-10">
                        <p className="text-sm text-neutral-400 leading-relaxed font-light group-hover:text-neutral-200 transition-colors">
                            Morning sessions often lead to your best creative work.
                        </p>
                    </div>
                </Card>

                {/* Card 3: Recall - Tighter Grouping */}
                <Card className="relative group flex flex-col min-h-[260px] bg-neutral-950 border-neutral-800 hover:border-amber-500/30 transition-all duration-500 p-8">
                    <div className="mb-6">
                        <span className="text-[10px] font-bold tracking-[0.2em] text-neutral-500 uppercase mb-6 block group-hover:text-amber-500 transition-colors duration-300">
                            RECALL
                        </span>
                        <div className="relative pl-4 border-l-2 border-neutral-800 group-hover:border-amber-500/50 transition-colors duration-300">
                            <blockquote className="text-lg font-light text-neutral-300 italic group-hover:text-white transition-colors">
                                “What did I decide about the logo design?”
                            </blockquote>
                        </div>
                    </div>

                    <div className="flex justify-end mt-auto">
                        <Link href="/dashboard/recall">
                            <span className="flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-900 border border-neutral-800 text-xs font-medium text-neutral-400 group-hover:text-amber-500 group-hover:border-amber-500/30 group-hover:bg-amber-950/10 transition-all duration-300">
                                Ask Memory <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                            </span>
                        </Link>
                    </div>
                </Card>

            </section>

            {/* 4. Footer Suggestion */}
            <section className="text-center pt-8 border-t border-neutral-900 w-full max-w-xl mx-auto">
                <div className="flex items-start justify-center gap-4 text-neutral-400">
                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)] shrink-0" />
                    <p className="font-light text-base text-left">
                        <span className="font-medium text-neutral-300 block mb-1">Suggestion</span>
                        You might want to reflect on yesterday’s meeting before starting the new sprint.
                    </p>
                </div>
            </section>

        </div>
    );
}
