import { Controller, useWatch, type Control } from 'react-hook-form';
import { TrendingUp, TrendingDown, SlidersHorizontal, CheckCircle } from 'lucide-react';
import { FormSection } from '@/components/ui/form-section';
import { NumberStepper } from '@/components/ui/number-stepper';
import type { AdjustStockFormValues, AdjustmentType } from '../../../types';

interface AdjustmentTypeOption {
    value: AdjustmentType;
    label: string;
    sublabel: string;
    icon: React.ReactNode;
    active: {
        border: string;
        bg: string;
        iconWrapper: string;
        label: string;
        check: string;
    };
}

const ADJUSTMENT_OPTIONS: AdjustmentTypeOption[] = [
    {
        value: 'increase',
        label: 'Increase',
        sublabel: 'Stock In',
        icon: <TrendingUp className="h-5 w-5" strokeWidth={2} />,
        active: {
            border: 'border-emerald-500',
            bg: 'bg-emerald-50/60',
            iconWrapper: 'bg-emerald-100 text-emerald-600',
            label: 'text-emerald-700',
            check: 'text-emerald-600',
        },
    },
    {
        value: 'decrease',
        label: 'Decrease',
        sublabel: 'Stock Out',
        icon: <TrendingDown className="h-5 w-5" strokeWidth={2} />,
        active: {
            border: 'border-rose-500',
            bg: 'bg-rose-50/60',
            iconWrapper: 'bg-rose-100 text-rose-600',
            label: 'text-rose-700',
            check: 'text-rose-600',
        },
    },
    {
        value: 'set',
        label: 'Set Quantity',
        sublabel: 'Exact Count',
        icon: <SlidersHorizontal className="h-5 w-5" strokeWidth={2} />,
        active: {
            border: 'border-amber-500',
            bg: 'bg-amber-50/60',
            iconWrapper: 'bg-amber-100 text-amber-600',
            label: 'text-amber-700',
            check: 'text-amber-600',
        },
    },
];

const QUANTITY_LABEL: Record<AdjustmentType, string> = {
    increase: 'Quantity to Add',
    decrease: 'Quantity to Remove',
    set: 'New Total Quantity',
};

const QUANTITY_HELPER: Record<AdjustmentType, string> = {
    increase: 'Units to add to current inventory stock',
    decrease: 'Units to deduct from current inventory stock',
    set: 'Exact number to set as updated on-hand quantity',
};

export interface AdjustmentTypeSectionProps {
    control: Control<AdjustStockFormValues>;
}

export function AdjustmentTypeSection({ control }: AdjustmentTypeSectionProps) {
    const adjustmentType = useWatch({ control, name: 'adjustmentType' }) ?? 'increase';

    return (
        <FormSection
            title="Adjustment Type & Units"
            description="Choose the stock operation type and specify the quantity."
            icon={<SlidersHorizontal className="h-4 w-4" strokeWidth={2} />}
            iconWrapperClassName="bg-indigo-50 text-indigo-600"
        >
            <Controller
                name="adjustmentType"
                control={control}
                render={({ field }) => (
                    <div
                        className="grid grid-cols-1 gap-3 sm:grid-cols-3"
                        role="radiogroup"
                        aria-label="Adjustment type"
                    >
                        {ADJUSTMENT_OPTIONS.map((option) => {
                            const isSelected = field.value === option.value;
                            const inputId = `sheet-adjustment-type-${option.value}`;
                            return (
                                <label
                                    key={option.value}
                                    htmlFor={inputId}
                                    className={[
                                        'relative flex min-w-0 cursor-pointer flex-col items-start gap-2 rounded-xl border-2 p-4 text-left transition-all duration-150',
                                        'focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2',
                                        isSelected
                                            ? `${option.active.border} ${option.active.bg}`
                                            : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50',
                                    ].join(' ')}
                                >
                                    <input
                                        type="radio"
                                        id={inputId}
                                        name={field.name}
                                        value={option.value}
                                        checked={isSelected}
                                        onChange={() => field.onChange(option.value)}
                                        onBlur={field.onBlur}
                                        ref={field.ref}
                                        className="sr-only"
                                    />
                                    <span
                                        className={[
                                            'flex h-9 w-9 items-center justify-center rounded-lg transition-colors shrink-0',
                                            isSelected
                                                ? option.active.iconWrapper
                                                : 'bg-slate-100 text-slate-500',
                                        ].join(' ')}
                                    >
                                        {option.icon}
                                    </span>
                                    <span
                                        className={[
                                            'w-full truncate text-sm font-semibold transition-colors',
                                            isSelected ? option.active.label : 'text-slate-700',
                                        ].join(' ')}
                                    >
                                        {option.label}
                                    </span>
                                    <span className="w-full truncate text-xs text-slate-500">
                                        {option.sublabel}
                                    </span>
                                    {isSelected && (
                                        <CheckCircle
                                            className={`absolute right-3 top-3 h-4 w-4 ${option.active.check}`}
                                            strokeWidth={2}
                                        />
                                    )}
                                </label>
                            );
                        })}
                    </div>
                )}
            />

            <div className="mt-6">
                <div className="flex items-baseline justify-between gap-2">
                    <label
                        htmlFor="sheet-quantity-input"
                        className="text-sm font-semibold text-slate-900"
                    >
                        {QUANTITY_LABEL[adjustmentType]}{' '}
                        <span className="text-rose-500">*</span>
                    </label>
                </div>
                <p className="mt-1 text-xs text-slate-500">
                    {QUANTITY_HELPER[adjustmentType]}
                </p>

                <Controller
                    name="quantity"
                    control={control}
                    rules={{
                        required: 'Quantity is required',
                        min: { value: 1, message: 'Enter a quantity greater than 0' },
                    }}
                    render={({ field, fieldState }) => (
                        <div className="mt-2 space-y-1">
                            <NumberStepper
                                id="sheet-quantity-input"
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
        </FormSection>
    );
}
