import { Package } from 'lucide-react';
import { StatusBadge } from '@/components/StatusBadge';
import type { ProductStatus } from '@/features/product/types';
import { getOptimizedImageUrl } from '@/lib/cloudinary';

export interface ProductSummaryCardProps {
    name: string;
    sku: string;
    status: ProductStatus;
    currentStock: number;
    reorderLevel: number;
    maxStock: number;
    imageUrl?: string | null;
}

export function ProductSummaryCard({
    name,
    sku,
    status,
    currentStock,
    reorderLevel,
    maxStock,
    imageUrl,
}: ProductSummaryCardProps) {
    return (
        <section className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-2xs">
            <div className="flex items-start gap-3">
                <div className="w-12 h-12 shrink-0 rounded-xl bg-gradient-to-br from-indigo-50 to-indigo-100/60 border border-indigo-100 flex items-center justify-center overflow-hidden">
                    {imageUrl ? (
                        <img
                            src={getOptimizedImageUrl(imageUrl, { width: 96, height: 96, crop: 'fill' })}
                            alt={name}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <Package className="h-6 w-6 text-indigo-600" strokeWidth={1.75} />
                    )}
                </div>
                <div className="min-w-0 flex-1">
                    <h2 className="truncate text-base font-semibold text-slate-900" title={name}>
                        {name}
                    </h2>
                    <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1.5">
                        <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 font-mono text-xs text-slate-600 border border-slate-200/70">
                            {sku}
                        </span>
                        <StatusBadge value={status} size="sm" />
                    </div>
                </div>
            </div>
            <div className="mt-5 grid grid-cols-3 divide-x divide-slate-100 rounded-xl bg-slate-50/80 border border-slate-100 py-3">
                <div className="px-1 text-center sm:px-4 min-w-0">
                    <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400 sm:text-[11px] truncate">
                        Current Stock
                    </p>
                    <p className="mt-1 text-xl font-bold tabular-nums text-slate-900 sm:text-2xl truncate font-mono">
                        {currentStock.toLocaleString()}
                    </p>
                </div>
                <div className="px-1 text-center sm:px-4 min-w-0">
                    <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400 sm:text-[11px] truncate">
                        Reorder Level
                    </p>
                    <p className="mt-1 text-xl font-bold tabular-nums text-slate-700 sm:text-2xl truncate font-mono">
                        {reorderLevel.toLocaleString()}
                    </p>
                </div>
                <div className="px-1 text-center sm:px-4 min-w-0">
                    <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400 sm:text-[11px] truncate">
                        Max Stock
                    </p>
                    <p className="mt-1 text-xl font-bold tabular-nums text-slate-700 sm:text-2xl truncate font-mono">
                        {maxStock.toLocaleString()}
                    </p>
                </div>
            </div>
        </section>
    );
}

function ProductSummaryCardSkeleton() {
    return (
        <section className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-2xs">
            <div className="flex items-start gap-3">
                <div className="w-12 h-12 shrink-0 rounded-xl bg-slate-100 animate-pulse" />
                <div className="min-w-0 flex-1">
                    <div className="mt-1 h-4 w-48 rounded bg-slate-100 animate-pulse" />
                    <div className="mt-2.5 flex flex-wrap items-center gap-x-2 gap-y-1.5">
                        <div className="h-5 w-20 rounded-md bg-slate-100 animate-pulse" />
                        <div className="h-5 w-16 rounded-full bg-slate-100 animate-pulse" />
                    </div>
                </div>
            </div>
            <div className="mt-5 grid grid-cols-3 divide-x divide-slate-100 rounded-xl bg-slate-50 py-3">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="px-1 flex flex-col items-center sm:px-4">
                        <div className="h-2.5 w-20 rounded bg-slate-200 animate-pulse" />
                        <div className="mt-2 h-7 w-12 rounded bg-slate-200 animate-pulse sm:h-8 sm:w-16" />
                    </div>
                ))}
            </div>
        </section>
    );
}

ProductSummaryCard.skeleton = ProductSummaryCardSkeleton;
