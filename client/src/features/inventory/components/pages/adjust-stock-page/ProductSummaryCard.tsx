import { Package } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import type { ProductStatus } from "@/features/product/product.constants";

export interface ProductSummaryCardProps {
    name: string;
    sku: string;
    status: ProductStatus;
    currentStock: number;
    reorderLevel: number;
    maxStock: number;
}

export function ProductSummaryCard({
    name,
    sku,
    status,
    currentStock,
    reorderLevel,
    maxStock,
}: ProductSummaryCardProps) {
    return (
        <section className="bg-white rounded-2xl border border-[#E3E1DC] p-5 sm:p-6">
            <div className="flex items-start gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                    <Package className="h-6 w-6" strokeWidth={1.75} />
                </div>
                <div className="min-w-0 flex-1">
                    <h2 className="truncate text-base font-semibold text-slate-900">
                        {name}
                    </h2>
                    <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1.5">
                        <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 font-mono text-xs text-slate-600">
                            {sku}
                        </span>
                        <StatusBadge value={status} size="sm" />
                    </div>
                </div>
            </div>
            <div className="mt-5 grid grid-cols-3 divide-x divide-slate-100 rounded-xl bg-slate-50 py-3">
                <div className="px-1 text-center sm:px-4">
                    <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400 sm:text-[11px]">
                        Current Stock
                    </p>
                    <p className="mt-1 text-xl font-bold tabular-nums text-slate-900 sm:text-2xl">
                        {currentStock}
                    </p>
                </div>
                <div className="px-1 text-center sm:px-4">
                    <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400 sm:text-[11px]">
                        Reorder Level
                    </p>
                    <p className="mt-1 text-xl font-bold tabular-nums text-slate-700 sm:text-2xl">
                        {reorderLevel}
                    </p>
                </div>
                <div className="px-1 text-center sm:px-4">
                    <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400 sm:text-[11px]">
                        Max Stock
                    </p>
                    <p className="mt-1 text-xl font-bold tabular-nums text-slate-700 sm:text-2xl">
                        {maxStock}
                    </p>
                </div>
            </div>
        </section>
    );
}

function ProductSummaryCardSkeleton() {
    return (
        <section className="bg-white rounded-2xl border border-[#E3E1DC] p-5 sm:p-6">
            <div className="flex items-start gap-3">
                <div className="flex h-12 w-12 shrink-0 rounded-xl bg-slate-100 animate-pulse" />
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