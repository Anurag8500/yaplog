"use client";

import { useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function DashboardShell({ children }: { children: React.ReactNode }) {
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <div className="flex min-h-screen bg-black text-neutral-200 selection:bg-amber-500/30 selection:text-amber-100 overflow-hidden">

            <Sidebar isCollapsed={isCollapsed} toggleCollapse={() => setIsCollapsed(!isCollapsed)} />

            {/* Main Content Area - Adjusts padding based on sidebar state */}
            <motion.main
                className={cn(
                    "flex-1 w-full min-h-screen overflow-y-auto custom-scrollbar py-4 md:py-8 pr-4 md:pr-8 transition-all duration-300 ease-in-out",
                    isCollapsed ? "pl-28" : "pl-72" // 24 (sidebar) + 4 (gap) = 28 ?? No. Sidebar width collapsed is w-20 (5rem = 80px). left-4 (1rem). Total ~6rem+ ?? 
                    // Let's verify padding. 
                    // Floating Sidebar: fixed left-4.
                    // Expanded: w-64 (16rem = 256px). Padding should be ~256 + 16 + gap. pl-72 (18rem = 288px) worked well.
                    // Collapsed: w-20 (5rem = 80px). Padding should be ~80 + 16 + gap. 5rem + 1rem + 2rem = 8rem = pl-32.
                )}
                animate={{ paddingLeft: isCollapsed ? "120px" : "288px" }} // Explicit pixel/rem values for smoother motion if possible, or classes.
                transition={{ duration: 0.3, ease: "easeInOut" }}
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
