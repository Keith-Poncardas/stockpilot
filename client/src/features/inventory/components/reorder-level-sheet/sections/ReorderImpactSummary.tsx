import { useWatch, type Control } from 'react-hook-form';
import { BellRing, ShieldCheck, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import { FormSection } from '@/components/ui/form-section';
import { StatItem } from '@/components/ui/stat-item';
import type { UpdateReorderLevelFormValues } from '../../../types';

export interface ReorderImpactSummaryProps {
    control: Control<UpdateReorderLevelFormValues>;
    currentStock: number;
    initialReorderLevel: number;
    initialMaxStock: number;
}

export function ReorderImpactSummary({
    control,
    currentStock,
    initialReorderLevel,
    initialMaxStock,
}: ReorderImpactSummaryProps) {
    const watchedReorderLevel = useWatch({ control, name: 'reorderLevel' });
    const watchedMaxStock = useWatch({ control, name: 'maxStock' });

    const newReorderLevel =
        watchedReorderLevel !== undefined && watchedReorderLevel !== null
            ? Number(watchedReorderLevel)
            : initialReorderLevel;

    const newMaxStock =
        watchedMaxStock !== undefined && watchedMaxStock !== null
            ? Number(watchedMaxStock)
            : initialMaxStock;

    const isOutOfStock = currentStock <= 0;
    const isLowStock = !isOutOfStock && currentStock <= newReorderLevel;
    const isAboveMax = newMaxStock > 0 && currentStock > newMaxStock;

    return (
        <FormSection
            title="Threshold Impact Summary"
            description="Live status determination based on current on-hand stock."
            icon={<BellRing className="h-4 w-4" strokeWidth={2} />}
            iconWrapperClassName="bg-indigo-50 text-indigo-600"
        >
            <div className="space-y-4">
                {/* Visual Status Banner */}
                {isOutOfStock ? (
                    <div className="flex items-center gap-3 rounded-xl border border-rose-200 bg-rose-50/80 p-3.5 text-rose-800">
                        <XCircle className="h-5 w-5 shrink-0 text-rose-600" />
                        <div>
                            <p className="text-sm font-semibold">Critical / Out of Stock</p>
                            <p className="text-xs text-rose-700/90 mt-0.5">
                                On-hand stock is 0. Item requires immediate restocking.
                            </p>
                        </div>
                    </div>
                ) : isLowStock ? (
                    <div className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50/80 p-3.5 text-amber-800">
                        <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600" />
                        <div>
                            <p className="text-sm font-semibold">Low Stock Alert Triggered</p>
                            <p className="text-xs text-amber-700/90 mt-0.5">
                                Current stock ({currentStock}) is at or below the reorder level ({newReorderLevel}).
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50/80 p-3.5 text-emerald-800">
                        <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
                        <div>
                            <p className="text-sm font-semibold">Stock Status: Optimal</p>
                            <p className="text-xs text-emerald-700/90 mt-0.5">
                                Current stock ({currentStock}) is safely above the reorder level ({newReorderLevel}).
                            </p>
                        </div>
                    </div>
                )}

                {isAboveMax && (
                    <div className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50/70 p-3 text-amber-800 text-xs">
                        <ShieldCheck className="h-4 w-4 shrink-0 text-amber-600" />
                        <span>
                            Note: On-hand quantity ({currentStock}) exceeds configured maximum capacity ({newMaxStock}).
                        </span>
                    </div>
                )}

                {/* Stat comparison grid */}
                <dl className="grid grid-cols-2 gap-3 pt-1">
                    <StatItem
                        label={`Reorder (Was: ${initialReorderLevel})`}
                        value={newReorderLevel.toLocaleString()}
                    />
                    <StatItem
                        label={`Max Cap (Was: ${initialMaxStock})`}
                        value={newMaxStock.toLocaleString()}
                    />
                </dl>
            </div>
        </FormSection>
    );
}
