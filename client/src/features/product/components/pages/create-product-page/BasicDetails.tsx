

import { Box, Barcode } from 'lucide-react';
import type { Control } from 'react-hook-form';
import { FormField } from '@/components/ui/form-field';
import { FormSection } from '@/components/ui/form-section';

interface BasicDetailsProps {
    control: Control<any>;
}

export function BasicDetails({ control }: BasicDetailsProps) {
    return (
        <FormSection
            title="Basic details"
            description="What the product is, and how it's identified"
            icon={<Box className="w-4.5 h-4.5" strokeWidth={2} />}
            iconWrapperClassName="bg-blue-50 text-blue-600"
        >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="sm:col-span-2">
                    <FormField
                        name="name"
                        control={control}
                        label="Product name"
                        placeholder="e.g. Stainless Steel Water Bottle 750ml"
                        required
                    />
                </div>
                <div>
                    <FormField
                        name="sku"
                        control={control}
                        label="SKU"
                        placeholder="SKU-00124"
                        required
                        description="Must be unique across all products"
                        icon={
                            <Barcode className="w-4 h-4 text-slate-300" strokeWidth={2} />
                        }
                    />
                </div>
                <div>
                    <FormField
                        name="status"
                        control={control}
                        label="Status"
                        type="select"
                        options={[
                            { value: "DRAFT", label: "Draft — not yet listed" },
                            { value: "ACTIVE", label: "Active — visible & sellable" },
                            { value: "INACTIVE", label: "Inactive — hidden from sale" },
                            { value: "DISCONTINUED", label: "Discontinued" },
                            { value: "ARCHIVED", label: "Archived" },
                        ]}
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
    )
}
