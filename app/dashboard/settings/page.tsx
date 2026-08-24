"use client";

import React, { useState, useEffect } from "react";
import { 
    Settings, 
    User, 
    Download, 
    Trash2, 
    AlertTriangle, 
    CheckCircle2, 
    Loader2, 
    ChevronRight, 
    Lock
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
    const [session, setSession] = useState<any>(null);
    const [loadingSession, setLoadingSession] = useState(true);
    const [exporting, setExporting] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Fetch active session info
    useEffect(() => {
        let isMounted = true;
        fetch("/api/auth/session")
            .then((res) => {
                if (res.ok) return res.json();
                throw new Error("Failed to load session");
            })
            .then((data) => {
                if (isMounted) {
                    setSession(data);
                    setLoadingSession(false);
                }
            })
            .catch((err) => {
                console.error(err);
                if (isMounted) setLoadingSession(false);
            });

        return () => {
            isMounted = false;
        };
    }, []);

    // Export memories as a downloadable JSON file
    const handleExport = async () => {
        setExporting(true);
        setErrorMessage(null);
        setSuccessMessage(null);

        try {
            const res = await fetch("/api/memory");
            if (!res.ok) throw new Error("Could not retrieve memories");

            const { memories } = await res.json();
            
            // Format and export JSON
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(memories, null, 2));
            const downloadAnchor = document.createElement("a");
            downloadAnchor.setAttribute("href", dataStr);
            downloadAnchor.setAttribute("download", `yaplog_memories_${new Date().toISOString().split('T')[0]}.json`);
            document.body.appendChild(downloadAnchor);
            downloadAnchor.click();
            downloadAnchor.remove();

            setSuccessMessage("Your memories were successfully exported!");
        } catch (err: any) {
            setErrorMessage(err.message || "Failed to export data");
        } finally {
            setExporting(false);
        }
    };

    // Delete all user memories
    const handleDeleteAll = async () => {
        setDeleting(true);
        setErrorMessage(null);
        setSuccessMessage(null);

        try {
            const res = await fetch("/api/memory", {
                method: "DELETE",
            });

            if (!res.ok) throw new Error("Could not delete memories");

            const data = await res.json();
            setSuccessMessage(`Wiped successfully! Cleared ${data.deletedCount || 0} memories.`);
            setShowConfirmDelete(false);
        } catch (err: any) {
            setErrorMessage(err.message || "Failed to clear data");
        } finally {
            setDeleting(false);
        }
    };

    if (loadingSession) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-yellow-500 animate-spin" />
            </div>
        );
    }

    const userName = session?.user?.name || "User";
    const userEmail = session?.user?.email || "";
    const userInitial = userName.charAt(0).toUpperCase();

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-zinc-200 px-6 py-16 md:px-12 lg:px-24 max-w-4xl mx-auto font-sans selection:bg-yellow-500/20 selection:text-yellow-200">
            {/* Header */}
            <header className="text-center mb-16 space-y-3 relative z-10">
                <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-white drop-shadow-xl uppercase flex items-center justify-center gap-4">
                    <Settings className="w-10 h-10 md:w-12 md:h-12 text-yellow-500" />
                    Settings
                </h1>
                <p className="text-neutral-400 font-medium text-sm tracking-wide opacity-80">
                    Manage your profile, preferences, and data privacy.
                </p>
                <div className="w-12 h-1 bg-yellow-500/20 rounded-full mx-auto mt-6" />
            </header>

            {/* Notification Messages */}
            <AnimatePresence>
                {successMessage && (
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="mb-8 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm flex items-center gap-3"
                    >
                        <CheckCircle2 className="w-5 h-5 shrink-0" />
                        <span>{successMessage}</span>
                    </motion.div>
                )}
                {errorMessage && (
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="mb-8 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-3"
                    >
                        <AlertTriangle className="w-5 h-5 shrink-0" />
                        <span>{errorMessage}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="space-y-8">
                {/* Profile Card */}
                <section className="bg-zinc-900/30 border border-white/5 rounded-3xl p-8 relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-yellow-500/10 to-transparent" />
                    
                    <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-6 flex items-center gap-2">
                        <User className="w-4 h-4" /> Account Profile
                    </h2>

                    <div className="flex flex-col sm:flex-row items-center gap-6">
                        <div className="w-20 h-20 rounded-2xl bg-neutral-800 border border-white/5 flex items-center justify-center text-yellow-500 text-3xl font-bold shadow-inner">
                            {session?.user?.image ? (
                                <img src={session.user.image} alt={userName} className="w-full h-full object-cover rounded-2xl" />
                            ) : (
                                userInitial
                            )}
                        </div>

                        <div className="text-center sm:text-left space-y-1.5">
                            <h3 className="text-xl font-bold text-white tracking-wide">{userName}</h3>
                            <p className="text-sm text-neutral-400 font-light">{userEmail}</p>
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-xs font-medium">
                                Pro Member
                            </div>
                        </div>
                    </div>
                </section>

                {/* Data Portability & Privacy Settings */}
                <section className="bg-zinc-900/30 border border-white/5 rounded-3xl p-8 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-red-500/10 to-transparent" />

                    <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-8 flex items-center gap-2">
                        <Lock className="w-4 h-4" /> Privacy & Data Portability
                    </h2>

                    <div className="space-y-8">
                        {/* Export Action */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/5">
                            <div className="space-y-1.5">
                                <h3 className="text-lg font-medium text-zinc-100 flex items-center gap-2">
                                    Export Your Data
                                </h3>
                                <p className="text-sm text-neutral-400 font-light max-w-md">
                                    Download all of your raw thoughts, summaries, and timeline entries as a portable JSON file.
                                </p>
                            </div>

                            <button
                                onClick={handleExport}
                                disabled={exporting}
                                className="px-6 py-3 rounded-full bg-white text-black hover:bg-neutral-200 transition-all font-semibold text-sm flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 shrink-0 self-start sm:self-center"
                            >
                                {exporting ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Download className="w-4 h-4" />
                                )}
                                Export JSON
                            </button>
                        </div>

                        {/* Delete Action */}
                        <div className="flex flex-col justify-between gap-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="space-y-1.5">
                                    <h3 className="text-lg font-medium text-red-400">
                                        Delete Memory History
                                    </h3>
                                    <p className="text-sm text-neutral-400 font-light max-w-md">
                                        Permanently delete all stored memories from the database. This action is irreversible.
                                    </p>
                                </div>

                                {!showConfirmDelete ? (
                                    <button
                                        onClick={() => setShowConfirmDelete(true)}
                                        className="px-6 py-3 rounded-full border border-red-500/20 text-red-400 hover:bg-red-500/10 hover:border-red-500/40 transition-all font-semibold text-sm flex items-center justify-center gap-2 shrink-0 self-start sm:self-center"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Clear History
                                    </button>
                                ) : (
                                    <div className="flex gap-2 self-start sm:self-center shrink-0">
                                        <button
                                            onClick={() => setShowConfirmDelete(false)}
                                            className="px-4 py-2.5 rounded-full bg-neutral-800 text-neutral-300 hover:bg-neutral-700 transition-all text-xs font-semibold"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleDeleteAll}
                                            disabled={deleting}
                                            className="px-5 py-2.5 rounded-full bg-red-500 hover:bg-red-600 text-white transition-all text-xs font-semibold flex items-center gap-2"
                                        >
                                            {deleting ? (
                                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                            ) : (
                                                "Yes, delete all"
                                            )}
                                        </button>
                                    </div>
                                )}
                            </div>

                            <AnimatePresence>
                                {showConfirmDelete && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="p-4 rounded-2xl bg-red-500/5 border border-red-500/10 text-xs text-red-400/90 leading-relaxed flex items-start gap-3 mt-4"
                                    >
                                        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                                        <div>
                                            <strong>Warning:</strong> Clicking confirm will wipe your entire daily journaling timelines and AI structured summaries. Please export your data first if you wish to preserve a backup.
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
