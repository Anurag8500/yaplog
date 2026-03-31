"use client";

import { useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function DashboardShell({ children }: { children: React.ReactNode }) {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const paddingLeft = isCollapsed ? 120 : 288;

    return (
        <div className="flex min-h-screen bg-black text-neutral-200 selection:bg-amber-500/30 selection:text-amber-100 overflow-hidden">

            <Sidebar isCollapsed={isCollapsed} toggleCollapse={() => setIsCollapsed(!isCollapsed)} />

            {/* Main Content Area - Adjusts padding based on sidebar state */}
            <motion.main
                className={cn(
                    "flex-1 w-full min-h-screen overflow-y-auto custom-scrollbar py-4 md:py-8 pr-4 md:pr-8 transition-all duration-300 ease-in-out"
                )}
                animate={{ paddingLeft: `${paddingLeft}px` }} 
                transition={{ duration: 0.3, ease: "easeInOut" }}
                style={{ "--sidebar-offset": `${paddingLeft}px` } as React.CSSProperties}
            >
                <div className="max-w-6xl mx-auto pt-8 pb-20">
                    {children}
                </div>
            </motion.main>

            {/* Background Ambience */}
            <div className="fixed inset-0 z-[-1] pointer-events-none bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-neutral-900/20 via-black to-black" />
        </div>
    );
}
