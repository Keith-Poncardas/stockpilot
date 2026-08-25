import { FormSection } from '@/components/ui/form-section';
import { DollarSign } from 'lucide-react';
import { InventoryValueImpactLayout } from './InventoryValueImpactLayout';

/**
 * Skeleton loader component for the inventory value impact section.
 * Renders a placeholder UI that matches the structure of the InventoryValueImpact component
 * while the actual movement data is being fetched.
 *
 * @returns {JSX.Element} The rendered skeleton component.
 */
export function InventoryValueImpactSkeleton() {
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
                        <div className="h-3 w-16 bg-slate-100 animate-pulse rounded mb-2" />
                        <div className="h-6 w-24 bg-slate-100 animate-pulse rounded" />
                    </>
                }
                quantityContent={
                    <>
                        <div className="h-3 w-14 bg-slate-100 animate-pulse rounded mb-2" />
                        <div className="h-6 w-16 bg-slate-100 animate-pulse rounded" />
                    </>
                }
                totalValueContent={
                    <>
                        <div className="h-3 w-28 bg-slate-100 animate-pulse rounded mb-2" />
                        <div className="h-6 w-28 bg-slate-100 animate-pulse rounded" />
                    </>
                }
            />
        </FormSection>
    );
}
