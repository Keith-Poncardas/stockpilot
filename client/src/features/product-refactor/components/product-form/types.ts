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
}

