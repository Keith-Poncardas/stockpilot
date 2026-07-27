import { DollarSign } from 'lucide-react';
import { FormSection } from '@/components/ui/form-section';
import { cn, formatCurrency } from '@/lib/utils';
import type { IStockMovement, MovementType } from '@/features/stock-movement/stock-movement.types';
import { getMovementColor, getMovementPrefix } from './movement-details.utils';

// ─── Private helpers (InventoryValueImpact-specific) ──────────────────────────

function getTotalValueLabel(type: MovementType): string {
    switch (type) {
        case 'IN':
            return 'Total Value Added';
        case 'OUT':
            return 'Total Value Removed';
        case 'ADJUSTMENT':
        default:
            return 'Total Value Adjusted';
    }
}

// ─── Component ────────────────────────────────────────────────────────────────

interface InventoryValueImpactProps {
    movement: IStockMovement;
}

export function InventoryValueImpact({ movement }: InventoryValueImpactProps) {
    const { type, quantity, product } = movement;
    const costPrice = product.costPrice;

    /**
     * totalValue = costPrice × quantity
     * null when costPrice hasn't been set on the product.
     */
    const totalValue = costPrice !== null ? costPrice * quantity : null;

    const totalLabel = getTotalValueLabel(type);
    const totalColor = getMovementColor(type);
    const prefix = getMovementPrefix(type);

    return (
        <FormSection
            title="Inventory Value Impact"
            description="How much inventory value was affected by this stock movement."
            icon={<DollarSign className="w-4.5 h-4.5" strokeWidth={2} />}
            iconWrapperClassName="bg-blue-50 text-blue-600"
        >
            <div className="grid grid-cols-3 divide-x divide-slate-100">
                {/* Cost / Unit */}
                <div className="pr-4">
                    <p className="text-xs text-slate-400 mb-1">Cost / Unit</p>
                    {costPrice !== null ? (
                        <p className="text-lg font-semibold text-slate-900">
                            {formatCurrency(costPrice)}
                        </p>
                    ) : (
                        <p className="text-sm text-slate-400 italic">Not set</p>
                    )}
                </div>

                {/* Quantity */}
                <div className="px-4">
                    <p className="text-xs text-slate-400 mb-1">Quantity</p>
                    <p className="text-lg font-semibold text-slate-900">
                        {quantity.toLocaleString()}
                    </p>
                </div>

                {/* Total Value */}
                <div className="pl-4">
                    <p className="text-xs text-slate-400 mb-1">{totalLabel}</p>
                    {totalValue !== null ? (
                        <p className={cn('text-lg font-semibold', totalColor)}>
                            {prefix}{formatCurrency(totalValue)}
                        </p>
                    ) : (
                        <p className="text-sm text-slate-400 italic">N/A</p>
                    )}
                </div>
            </div>
        </FormSection>
    );
}


function InventoryValueImpactSkeleton() {
    return (
        <FormSection
            title="Inventory Value Impact"
            description="How much inventory value was affected by this stock movement."
            icon={<DollarSign className="w-4.5 h-4.5" strokeWidth={2} />}
            iconWrapperClassName="bg-blue-50 text-blue-600"
        >
            <div className="grid grid-cols-3 divide-x divide-slate-100">
                <div className="pr-4">
                    <div className="h-3 w-16 bg-slate-100 animate-pulse rounded mb-2" />
                    <div className="h-6 w-24 bg-slate-100 animate-pulse rounded" />
                </div>
                <div className="px-4">
                    <div className="h-3 w-14 bg-slate-100 animate-pulse rounded mb-2" />
                    <div className="h-6 w-16 bg-slate-100 animate-pulse rounded" />
                </div>
                <div className="pl-4">
                    <div className="h-3 w-28 bg-slate-100 animate-pulse rounded mb-2" />
                    <div className="h-6 w-28 bg-slate-100 animate-pulse rounded" />
                </div>
            </div>
        </FormSection>
    );
}

InventoryValueImpact.skeleton = InventoryValueImpactSkeleton;