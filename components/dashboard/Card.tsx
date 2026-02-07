import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    className?: string;
    hoverEffect?: boolean;
}

export function Card({ children, className, hoverEffect = true, ...props }: CardProps) {
    return (
        <div
            className={cn(
                "rounded-2xl border border-neutral-900 bg-neutral-950/50 p-6 backdrop-blur-sm",
                "transition-all duration-300 ease-out",
                hoverEffect && "hover:-translate-y-1 hover:shadow-lg hover:shadow-neutral-950/50 hover:border-neutral-800",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}
