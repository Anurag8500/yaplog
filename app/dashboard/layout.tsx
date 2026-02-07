import type { Metadata } from "next";
import { DashboardShell } from "@/components/dashboard/DashboardShell";

export const metadata: Metadata = {
    title: "YAPLOG Dashboard",
    description: "Your personal cognitive companion.",
};

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // We move the layout logic to DashboardShell (Client Component) 
    // to handle the Sidebar state interaction
    return (
        <DashboardShell>
            {children}
        </DashboardShell>
    );
}
