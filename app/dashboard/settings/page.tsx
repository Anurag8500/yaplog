import { Placeholder } from "@/components/dashboard/Placeholder";
import { Settings } from "lucide-react";

export default function SettingsPage() {
    return (
        <Placeholder
            icon={Settings}
            label="Settings"
            description="Manage your preferences and data privacy."
        />
    );
}
