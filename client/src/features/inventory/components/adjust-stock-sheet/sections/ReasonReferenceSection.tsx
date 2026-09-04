import { Controller, type Control } from 'react-hook-form';
import { FileText, Hash } from 'lucide-react';
import { FormSection } from '@/components/ui/form-section';
import { FormField } from '@/components/ui/form-field';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { SelectFilter } from '@/components/ui/select-filter';
import { AVAILABLE_REASONS } from '@/constants';
import type { AdjustStockFormValues } from '../../../types';

interface ReasonOption {
    value: NonNullable<AdjustStockFormValues['reason']>;
    label: string;
}

const REASON_OPTIONS: ReasonOption[] = AVAILABLE_REASONS.map((reason) => ({
    value: reason.a as NonNullable<AdjustStockFormValues['reason']>,
    label: reason.b,
}));

export interface ReasonReferenceSectionProps {
    control: Control<AdjustStockFormValues>;
}

export function ReasonReferenceSection({ control }: ReasonReferenceSectionProps) {
    return (
        <FormSection
            title="Reason & Reference"
            description="Document why this adjustment was made for the audit trail."
            icon={<FileText className="h-4 w-4" strokeWidth={2} />}
            iconWrapperClassName="bg-violet-50 text-violet-600"
        >
            <Controller
                name="reason"
                control={control}
                rules={{ required: 'Select a reason' }}
                defaultValue="ADJUSTMENT"
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                        <div className="flex items-baseline justify-between gap-2">
                            <FieldLabel
                                htmlFor="sheet-reason-select"
                                className="text-sm font-medium text-slate-700"
                            >
                                Reason for adjustment
                                <span className="ml-0.5 text-rose-500">*</span>
                            </FieldLabel>

                            {fieldState.invalid && (
                                <FieldError
                                    errors={[fieldState.error]}
                                    className="text-xs font-medium text-rose-600"
                                />
                            )}
                        </div>

                        <SelectFilter
                            value={field.value}
                            onChange={field.onChange}
                            options={REASON_OPTIONS}
                            placeholder="Select a reason"
                            className="w-full h-8 text-xs lg:h-9 lg:text-sm border-slate-200"
                        />

                        {!fieldState.invalid && (
                            <p className="mt-1.5 text-xs text-slate-400">
                                Saved with this adjustment for the inventory audit log.
                            </p>
                        )}
                    </Field>
                )}
            />

            <div className="mt-4">
                <FormField
                    name="reference"
                    control={control}
                    label={
                        <>
                            Reference number <span className="font-normal text-slate-400">(optional)</span>
                        </>
                    }
                    type="text"
                    placeholder="e.g. PO-10432 or COUNT-2026"
                    icon={<Hash className="h-4 w-4" />}
                />
            </div>
        </FormSection>
    );
}
