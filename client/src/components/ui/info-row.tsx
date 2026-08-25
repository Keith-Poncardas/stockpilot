import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export interface InfoRowProps {
    label: ReactNode;
    value: ReactNode;
    className?: string;
    labelClassName?: string;
    valueClassName?: string;
}

/**
 * A reusable key-value information row component for display sections, cards, and detail panels.
 *
 * @example
 * ```tsx
 * <InfoRow label="Customer Name" value="John Doe" />
 * <InfoRow label="Status" value={<StatusBadge status="ACTIVE" />} />
 * ```
 */
export function InfoRow({
    label,
    value,
    className,
    labelClassName,
    valueClassName,
}: InfoRowProps) {
    return (
        <div
            className={cn(
                "flex flex-col sm:flex-row sm:items-center justify-between py-2.5 border-b border-[#F0EEE9] dark:border-zinc-800/60 last:border-0 gap-1 sm:gap-4",
                className
            )}
        >
            <span
                className={cn(
                    "text-xs font-medium text-slate-500 dark:text-slate-400",
                    labelClassName
                )}
            >
                {label}
            </span>
            <span
                className={cn(
                    "text-sm font-semibold text-slate-900 dark:text-white sm:text-right",
                    valueClassName
                )}
            >
                {value}
            </span>
        </div>
    );
}

function InfoRowSkeleton() {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2.5 border-b border-[#F0EEE9] dark:border-zinc-800/60 last:border-0 gap-1 sm:gap-4">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-24" />
        </div>
    );
}

InfoRow.Skeleton = InfoRowSkeleton;
