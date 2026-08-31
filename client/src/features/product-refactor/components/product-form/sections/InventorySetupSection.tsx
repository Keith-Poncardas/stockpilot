import { Package } from 'lucide-react';
import type { Control } from 'react-hook-form';
import { QuantityInputFields } from '@/components';
import { FormSection } from '@/components/ui/form-section';
import type { ProductFormValues } from '../../../validation';

interface InventorySetupSectionProps {
    control: Control<ProductFormValues>;
}

export function InventorySetupSection({ control }: InventorySetupSectionProps) {
    return (
        <FormSection
            title="Inventory Setup"
            description="Starting stock and when to reorder"
            icon={<Package className="w-4.5 h-4.5" strokeWidth={2} />}
            iconWrapperClassName="bg-blue-50 text-blue-600"
        >
            <QuantityInputFields control={control as any} />
        </FormSection>
    );
}

InventorySetupSection.Skeleton = function InventorySetupSectionSkeleton() {
    return (
        <FormSection
            title="Inventory Setup"
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
