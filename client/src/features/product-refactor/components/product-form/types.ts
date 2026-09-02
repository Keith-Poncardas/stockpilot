import type { Control, UseFormSetValue } from 'react-hook-form';
import type { ProductFormValues } from '../../validation';
import type { IProductBundleItem, IProductPricingTier } from '../../types';

export interface ProductFormProps {
    id?: string;
    control: Control<ProductFormValues>;
    setValue?: UseFormSetValue<ProductFormValues>;
    onSubmit?: (e?: React.BaseSyntheticEvent) => Promise<void>;
    isEditMode?: boolean;
    showInventorySetup?: boolean;
    currentProductId?: string;
    initialBundleItems?: IProductBundleItem[] | null;
    initialPricingTiers?: IProductPricingTier[] | null;
    stagedFile?: File | null;
    onFileSelect?: (file: File | null) => void;
    existingImageUrl?: string | null;
    onRemoveExisting?: () => void;
    isRemovedExisting?: boolean;
}

