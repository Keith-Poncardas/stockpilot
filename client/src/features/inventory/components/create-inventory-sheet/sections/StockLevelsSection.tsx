import type { Control } from 'react-hook-form';
import { Package } from 'lucide-react';
import { FormSection } from '@/components/ui/form-section';
import { QuantityInputFields } from '@/components';
import type { InventoryRecordFormValues } from '../../../types';

interface StockLevelsSectionProps {
    control: Control<InventoryRecordFormValues>;
}

export function StockLevelsSection({ control }: StockLevelsSectionProps) {
    return (
        <FormSection
            title="Stock Levels & Thresholds"
            description="Set initial stock quantity on hand and reorder threshold targets."
            icon={<Package className="h-4 w-4" strokeWidth={2} />}
            iconWrapperClassName="bg-blue-50 text-blue-600"
            className="relative z-10"
        >
            <div className="mt-2">
                <QuantityInputFields control={control} minQuantity={1} />
            </div>
        </FormSection>
    );
}
