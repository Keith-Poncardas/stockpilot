import type { Control } from 'react-hook-form';
import type { ProductFormValues } from '../../validation';

export interface ProductFormProps {
    id?: string;
    control: Control<ProductFormValues>;
    onSubmit?: (e?: React.BaseSyntheticEvent) => Promise<void>;
    isEditMode?: boolean;
    showInventorySetup?: boolean;
}
