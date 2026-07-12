import { Package } from 'lucide-react';
import type { Control } from 'react-hook-form';
import { FormField } from '@/components/ui/form-field';
import { FormSection } from '@/components/ui/form-section';

interface InventorySetupProps {
    control: Control<any>;
}

export function InventorySetup({ control }: InventorySetupProps) {
    return (
        <FormSection
            title="Inventory setup"
            description="Starting stock and when to reorder"
            icon={<Package className="w-4.5 h-4.5" strokeWidth={2} />}
            iconWrapperClassName="bg-blue-50 text-blue-600"
        >
            <div className="flex flex-col md:flex-row gap-5">
                <div className="flex-1">
                    <FormField
                        name="quantityOnHand"
                        control={control}
                        label="Starting quantity"
                        type="number"
                        placeholder="0"
                        min={0}
                        step={1}
                    />
                </div>
                <div className="flex-1">
                    <FormField
                        name="reorderLevel"
                        control={control}
                        label="Reorder level"
                        type="number"
                        placeholder="10"
                        min={0}
                        step={1}
                        description="You'll be alerted when stock drops below this"
                    />
                </div>
                <div className="flex-1">
                    <FormField
                        name="maxStock"
                        control={control}
                        label="Maximum stock"
                        type="number"
                        placeholder="100"
                        min={0}
                        step={1}
                        description="Maximum capacity for this product"
                    />
                </div>
            </div>
        </FormSection>
    )
}

InventorySetup.Skeleton = function InventorySetupSkeleton() {
    return (
        <FormSection
            title="Inventory setup"
            description="Starting stock and when to reorder"
            icon={<Package className="w-4.5 h-4.5" strokeWidth={2} />}
            iconWrapperClassName="bg-blue-50 text-blue-600"
        >
            <div className="flex flex-col md:flex-row gap-5">
                <div className="space-y-2 flex-1">
                    <div className="h-4 w-28 bg-gray-200 animate-pulse rounded" />
                    <div className="h-10 w-full bg-gray-200 animate-pulse rounded-md border border-gray-100" />
                </div>
                <div className="space-y-2 flex-1">
                    <div className="h-4 w-24 bg-gray-200 animate-pulse rounded" />
                    <div className="h-10 w-full bg-gray-200 animate-pulse rounded-md border border-gray-100" />
                </div>
                <div className="space-y-2 flex-1">
                    <div className="h-4 w-24 bg-gray-200 animate-pulse rounded" />
                    <div className="h-10 w-full bg-gray-200 animate-pulse rounded-md border border-gray-100" />
                </div>
            </div>
        </FormSection>
    );
};