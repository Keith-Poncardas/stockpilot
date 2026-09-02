import { Box, Barcode } from 'lucide-react';
import { Controller, type Control } from 'react-hook-form';
import { FormField } from '@/components/ui/form-field';
import { FormSection } from '@/components/ui/form-section';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { SelectFilter } from '@/components/ui/select-filter';
import type { ProductFormValues } from '../../../validation';

interface BasicDetailsSectionProps {
    control: Control<ProductFormValues>;
    isEditMode?: boolean;
}

export function BasicDetailsSection({ control, isEditMode = false }: BasicDetailsSectionProps) {
    return (
        <FormSection
            title="Basic Details"
            description="What the product is, and how it is identified"
            icon={<Box className="w-4.5 h-4.5" strokeWidth={2} />}
            iconWrapperClassName="bg-blue-50 text-blue-600"
        >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="sm:col-span-2">
                    <FormField
                        name="name"
                        control={control}
                        label="Product Name"
                        placeholder="e.g. SPECIAL BUNDLE | 1 GOS Tablet & 1 GOS Powder 50g"
                        required
                    />
                </div>
                <div>
                    <Controller
                        name="productType"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel className="text-[13px] font-semibold text-gray-700 m-0">
                                    Product Type
                                </FieldLabel>
                                <SelectFilter
                                    value={field.value || 'SIMPLE'}
                                    onChange={field.onChange}
                                    options={[
                                        { value: 'SIMPLE', label: 'Single Product' },
                                        { value: 'BUNDLE', label: 'Product Bundle (Combo / Kit)' },
                                    ]}
                                    defaultValue="SIMPLE"
                                    className="w-full h-9"
                                />
                                {fieldState.invalid && (
                                    <FieldError
                                        errors={[fieldState.error]}
                                        className="text-xs font-medium text-rose-600"
                                    />
                                )}
                            </Field>
                        )}
                    />
                </div>
                <div>
                    <Controller
                        name="status"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel className="text-[13px] font-semibold text-gray-700 m-0">
                                    Status
                                </FieldLabel>
                                <SelectFilter
                                    value={field.value}
                                    onChange={field.onChange}
                                    options={[
                                        { value: 'DRAFT', label: 'Draft — not yet listed' },
                                        { value: 'ACTIVE', label: 'Active — visible & sellable' },
                                        { value: 'INACTIVE', label: 'Inactive — hidden from sale' },
                                    ]}
                                    defaultValue="DRAFT"
                                    className="w-full h-9"
                                />
                                {fieldState.invalid && (
                                    <FieldError
                                        errors={[fieldState.error]}
                                        className="text-xs font-medium text-rose-600"
                                    />
                                )}
                            </Field>
                        )}
                    />
                </div>
                <div className="sm:col-span-2">
                    <FormField
                        name="sku"
                        control={control}
                        disabled={isEditMode}
                        label={
                            isEditMode ? (
                                <>
                                    SKU <span className="text-slate-400 font-normal">(not editable)</span>
                                </>
                            ) : (
                                <>
                                    SKU <span className="text-slate-400 font-normal">(optional)</span>
                                </>
                            )
                        }
                        placeholder={isEditMode ? '' : 'Leave blank to auto-generate'}
                        description={isEditMode ? 'The SKU cannot be changed after creation.' : 'Must be unique across all products'}
                        icon={<Barcode className="w-4 h-4 text-slate-300" strokeWidth={2} />}
                    />
                </div>
                <div className="sm:col-span-2">
                    <FormField
                        name="description"
                        control={control}
                        label={
                            <>
                                Description <span className="text-slate-400 font-normal">(optional)</span>
                            </>
                        }
                        type="textarea"
                        placeholder="Short description shown on receipts and product listings"
                    />
                </div>
            </div>
        </FormSection>
    );
}

BasicDetailsSection.Skeleton = function BasicDetailsSectionSkeleton() {
    return (
        <FormSection
            title="Basic Details"
            description="What the product is, and how it is identified"
            icon={<Box className="w-4.5 h-4.5" strokeWidth={2} />}
            iconWrapperClassName="bg-blue-50 text-blue-600"
        >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="sm:col-span-2 space-y-2">
                    <div className="h-4 w-24 bg-gray-200 animate-pulse rounded" />
                    <div className="h-10 w-full bg-gray-200 animate-pulse rounded-md border border-gray-100" />
                </div>
                <div className="space-y-2">
                    <div className="h-4 w-12 bg-gray-200 animate-pulse rounded" />
                    <div className="h-10 w-full bg-gray-200 animate-pulse rounded-md border border-gray-100" />
                </div>
                <div className="space-y-2">
                    <div className="h-4 w-14 bg-gray-200 animate-pulse rounded" />
                    <div className="h-10 w-full bg-gray-200 animate-pulse rounded-md border border-gray-100" />
                </div>
                <div className="sm:col-span-2 space-y-2">
                    <div className="h-4 w-20 bg-gray-200 animate-pulse rounded" />
                    <div className="h-24 w-full bg-gray-200 animate-pulse rounded-md border border-gray-100" />
                </div>
            </div>
        </FormSection>
    );
};
