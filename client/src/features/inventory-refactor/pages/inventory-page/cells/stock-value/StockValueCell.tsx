import { formatCurrency } from '@/lib/utils';
import type { InventoryRowProps } from '@/features/inventory-refactor/types';

export function StockValueCell({ row }: InventoryRowProps) {
    const { quantityOnHand, product } = row.original;
    const unitPrice = product.unitPrice || 0;
    const totalAssetValue = Math.max(0, quantityOnHand) * unitPrice;

    return (
        <div className="flex flex-col gap-0.5 py-0.5">
            {/* Total asset valuation */}
            <span className="font-mono text-sm font-bold text-slate-900 leading-snug">
                {formatCurrency(totalAssetValue)}
            </span>

            {/* Unit Price SRP */}
            <span className="font-mono text-[11px] text-slate-500 font-medium">
                @{formatCurrency(unitPrice)} / unit
            </span>
        </div>
    );
}
