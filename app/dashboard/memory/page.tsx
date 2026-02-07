import { Placeholder } from "@/components/dashboard/Placeholder";
import { Brain } from "lucide-react";

export default function MemoryPage() {
    return (
        <Placeholder
            icon={Brain}
            label="Memory Bank"
            description="Everything you've shared is stored securely here."
        />
    );
}
