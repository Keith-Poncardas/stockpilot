import { Controller, type Control } from 'react-hook-form';
import { BellRing, FileText } from 'lucide-react';
import { FormSection } from '@/components/ui/form-section';
import { NumberStepper } from '@/components/ui/number-stepper';
import { Textarea } from '@/components/ui/textarea';
import type { UpdateReorderLevelFormValues } from '../../../types';

export interface ReorderThresholdsSectionProps {
    control: Control<UpdateReorderLevelFormValues>;
}

export function ReorderThresholdsSection({ control }: ReorderThresholdsSectionProps) {
    return (
        <div className="space-y-5">
            <FormSection
                title="Threshold Configuration"
                description="Set the warning alert point and maximum capacity target for this item."
                icon={<BellRing className="h-4 w-4" strokeWidth={2} />}
                iconWrapperClassName="bg-amber-50 text-amber-600"
            >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Reorder Level Input */}
                    <div>
                        <div className="flex items-baseline justify-between gap-2">
                            <label
                                htmlFor="sheet-reorder-level-input"
                                className="text-sm font-semibold text-slate-900"
                            >
                                Reorder Level <span className="text-rose-500">*</span>
                            </label>
                        </div>
                        <p className="mt-1 text-xs text-slate-500">
                            Triggers a low-stock alert when quantity reaches this level
                        </p>

                        <Controller
                            name="reorderLevel"
                            control={control}
                            rules={{
                                required: 'Reorder level is required',
                                min: { value: 0, message: 'Cannot be negative' },
                            }}
                            render={({ field, fieldState }) => (
                                <div className="mt-2 space-y-1">
                                    <NumberStepper
                                        id="sheet-reorder-level-input"
                                        name={field.name}
                                        value={field.value}
                                        onChange={(val) => field.onChange(val)}
                                        onBlur={field.onBlur}
                                        inputRef={field.ref}
                                        invalid={fieldState.invalid}
                                        min={0}
                                        size="lg"
                                    />
                                    {fieldState.invalid && (
                                        <p className="text-xs font-medium text-rose-600" aria-live="polite">
                                            {fieldState.error?.message}
                                        </p>
                                    )}
                                </div>
                            )}
                        />
                    </div>

                    {/* Max Stock Input */}
                    <div>
                        <div className="flex items-baseline justify-between gap-2">
                            <label
                                htmlFor="sheet-max-stock-input"
                                className="text-sm font-semibold text-slate-900"
                            >
                                Maximum Stock Capacity
                            </label>
                        </div>
                        <p className="mt-1 text-xs text-slate-500">
                            Storage capacity benchmark for overstock tracking
                        </p>

                        <Controller
                            name="maxStock"
                            control={control}
                            render={({ field, fieldState }) => (
                                <div className="mt-2 space-y-1">
                                    <NumberStepper
                                        id="sheet-max-stock-input"
                                        name={field.name}
                                        value={field.value ?? 100}
                                        onChange={(val) => field.onChange(val)}
                                        onBlur={field.onBlur}
                                        inputRef={field.ref}
                                        invalid={fieldState.invalid}
                                        min={0}
                                        size="lg"
                                    />
                                    {fieldState.invalid && (
                                        <p className="text-xs font-medium text-rose-600" aria-live="polite">
                                            {fieldState.error?.message}
                                        </p>
                                    )}
                                </div>
                            )}
                        />
                    </div>
                </div>
            </FormSection>

            <FormSection
                title="Threshold Notes"
                description="Optional audit memo explaining why the thresholds are being adjusted."
                icon={<FileText className="h-4 w-4" strokeWidth={2} />}
                iconWrapperClassName="bg-slate-100 text-slate-600"
            >
                <Controller
                    name="notes"
                    control={control}
                    render={({ field, fieldState }) => (
                        <div className="space-y-1">
                            <Textarea
                                {...field}
                                value={field.value ?? ''}
                                placeholder="e.g. Updated threshold based on monthly sales velocity and supplier lead time..."
                                className="min-h-[80px] resize-none text-sm"
                            />
                            {fieldState.invalid && (
                                <p className="text-xs font-medium text-rose-600">
                                    {fieldState.error?.message}
                                </p>
                            )}
                        </div>
                    )}
                />
            </FormSection>
        </div>
    );
}
