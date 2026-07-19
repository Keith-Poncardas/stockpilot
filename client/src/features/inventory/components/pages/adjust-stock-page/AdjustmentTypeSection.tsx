import { Controller, useWatch, type Control } from "react-hook-form";
import { TrendingUp, TrendingDown, SlidersHorizontal, CheckCircle, Minus, Plus } from "lucide-react";
import { FormSection } from "@/components/ui/form-section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { AdjustStockFormValues } from "./types";


// ─── Adjustment type meta ───────────────────────────────────────────────────

type AdjustmentType = AdjustStockFormValues["adjustmentType"];

interface AdjustmentTypeOption {
    value: AdjustmentType;
    label: string;
    sublabel: string;
    icon: React.ReactNode;
    /** Colours applied when the card is selected */
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
        value: "increase",
        label: "Increase",
        sublabel: "Stock In",
        icon: <TrendingUp className="h-5 w-5" strokeWidth={2} />,
        active: {
            border: "border-emerald-500",
            bg: "bg-emerald-50/60",
            iconWrapper: "bg-emerald-100 text-emerald-600",
            label: "text-emerald-700",
            check: "text-emerald-600",
        },
    },
    {
        value: "decrease",
        label: "Decrease",
        sublabel: "Stock Out",
        icon: <TrendingDown className="h-5 w-5" strokeWidth={2} />,
        active: {
            border: "border-rose-500",
            bg: "bg-rose-50/60",
            iconWrapper: "bg-rose-100 text-rose-600",
            label: "text-rose-700",
            check: "text-rose-600",
        },
    },
    {
        value: "set",
        label: "Set Quantity",
        sublabel: "Manual Adjustment",
        icon: <SlidersHorizontal className="h-5 w-5" strokeWidth={2} />,
        active: {
            border: "border-amber-500",
            bg: "bg-amber-50/60",
            iconWrapper: "bg-amber-100 text-amber-600",
            label: "text-amber-700",
            check: "text-amber-600",
        },
    },
];

// ─── Quantity label map ──────────────────────────────────────────────────────

const QUANTITY_LABEL: Record<AdjustmentType, string> = {
    increase: "Quantity to Add",
    decrease: "Quantity to Remove",
    set: "New Stock Quantity",
};

const QUANTITY_HELPER: Record<AdjustmentType, string> = {
    increase: "Units to add to current stock",
    decrease: "Units to remove from current stock",
    set: "Exact quantity to set as current stock",
};

// ─── Props ───────────────────────────────────────────────────────────────────

export interface AdjustmentTypeSectionProps {
    control: Control<AdjustStockFormValues>;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function AdjustmentTypeSection({ control }: AdjustmentTypeSectionProps) {
    // Reactively read adjustmentType so labels update as the user switches cards
    const adjustmentType = useWatch({ control, name: "adjustmentType" }) ?? "increase";

    return (
        <FormSection
            title="Adjustment Type"
            description="Choose how this adjustment affects stock on hand."
            icon={<SlidersHorizontal className="h-4 w-4" strokeWidth={2} />}
            iconWrapperClassName="bg-indigo-50 text-indigo-600"
        >
            {/* Choice cards – radio group */}
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
                            const inputId = `adjustment-type-${option.value}`;
                            return (
                                <label
                                    key={option.value}
                                    htmlFor={inputId}
                                    className={[
                                        "relative flex cursor-pointer flex-col items-start gap-2 rounded-xl border-2 p-4 text-left transition-all duration-150",
                                        "focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2",
                                        isSelected
                                            ? `${option.active.border} ${option.active.bg}`
                                            : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50",
                                    ].join(" ")}
                                >
                                    {/* Visually hidden native radio */}
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

                                    {/* Icon */}
                                    <span
                                        className={[
                                            "flex h-9 w-9 items-center justify-center rounded-lg transition-colors",
                                            isSelected
                                                ? option.active.iconWrapper
                                                : "bg-slate-100 text-slate-500",
                                        ].join(" ")}
                                    >
                                        {option.icon}
                                    </span>

                                    {/* Label */}
                                    <span
                                        className={[
                                            "text-sm font-semibold transition-colors",
                                            isSelected ? option.active.label : "text-slate-700",
                                        ].join(" ")}
                                    >
                                        {option.label}
                                    </span>

                                    {/* Sub-label */}
                                    <span className="text-xs text-slate-500">{option.sublabel}</span>

                                    {/* Check indicator */}
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

            {/* Quantity stepper */}
            <div className="mt-6">
                {/* Label + description via FormField-style layout — but stepper needs custom controls */}
                <div className="flex items-baseline justify-between gap-2">
                    <label
                        htmlFor="quantity-input"
                        className="text-sm font-semibold text-slate-900"
                    >
                        {QUANTITY_LABEL[adjustmentType]}{" "}
                        <span className="text-rose-500">*</span>
                    </label>
                </div>
                <p className="mt-1 text-xs text-slate-500">
                    {QUANTITY_HELPER[adjustmentType]}
                </p>

                {/* Stepper row */}
                <Controller
                    name="quantity"
                    control={control}
                    rules={{
                        required: "Quantity is required",
                        min: { value: 1, message: "Enter a quantity greater than 0" },
                    }}
                    render={({ field, fieldState }) => {
                        const decrement = () => field.onChange(Math.max(0, (Number(field.value) || 0) - 1));
                        const increment = () => field.onChange((Number(field.value) || 0) + 1);

                        return (
                            <div className="mt-2 space-y-1">
                                <div className="flex items-stretch">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="icon-sm"
                                        aria-label="Decrease quantity"
                                        onClick={decrement}
                                        className="h-auto rounded-r-none border-r-0 border-slate-300 px-6 text-slate-600"
                                    >
                                        <Minus className="h-4 w-4" strokeWidth={2} />
                                    </Button>

                                    <Input
                                        {...field}
                                        id="quantity-input"
                                        type="number"
                                        min={0}
                                        inputMode="numeric"
                                        aria-invalid={fieldState.invalid}
                                        value={field.value ?? ""}
                                        onChange={(e) => {
                                            const raw = e.target.value;
                                            field.onChange(raw === "" ? "" : Number(raw));
                                        }}
                                        className="z-10 rounded-none border-x-0 py-5 text-center text-lg font-semibold tabular-nums [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                                    />

                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="icon-sm"
                                        aria-label="Increase quantity"
                                        onClick={increment}
                                        className="h-auto rounded-l-none border-l-0 border-slate-300 px-6 text-slate-600"
                                    >
                                        <Plus className="h-4 w-4" strokeWidth={2} />
                                    </Button>
                                </div>

                                {fieldState.invalid && (
                                    <p className="text-xs font-medium text-rose-600" aria-live="polite">
                                        {fieldState.error?.message}
                                    </p>
                                )}
                            </div>
                        );
                    }}
                />
            </div>
        </FormSection>
    );
}
