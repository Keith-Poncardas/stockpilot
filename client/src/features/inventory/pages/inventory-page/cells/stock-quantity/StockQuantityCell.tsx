import { cn } from '@/lib/utils';
import type { InventoryRowProps } from '@/features/inventory/types';
import { getQtyClass } from '@/features/inventory/utils';
import { AlertCircle, CheckCircle2, AlertTriangle } from 'lucide-react';

export function StockQuantityCell({ row }: InventoryRowProps) {
    const { quantityOnHand, reorderLevel, maxStock } = row.original;
    const isOut = quantityOnHand <= 0;
    const isLow = !isOut && quantityOnHand <= reorderLevel;
    const isHealthy = !isOut && !isLow;

    const fillPercent = maxStock > 0 ? Math.min(Math.round((Math.max(0, quantityOnHand) / maxStock) * 100), 100) : null;

    return (
        <div className="flex flex-col gap-1 py-0.5 min-w-[150px]">
            {/* Top row: Quantity & Badge */}
            <div className="flex items-center gap-2">
                <span
                    className={cn(
                        'font-mono text-sm font-bold tracking-tight',
                        getQtyClass(quantityOnHand, reorderLevel)
                    )}
                >
                    {quantityOnHand.toLocaleString()}
                    <span className="text-[11px] font-normal text-slate-500 ml-1">units</span>
                </span>

                {isOut && (
                    <span
                        className="inline-flex items-center gap-1 text-[10px] font-semibold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded-full border border-rose-200/80 shadow-2xs"
                        title="Out of stock"
                    >
                        <AlertCircle className="w-2.5 h-2.5 text-rose-600 shrink-0" />
                        Out
                    </span>
                )}

                {isLow && (
                    <span
                        className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded-full border border-amber-200/80 shadow-2xs"
                        title="At or below reorder level"
                    >
                        <AlertTriangle className="w-2.5 h-2.5 text-amber-600 shrink-0" />
                        Low
                    </span>
                )}

                {isHealthy && (
                    <span
                        className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-full border border-emerald-200/70 shadow-2xs"
                        title="Well stocked"
                    >
                        <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600 shrink-0" />
                        Optimal
                    </span>
                )}
            </div>

            {/* Bottom row: Capacity Fill Bar or Reorder Hint */}
            {fillPercent !== null ? (
                <div className="flex items-center gap-2">
                    <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/60">
                        <div
                            className={cn(
                                'h-full rounded-full transition-all duration-300',
                                isOut && 'bg-rose-500',
                                isLow && 'bg-amber-500',
                                isHealthy && 'bg-emerald-500'
                            )}
                            style={{ width: `${Math.max(fillPercent, isOut ? 0 : 4)}%` }}
                        />
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 font-medium">
                        {fillPercent}% cap
                    </span>
                </div>
            ) : (
                <span className="text-[10px] text-slate-400 font-medium">
                    Reorder at {reorderLevel.toLocaleString()} units
                </span>
            )}
        </div>
    );
}
