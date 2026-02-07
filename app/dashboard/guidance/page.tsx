import { Placeholder } from "@/components/dashboard/Placeholder";
import { Compass } from "lucide-react";

export default function GuidancePage() {
    return (
        <Placeholder
            icon={Compass}
            label="Guidance"
            description="Gentle suggestions to help you stay aligned."
        />
    );
}
