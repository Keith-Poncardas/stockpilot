import {
    BasicDetailsSection,
    ProductImageSection,
    PricingSection,
    InventorySetupSection,
    BundledItemsSection,
    PricingTiersSection,
} from './sections';
import type { ProductFormProps } from './types';

export function ProductForm({
    id = 'product-form',
    control,
    setValue,
    onSubmit,
    isEditMode = false,
    showInventorySetup = true,
    currentProductId,
    initialBundleItems,
    initialPricingTiers,
    stagedFile = null,
    onFileSelect = () => {},
    existingImageUrl,
    onRemoveExisting,
    isRemovedExisting = false,
}: ProductFormProps) {
    return (
        <form id={id} onSubmit={onSubmit} className="flex flex-col gap-6">
            <BasicDetailsSection control={control} isEditMode={isEditMode} />
            <ProductImageSection
                stagedFile={stagedFile}
                onFileSelect={onFileSelect}
                existingImageUrl={existingImageUrl}
                onRemoveExisting={onRemoveExisting}
                isRemovedExisting={isRemovedExisting}
            />
            <PricingSection control={control} />
            <PricingTiersSection
                control={control}
                currentProductId={currentProductId}
                initialPricingTiers={initialPricingTiers}
            />
            <BundledItemsSection
                control={control}
                setValue={setValue}
                currentProductId={currentProductId}
                initialBundleItems={initialBundleItems}
            />
            {showInventorySetup && <InventorySetupSection control={control} />}
        </form>
    );
}

ProductForm.Skeleton = function ProductFormSkeleton({ showInventorySetup = true }: { showInventorySetup?: boolean }) {
    return (
        <div className="flex flex-col gap-6">
            <BasicDetailsSection.Skeleton />
            <ProductImageSection.Skeleton />
            <PricingSection.Skeleton />
            <PricingTiersSection.Skeleton />
            <BundledItemsSection.Skeleton />
            {showInventorySetup && <InventorySetupSection.Skeleton />}
        </div>
    );
};
