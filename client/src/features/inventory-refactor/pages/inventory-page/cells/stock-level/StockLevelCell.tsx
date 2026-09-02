import type { InventoryRowProps } from '@/features/inventory-refactor/types';
import { BellRing, ShieldCheck } from 'lucide-react';

export function StockThresholdsCell({ row }: InventoryRowProps) {
    const { reorderLevel, maxStock } = row.original;

    return (
        <div className="flex flex-col gap-1 py-0.5">
            {/* Reorder Level */}
            <div className="flex items-center gap-1.5 text-xs text-slate-700">
                <BellRing className="w-3 h-3 text-amber-500 shrink-0" />
                <span className="text-[11px] text-slate-400 font-medium">Min:</span>
                <span className="font-mono font-semibold text-slate-800">
                    {reorderLevel.toLocaleString()}
                </span>
            </div>

            {/* Max Capacity */}
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <ShieldCheck className="w-3 h-3 text-slate-400 shrink-0" />
                <span className="text-[11px] text-slate-400 font-medium">Max:</span>
                <span className="font-mono text-slate-600">
                    {maxStock > 0 ? maxStock.toLocaleString() : 'No Limit'}
                </span>
            </div>
        </div>
    );
}

export function ReorderLevelCell({ row }: InventoryRowProps) {
    return (
        <span className="font-mono text-sm text-slate-700 font-medium">
            {row.original.reorderLevel.toLocaleString()}
        </span>
    );
}

export function MaxStockCell({ row }: InventoryRowProps) {
    return (
        <span className="font-mono text-sm text-slate-700 font-medium">
            {row.original.maxStock > 0 ? row.original.maxStock.toLocaleString() : '—'}
        </span>
    );
}
