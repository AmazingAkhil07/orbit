import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    className?: string;
    hoverEffect?: boolean;
}

export function GlassCard({
    children,
    className,
    hoverEffect = true,
    ...props
}: GlassCardProps) {
    return (
        <div
            className={cn(
                "relative overflow-hidden rounded-3xl border border-white/5 bg-zinc-900/40 backdrop-blur-md transition-all duration-300",
                hoverEffect && "hover:bg-zinc-900/60 hover:shadow-2xl hover:shadow-black/50 hover:-translate-y-1 hover:border-white/10",
                className
            )}
            {...props}
        >
            {/* Subtle Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-50 pointer-events-none" />

            {/* Content */}
            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
}
