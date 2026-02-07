import { Placeholder } from "@/components/dashboard/Placeholder";
import { History } from "lucide-react";

export default function RecallPage() {
    return (
        <Placeholder
            icon={History}
            label="Active Recall"
            description="Ask questions about your past conversations and plans."
        />
    );
}
