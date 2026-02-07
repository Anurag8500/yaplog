import { Placeholder } from "@/components/dashboard/Placeholder";
import { Mic } from "lucide-react";

export default function TalkPage() {
    return (
        <Placeholder
            icon={Mic}
            label="Talk Space"
            description="Speak freely. AI will structure your thoughts."
        />
    );
}
