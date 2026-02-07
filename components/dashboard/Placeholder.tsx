import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface PlaceholderProps {
    icon?: LucideIcon;
    label: string;
    description?: string;
}

export function Placeholder({ icon: Icon, label, description }: PlaceholderProps) {
    return (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center animate-in fade-in zoom-in-95 duration-700">
            {Icon && (
                <div className="mb-6 p-4 rounded-full bg-neutral-900/50 text-neutral-600">
                    <Icon className="w-8 h-8" />
                </div>
            )}
            <h2 className="text-xl font-medium text-neutral-300 mb-2">{label}</h2>
            {description && <p className="text-neutral-500 max-w-md">{description}</p>}
        </div>
    );
}
