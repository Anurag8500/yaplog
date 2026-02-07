"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    Home,
    Mic,
    Brain,
    History,
    Compass,
    Sparkles,
    Settings,
    LogOut,
    User,
    PanelLeftClose,
    PanelLeftOpen,
    ChevronLeft,
    ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

const sidebarItems = [
    { label: "Home", href: "/dashboard/home", icon: Home },
    { label: "Talk", href: "/dashboard/talk", icon: Mic },
    { label: "Memory", href: "/dashboard/memory", icon: Brain },
    { label: "Recall", href: "/dashboard/recall", icon: History },
    { label: "Guidance", href: "/dashboard/guidance", icon: Compass },
    { label: "Insights", href: "/dashboard/insights", icon: Sparkles },
    { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

interface SidebarProps {
    isCollapsed: boolean;
    toggleCollapse: () => void;
}

export function Sidebar({ isCollapsed, toggleCollapse }: SidebarProps) {
    const pathname = usePathname();

    return (
        <aside
            className={cn(
                "fixed left-4 top-4 bottom-4 flex flex-col z-50 transition-all duration-300 ease-in-out",
                isCollapsed ? "w-20" : "w-64"
            )}
        >
            {/* Glass Container */}
            <div className="h-full w-full flex flex-col bg-neutral-900/60 backdrop-blur-xl border border-white/5 rounded-3xl shadow-2xl overflow-hidden relative transition-all duration-300">

                {/* 1. Header / Toggle (No Logo) */}
                <div className={cn(
                    "flex items-center pt-8 pb-6",
                    isCollapsed ? "justify-center px-0" : "justify-between px-6"
                )}>
                    {!isCollapsed && (
                        <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-xl font-bold tracking-[0.2em] text-neutral-200"
                        >
                            YAPLOG
                        </motion.span>
                    )}
                    <button
                        onClick={toggleCollapse}
                        className="p-2 rounded-full text-neutral-500 hover:text-white hover:bg-white/10 transition-colors"
                        title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
                    >
                        {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
                    </button>
                </div>

                {/* 2. Navigation */}
                <nav className="flex-1 px-3 space-y-2 overflow-y-auto py-2 scrollbar-hide">
                    {sidebarItems.map((item) => {
                        const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "relative group flex items-center rounded-xl font-medium transition-all duration-300 z-10",
                                    isCollapsed ? "justify-center p-3" : "gap-3 px-4 py-3",
                                    isActive ? "text-white" : "text-neutral-500 hover:text-neutral-200"
                                )}
                                title={isCollapsed ? item.label : undefined}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="sidebar-active-tab"
                                        className="absolute inset-0 bg-neutral-800/50 border border-white/5 rounded-xl shadow-[0_0_20px_-5px_rgba(0,0,0,0.5)]"
                                        initial={false}
                                        transition={{
                                            type: "spring",
                                            stiffness: 300,
                                            damping: 30
                                        }}
                                    />
                                )}

                                <span className="relative z-10 flex items-center">
                                    <Icon
                                        className={cn(
                                            "transition-colors duration-300",
                                            isCollapsed ? "w-6 h-6" : "w-4 h-4",
                                            isActive
                                                ? "text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]"
                                                : "text-neutral-500 group-hover:text-neutral-300"
                                        )}
                                    />
                                    {!isCollapsed && (
                                        <motion.span
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="ml-3 text-sm whitespace-nowrap"
                                        >
                                            {item.label}
                                        </motion.span>
                                    )}
                                </span>

                                {isActive && !isCollapsed && (
                                    <motion.div
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="absolute right-3 w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.8)]"
                                    />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* 3. User Profile (Bottom) */}
                <div className="p-3 mt-auto">
                    <div className={cn(
                        "bg-neutral-950/50 border border-white/5 rounded-2xl flex items-center transition-colors cursor-pointer group hover:bg-neutral-900/80",
                        isCollapsed ? "justify-center p-2 mb-2" : "p-3 gap-3"
                    )}>
                        <div className="w-9 h-9 rounded-full bg-neutral-800 flex items-center justify-center border border-white/5 overflow-hidden shrink-0">
                            <User className="w-4 h-4 text-neutral-400" />
                        </div>

                        {!isCollapsed && (
                            <>
                                <div className="flex-1 min-w-0 overflow-hidden">
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.1 }}
                                    >
                                        <p className="text-sm font-medium text-neutral-300 truncate group-hover:text-white transition-colors">
                                            Anurag
                                        </p>
                                        <p className="text-[10px] text-neutral-600 truncate">
                                            Pro Member
                                        </p>
                                    </motion.div>
                                </div>
                                <LogOut className="w-4 h-4 text-neutral-600 hover:text-red-400 transition-colors shrink-0" />
                            </>
                        )}
                    </div>
                </div>
            </div>
        </aside>
    );
}
