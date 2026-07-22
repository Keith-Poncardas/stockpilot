import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

// ─── Props ────────────────────────────────────────────────────────────────────

interface StatItemProps {
    /** Muted uppercase label shown above the value */
    label: string;
    /** The value to display */
    value: ReactNode;
    /** Optional id forwarded to the <dd> element — useful for testing / aria */
    valueId?: string;
    /** Extra classes applied to the wrapper <div> */
    className?: string;
}

// ─── Component ───────────────────────────────────────────────────────────────

/**
 * A compact label + value tile used inside summary / preview `<dl>` grids.
 *
 * ```tsx
 * <dl className="grid grid-cols-2 gap-3">
 *   <StatItem label="On hand" value={qty} valueId="previewQty" />
 *   <StatItem label="Reorder at" value={reorder} valueId="previewReorder" />
 * </dl>
 * ```
 */
export function StatItem({ label, value, valueId, className }: StatItemProps) {
    return (
        <div className={cn("rounded-lg bg-slate-50 px-3 py-2.5 min-w-0", className)}>
            <dt className="text-[11px] font-medium text-slate-400 uppercase tracking-wide truncate">
                {label}
            </dt>
            <dd id={valueId} className="font-mono text-sm font-semibold mt-0.5 truncate">
                {value}
            </dd>
        </div>
    );
}
