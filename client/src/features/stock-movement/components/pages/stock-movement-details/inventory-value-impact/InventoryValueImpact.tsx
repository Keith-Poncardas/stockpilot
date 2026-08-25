import { DollarSign } from 'lucide-react';
import { FormSection } from '@/components/ui/form-section';
import { cn, formatCurrency } from '@/lib/utils';
import { InventoryValueImpactLayout } from './InventoryValueImpactLayout';
import { InventoryValueImpactSkeleton } from './InventoryValueImpactSkeleton';
import type { InventoryValueImpactProps } from './types';
import { useInventoryValueImpact } from './useInventoryValueImpact';

/**
 * Component displaying the financial impact of a stock movement on inventory value.
 * It renders the cost per unit, quantity involved, and the total value added or removed.
 *
 * @param {import("./types").InventoryValueImpactProps} props - The component properties.
 * @param {import("@/features/stock-movement/types").IStockMovementWithRelations} props.movement - The stock movement object.
 * @returns {JSX.Element} The rendered inventory value impact section.
 */
export function InventoryValueImpact({ movement }: InventoryValueImpactProps) {

    const {
        costPrice,
        quantity,
        totalValue,
        totalLabel,
        totalColor,
        prefix
    } = useInventoryValueImpact(movement);

    return (
        <FormSection
            title="Inventory Value Impact"
            description="How much inventory value was affected by this stock movement."
            icon={<DollarSign className="w-4.5 h-4.5" strokeWidth={2} />}
            iconWrapperClassName="bg-blue-50 text-blue-600"
        >
            <InventoryValueImpactLayout
                costPerUnitContent={
                    <>
                        <p className="text-xs text-slate-400 mb-1">Cost / Unit</p>
                        {costPrice !== null ? (
                            <p className="text-lg font-semibold text-slate-900">
                                {formatCurrency(costPrice)}
                            </p>
                        ) : (
                            <p className="text-sm text-slate-400 italic">Not set</p>
                        )}
                    </>
                }
                quantityContent={
                    <>
                        <p className="text-xs text-slate-400 mb-1">Quantity</p>
                        <p className="text-lg font-semibold text-slate-900">
                            {quantity.toLocaleString()}
                        </p>
                    </>
                }
                totalValueContent={
                    <>
                        <p className="text-xs text-slate-400 mb-1">{totalLabel}</p>
                        {totalValue !== null ? (
                            <p className={cn('text-lg font-semibold', totalColor)}>
                                {prefix}{formatCurrency(totalValue)}
                            </p>
                        ) : (
                            <p className="text-sm text-slate-400 italic">N/A</p>
                        )}
                    </>
                }
            />
        </FormSection>
    );
}

InventoryValueImpact.Skeleton = InventoryValueImpactSkeleton;