import type { Control, UseFormSetValue } from 'react-hook-form';
import type { CustomerFormValues } from '../../validation';

export interface CustomerFormProps {
    id?: string;
    control: Control<CustomerFormValues>;
    setValue: UseFormSetValue<CustomerFormValues>;
    onSubmit?: (e?: React.BaseSyntheticEvent) => Promise<void> | void;
    className?: string;
}
