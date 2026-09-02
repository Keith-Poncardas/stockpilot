import { Package, Info } from 'lucide-react';
import { Controller, useWatch, type Control } from 'react-hook-form';
import { QuantityInputFields } from '@/components';
import { FormSection } from '@/components/ui/form-section';
import { Checkbox } from '@/components/ui/checkbox';
import type { ProductFormValues } from '../../../validation';

interface InventorySetupSectionProps {
    control: Control<ProductFormValues>;
}

export function InventorySetupSection({ control }: InventorySetupSectionProps) {
    const trackInventory = useWatch({
        control,
        name: 'trackInventory',
    });

    const productType = useWatch({
        control,
        name: 'productType',
    });

    const isBundle = productType === 'BUNDLE';

    return (
        <FormSection
            title={isBundle ? 'Bundle Inventory Setup' : 'Inventory Setup'}
            description={
                isBundle
                    ? 'Optionally track finished kit stock in inventory for this combo package'
                    : 'Optionally track stock and set reorder alerts'
            }
            icon={<Package className="w-4.5 h-4.5" strokeWidth={2} />}
            iconWrapperClassName="bg-blue-50 text-blue-600"
        >
            <div className="space-y-4">
                <Controller
                    name="trackInventory"
                    control={control}
                    render={({ field }) => (
                        <label className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 cursor-pointer transition-colors select-none">
                            <Checkbox
                                id="track-inventory-checkbox"
                                checked={!!field.value}
                                onCheckedChange={(checked) => field.onChange(!!checked)}
                                className="mt-0.5"
                            />
                            <div className="flex flex-col">
                                <span className="text-sm font-semibold text-slate-800">
                                    {isBundle
                                        ? 'Track and record stock for this bundled set in inventory'
                                        : 'Track and record initial stock in inventory'}
                                </span>
                                <span className="text-xs text-slate-500 mt-0.5">
                                    {isBundle
                                        ? 'Enable if you keep pre-packaged sets on hand. When sold, inventory can deduct both this kit and/or component items.'
                                        : 'Enable to create an inventory record immediately. If disabled, no inventory record is created at this time.'}
                                </span>
                            </div>
                        </label>
                    )}
                />

                {trackInventory ? (
                    <div className="pt-2 animate-in fade-in-50 duration-200">
                        <QuantityInputFields control={control as any} />
                    </div>
                ) : (
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-blue-50/50 border border-blue-100 text-xs text-blue-700">
                        <Info className="w-4 h-4 shrink-0 text-blue-500" />
                        <span>
                            Inventory tracking is currently <strong>disabled</strong> for this product. You can create an inventory record or add stock anytime via the <strong>Inventory &rarr; Record Inventory</strong> page.
                        </span>
                    </div>
                )}
            </div>
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
