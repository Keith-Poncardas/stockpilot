import { BasicDetailsSection, PricingSection, InventorySetupSection } from './sections';
import type { ProductFormProps } from './types';

export function ProductForm({
    id = 'product-form',
    control,
    onSubmit,
    isEditMode = false,
    showInventorySetup = true,
}: ProductFormProps) {
    return (
        <form id={id} onSubmit={onSubmit} className="flex flex-col gap-6">
            <BasicDetailsSection control={control} isEditMode={isEditMode} />
            <PricingSection control={control} />
            {showInventorySetup && <InventorySetupSection control={control} />}
        </form>
    );
}

ProductForm.Skeleton = function ProductFormSkeleton({ showInventorySetup = true }: { showInventorySetup?: boolean }) {
    return (
        <div className="flex flex-col gap-6">
            <BasicDetailsSection.Skeleton />
            <PricingSection.Skeleton />
            {showInventorySetup && <InventorySetupSection.Skeleton />}
        </div>
    );
};
