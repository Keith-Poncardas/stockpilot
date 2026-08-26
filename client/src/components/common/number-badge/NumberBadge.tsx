import { cn } from "@/lib/utils";

export interface NumberBadgeProps {
    count: number | string;
    className?: string;
    variant?: "default" | "subtle" | "brand" | "emerald" | "amber" | "outline";
}

/**
 * Global component for rendering number badges / pills (e.g., Total Orders, Item Counts).
 */
export function NumberBadge({ count, className, variant = "default" }: NumberBadgeProps) {
    const numericCount = typeof count === "number" ? count : Number(count) || 0;

    const variantStyles = {
        default: numericCount > 0
            ? "bg-slate-100 text-slate-700 font-mono"
            : "bg-slate-50 text-slate-400 font-mono",
        subtle: "bg-slate-100/80 text-slate-700 font-mono border border-slate-200/60",
        brand: "bg-indigo-50 text-indigo-700 font-mono border border-indigo-100/80",
        emerald: "bg-emerald-50 text-emerald-700 font-mono border border-emerald-100/80",
        amber: "bg-amber-50 text-amber-700 font-mono border border-amber-100/80",
        outline: "bg-white text-slate-700 font-mono border border-slate-200 shadow-2xs",
    };

    return (
        <div className="flex justify-center">
            <span
                className={cn(
                    "inline-flex items-center justify-center min-w-6 h-6 px-2 rounded-full text-xs font-semibold tracking-tight transition-colors",
                    variantStyles[variant] || variantStyles.default,
                    className
                )}
            >
                {count}
            </span>
        </div>
    );
}
