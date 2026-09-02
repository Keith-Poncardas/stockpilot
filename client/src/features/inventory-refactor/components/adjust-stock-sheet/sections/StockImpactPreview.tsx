import { ArrowRight, ChartNoAxesColumn } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FormSection } from '@/components/ui/form-section';
import Alert from '@/components/ui/alert';
import { StatItem } from '@/components/ui/stat-item';
import { useStockImpactPreview } from '../hooks';
import type { UseStockImpactPreviewOptions } from '../hooks';

export type StockImpactPreviewProps = UseStockImpactPreviewOptions;

function StockValue({
    label,
    value,
    className,
}: {
    label: string;
    value: number;
    className?: string;
}) {
    return (
        <div className="text-center min-w-0 flex-1">
            <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400 truncate">
                {label}
            </p>
            <p className={cn('mt-1 text-2xl font-bold tabular-nums truncate font-mono', className)}>
                {value.toLocaleString()}
            </p>
        </div>
    );
}

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
        status === 'error'
            ? 'text-rose-600'
            : status === 'warning'
                ? 'text-amber-600'
                : isAboveMax
                    ? 'text-amber-600'
                    : 'text-emerald-600';

    const deltaColor =
        status === 'error'
            ? 'text-rose-600'
            : status === 'warning'
                ? 'text-amber-600'
                : adjustmentType === 'decrease'
                    ? 'text-rose-500'
                    : 'text-emerald-600';

    return (
        <FormSection
            title="Projected Stock Impact"
            description="Live recalculation of stock on hand based on current input."
            icon={<ChartNoAxesColumn className="h-4 w-4" strokeWidth={2} />}
            iconWrapperClassName="bg-indigo-50 text-indigo-600"
        >
            <div className="mt-2 flex items-center justify-between gap-2 p-4 rounded-xl bg-slate-50/80 border border-slate-200/80">
                <StockValue label="Current" value={currentStock} className="text-slate-900" />
                <ArrowRight className="h-5 w-5 shrink-0 text-slate-400" strokeWidth={2} />
                <StockValue label="Projected" value={newStock} className={newStockColor} />
            </div>

            <p className={cn('mt-3 text-center text-sm font-semibold', deltaColor)}>
                {deltaLabel}
            </p>

            {isBelowReorder && (
                <Alert variant="warning" className="mt-3 mb-0 text-xs" aria-live="polite">
                    This adjustment will drop inventory below the reorder threshold.
                </Alert>
            )}

            {isNegative && (
                <Alert variant="error" className="mt-3 mb-0 text-xs" aria-live="polite">
                    Projected stock cannot be negative. Reduce adjustment units.
                </Alert>
            )}

            {isAboveMax && (
                <Alert variant="warning" className="mt-3 mb-0 text-xs" aria-live="polite">
                    Projected stock exceeds the configured maximum stock capacity.
                </Alert>
            )}

            <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-200/80 pt-4">
                <StatItem label="Reorder Level" value={`${props.reorderLevel.toLocaleString()} units`} />
                <StatItem label="Max Capacity" value={`${props.maxStock.toLocaleString()} units`} />
            </dl>
        </FormSection>
    );
}

function StockImpactPreviewSkeleton() {
    return (
        <FormSection
            title="Projected Stock Impact"
            icon={<ChartNoAxesColumn className="h-4 w-4" strokeWidth={2} />}
            iconWrapperClassName="bg-indigo-50 text-indigo-600"
        >
            <div className="mt-2 flex items-center justify-between gap-2 p-4 rounded-xl bg-slate-50 animate-pulse">
                <div className="w-full flex flex-col items-center">
                    <div className="h-2.5 w-14 rounded bg-slate-200 animate-pulse" />
                    <div className="mt-2 h-7 w-12 rounded bg-slate-200 animate-pulse" />
                </div>
                <ArrowRight className="h-5 w-5 shrink-0 text-slate-300" strokeWidth={2} />
                <div className="w-full flex flex-col items-center">
                    <div className="h-2.5 w-14 rounded bg-slate-200 animate-pulse" />
                    <div className="mt-2 h-7 w-12 rounded bg-slate-200 animate-pulse" />
                </div>
            </div>
            <div className="mt-4 flex justify-center">
                <div className="h-4 w-28 rounded bg-slate-200 animate-pulse" />
            </div>
        </FormSection>
    );
}

StockImpactPreview.skeleton = StockImpactPreviewSkeleton;
