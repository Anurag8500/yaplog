import type { Metadata } from "next";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { auth } from "@/auth";

export const metadata: Metadata = {
    title: "YAPLOG Dashboard",
    description: "Your personal cognitive companion.",
};

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // We move the layout logic to DashboardShell (Client Component) 
    // to handle the Sidebar state interaction
    const session = await auth();
    return (
        <DashboardShell session={session}>
            {children}
        </DashboardShell>
    );
}
