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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
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
                <div>
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
            </div>
        </FormSection>
    )
}