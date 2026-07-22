import { ArrowRight, ChartNoAxesColumn } from "lucide-react";
import { cn } from "@/lib/utils";
import { FormSection } from "@/components/ui/form-section";
import Alert from "@/components/ui/alert";
import { useStockImpactPreview, type UseStockImpactPreviewOptions } from "@/features/inventory/hooks";
import { StatItem } from "@/components/ui/stat-item";


// ─── Props ────────────────────────────────────────────────────────────────────

export type StockImpactPreviewProps = UseStockImpactPreviewOptions;

// ─── Sub-components ───────────────────────────────────────────────────────────

function StockValue({ label, value, className }: { label: string; value: number; className?: string }) {
    return (
        <div className="text-center min-w-0 flex-1">
            <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400 truncate">{label}</p>
            <p className={cn("mt-1 text-2xl font-bold tabular-nums truncate", className)}>
                {value}
            </p>
        </div>
    );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function StockImpactPreview(props: StockImpactPreviewProps) {
    const {
        currentStock,
        newStock,
        deltaLabel,
        status,
        adjustmentType,
        isBelowReorder,
        isNegative,
        isAboveMax,
    } = useStockImpactPreview(props);

    const newStockColor =
        status === "error"
            ? "text-rose-600"
            : status === "warning"
                ? "text-amber-600"
                : isAboveMax
                    ? "text-amber-600"
                    : "text-emerald-600";

    const deltaColor =
        status === "error"
            ? "text-rose-600"
            : status === "warning"
                ? "text-amber-600"
                : adjustmentType === "decrease"
                    ? "text-rose-500"
                    : "text-emerald-600";

    return (
        <FormSection
            title="Stock Impact Preview"
            icon={<ChartNoAxesColumn className="h-4 w-4" strokeWidth={2} />}
            iconWrapperClassName="bg-indigo-50 text-indigo-600"
        >
            {/* Current → New */}
            <div className="mt-4 flex items-center justify-between gap-2">
                <StockValue label="Current" value={currentStock} className="text-slate-900" />
                <ArrowRight className="h-5 w-5 shrink-0 text-slate-300" strokeWidth={2} />
                <StockValue label="New" value={newStock} className={newStockColor} />
            </div>

            {/* Delta label */}
            <p className={cn("mt-3 text-center text-sm font-medium", deltaColor)}>
                {deltaLabel}
            </p>

            {/* Warning banner — below reorder level */}
            {isBelowReorder && (
                <Alert variant="warning" className="mt-4 mb-0 text-xs" aria-live="polite">
                    This adjustment brings stock below the reorder level.
                </Alert>
            )}

            {/* Error banner — negative stock */}
            {isNegative && (
                <Alert variant="error" className="mt-4 mb-0 text-xs" aria-live="polite">
                    Resulting stock can&apos;t be negative. Lower the quantity.
                </Alert>
            )}

            {/* Above max banner */}
            {isAboveMax && (
                <Alert variant="warning" className="mt-4 mb-0 text-xs" aria-live="polite">
                    This adjustment exceeds the maximum stock level.
                </Alert>
            )}

            {/* Threshold summary */}
            <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4">
                <StatItem label="On hand" value={`${currentStock} units`} />
                <StatItem label="Reorder at" value={`${props.reorderLevel} units`} />
            </dl>
        </FormSection>
    );
}

function StockImpactPreviewSkeleton() {
    return (
        <FormSection
            title="Stock Impact Preview"
            icon={<ChartNoAxesColumn className="h-4 w-4" strokeWidth={2} />}
            iconWrapperClassName="bg-indigo-50 text-indigo-600"
        >
            {/* Current → New */}
            <div className="mt-4 flex items-center justify-between gap-2">
                <div className="w-full flex flex-col items-center">
                    <div className="h-2.5 w-14 rounded bg-slate-100 animate-pulse" />
                    <div className="mt-2 h-7 w-12 rounded bg-slate-100 animate-pulse" />
                </div>
                <ArrowRight className="h-5 w-5 shrink-0 text-slate-100 animate-pulse" strokeWidth={2} />
                <div className="w-full flex flex-col items-center">
                    <div className="h-2.5 w-14 rounded bg-slate-100 animate-pulse" />
                    <div className="mt-2 h-7 w-12 rounded bg-slate-100 animate-pulse" />
                </div>
            </div>

            {/* Delta label */}
            <div className="mt-4 flex justify-center">
                <div className="h-4 w-28 rounded bg-slate-100 animate-pulse" />
            </div>

            {/* Threshold summary */}
            <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4">
                {[...Array(2)].map((_, i) => (
                    <div key={i} className="rounded-lg bg-slate-50 px-3 py-2.5">
                        <div className="h-2.5 w-14 rounded bg-slate-200 animate-pulse" />
                        <div className="mt-1.5 h-4 w-20 rounded bg-slate-200 animate-pulse" />
                    </div>
                ))}
            </dl>
        </FormSection>
    );
}

StockImpactPreview.skeleton = StockImpactPreviewSkeleton;
