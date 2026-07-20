import { Sparkles } from 'lucide-react'
import { cn, formatDate } from '@/lib/utils'

export interface InventoryHealthData {
    onHand: number;
    reorderLevel: number;
    maxStock: number;
    lastRestockDate: string;
    estimatedDaysOfStock: number;
    aiRecommendation?: string;
}

interface InventoryHealthProps {
    data: InventoryHealthData;
}

export function InventoryHealth({ data }: InventoryHealthProps) {
    const {
        onHand,
        reorderLevel,
        maxStock,
        lastRestockDate,
        estimatedDaysOfStock,
        aiRecommendation
    } = data;

    // Calculate percentage for the progress bar based on max stock
    const percentage = maxStock > 0
        ? Math.min(100, Math.max(0, (onHand / maxStock) * 100))
        : 0;

    // Calculate position for reorder level indicator
    const reorderPercentage = maxStock > 0
        ? Math.min(100, (reorderLevel / maxStock) * 100)
        : 0;

    // Determine status
    let statusText = 'In Stock';
    let statusColors = 'bg-emerald-50 text-emerald-700 border-emerald-200';
    let indicatorColor = 'bg-emerald-500';
    let barColor = 'bg-[#2F9E6E]';

    if (onHand === 0) {
        statusText = 'Out of Stock';
        statusColors = 'bg-red-50 text-red-700 border-red-200';
        indicatorColor = 'bg-red-500';
        barColor = 'bg-red-500';
    } else if (onHand <= reorderLevel) {
        statusText = 'Low Stock';
        statusColors = 'bg-amber-50 text-amber-700 border-amber-200';
        indicatorColor = 'bg-amber-500';
        barColor = 'bg-[#E8A33D]';
    }

    return (
        <section className="bg-white rounded-2xl border border-[#E3E1DC] p-5 sm:p-6">
            <h2 className="font-display font-semibold text-lg mb-4 flex items-center justify-between">
                Inventory Health
                {aiRecommendation && (
                    <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                        <Sparkles className="w-3 h-3" /> AI Powered
                    </span>
                )}
            </h2>

            <div className="flex items-end justify-between mb-2">
                <div>
                    <p className="text-xs uppercase tracking-wide text-[#9C9A91] font-semibold">
                        On Hand
                    </p>
                    <p className="font-display text-4xl font-semibold mt-1">{onHand}</p>
                </div>
                <span className={cn("inline-flex items-center gap-1.5 rounded-full text-xs font-semibold px-2.5 py-1 border", statusColors)}>
                    <span className={cn("w-1.5 h-1.5 rounded-full", indicatorColor)} /> {statusText}
                </span>
            </div>

            <div className="relative w-full h-2.5 rounded-full bg-[#F0EFEA] overflow-hidden mt-4">
                <div
                    className={cn("h-full rounded-full transition-all duration-500", barColor)}
                    style={{ width: `${percentage}%` }}
                />

                {maxStock > 0 && reorderLevel > 0 && (
                    <div
                        className="absolute top-0 bottom-0 w-0.5 bg-slate-900/40 z-10"
                        style={{ left: `${reorderPercentage}%` }}
                        title={`Reorder level: ${reorderLevel}`}
                    />
                )}
            </div>

            <div className="flex items-center justify-between mt-2 text-xs text-[#9C9A91] font-mono">
                <span>{onHand}</span>
                <span>Reorder level: {reorderLevel}</span>
                <span>{maxStock}</span>
            </div>

            <dl className="grid grid-cols-2 gap-4 mt-5 pt-5 border-t border-[#E3E1DC]">
                <div>
                    <dt className="text-xs uppercase tracking-wide text-[#9C9A91] font-semibold">
                        Last Restock
                    </dt>
                    <dd className="text-sm font-medium mt-1">{formatDate(lastRestockDate)}</dd>
                </div>
                <div>
                    <dt className="text-xs uppercase tracking-wide text-[#9C9A91] font-semibold">
                        Days of Stock
                    </dt>
                    <dd className="text-sm font-medium mt-1">~{estimatedDaysOfStock} days</dd>
                </div>
            </dl>

            {aiRecommendation && (
                <div className="mt-5 p-3 rounded-lg bg-indigo-50/50 border border-indigo-100 flex gap-3 items-start">
                    <Sparkles className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                    <p className="text-sm text-indigo-900 leading-relaxed">
                        <span className="font-semibold block mb-1">AI Recommendation</span>
                        {aiRecommendation}
                    </p>
                </div>
            )}
        </section>
    )
}

InventoryHealth.Skeleton = function InventoryHealthSkeleton() {
    return (
        <section className="bg-white rounded-2xl border border-[#E3E1DC] p-5 sm:p-6">
            <div className="h-6 w-40 bg-[#F0EFEA] animate-pulse rounded-md mb-4" />

            <div className="flex items-end justify-between mb-2">
                <div>
                    <div className="h-3 w-16 bg-[#F0EFEA] animate-pulse rounded-md mb-2" />
                    <div className="h-10 w-24 bg-[#F0EFEA] animate-pulse rounded-md" />
                </div>
                <div className="h-6 w-24 bg-[#F0EFEA] animate-pulse rounded-full" />
            </div>

            <div className="w-full h-2.5 rounded-full bg-[#F0EFEA] animate-pulse mt-4" />

            <div className="flex items-center justify-between mt-3">
                <div className="h-3 w-4 bg-[#F0EFEA] animate-pulse rounded-md" />
                <div className="h-3 w-32 bg-[#F0EFEA] animate-pulse rounded-md" />
                <div className="h-3 w-8 bg-[#F0EFEA] animate-pulse rounded-md" />
            </div>

            <div className="grid grid-cols-2 gap-4 mt-5 pt-5 border-t border-[#E3E1DC]">
                <div>
                    <div className="h-3 w-24 bg-[#F0EFEA] animate-pulse rounded-md mb-2" />
                    <div className="h-4 w-32 bg-[#F0EFEA] animate-pulse rounded-md mt-1" />
                </div>
                <div>
                    <div className="h-3 w-24 bg-[#F0EFEA] animate-pulse rounded-md mb-2" />
                    <div className="h-4 w-24 bg-[#F0EFEA] animate-pulse rounded-md mt-1" />
                </div>
            </div>

            <div className="mt-5 h-20 w-full bg-[#F0EFEA] animate-pulse rounded-lg" />
        </section>
    );
}
