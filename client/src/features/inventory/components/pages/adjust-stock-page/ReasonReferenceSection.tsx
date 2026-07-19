import { Controller, type Control } from "react-hook-form";
import { FileText, Hash } from "lucide-react";
import { FormSection } from "@/components/ui/form-section";
import { FormField } from "@/components/ui/form-field";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { DatePicker } from "@/components/ui/date-picker";
import type { AdjustStockFormValues } from "./types";
import { SelectFilter } from "@/components/ui/select-filter";

interface ReasonOption {
    value: NonNullable<AdjustStockFormValues["reason"]>;
    label: string;
}

const REASON_OPTIONS: ReasonOption[] = [
    { value: "damaged", label: "Damaged / Defective" },
    { value: "expired", label: "Expired" },
    { value: "lost", label: "Lost / Theft" },
    { value: "recount", label: "Stock Recount / Audit" },
    { value: "received", label: "Received Shipment" },
    { value: "customer_return", label: "Customer Return" },
    { value: "supplier_return", label: "Return to Supplier" },
    { value: "other", label: "Other" },
];

export interface ReasonReferenceSectionProps {
    control: Control<AdjustStockFormValues>;
}

export function ReasonReferenceSection({ control }: ReasonReferenceSectionProps) {
    return (
        <FormSection
            title="Reason &amp; Reference"
            description="Help teammates understand why this adjustment was made."
            icon={<FileText className="h-4 w-4" strokeWidth={2} />}
            iconWrapperClassName="bg-violet-50 text-violet-600"
        >
            {/* ── Reason for adjustment (required) ─────────────────────────── */}
            <Controller
                name="reason"
                control={control}
                rules={{ required: "Select a reason" }}
                defaultValue="damaged"
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                        {/* Label row: left label + inline error */}
                        <div className="flex items-baseline justify-between gap-2">
                            <FieldLabel
                                htmlFor="reason-select"
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
                            className="w-full h-8 text-xs lg:h-9 lg:text-sm border-slate-200"
                        />

                        {!fieldState.invalid && (
                            <p className="mt-1.5 text-xs text-slate-400">
                                Saved with this adjustment for the audit log.
                            </p>
                        )}
                    </Field>
                )}
            />

            {/* ── Reference number + Date & time ───────────────────────────── */}
            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Reference number — optional, uses shared FormField */}
                <FormField
                    name="reference"
                    control={control}
                    label={
                        <>
                            Reference number{" "}
                            <span className="font-normal text-slate-400">(optional)</span>
                        </>
                    }
                    type="text"
                    placeholder="e.g. PO-10432"
                    icon={<Hash className="h-4 w-4" />}
                />

                {/* Date — uses project's existing DatePicker */}
                <Controller
                    name="adjustmentDate"
                    control={control}
                    render={({ field }) => (
                        <Field>
                            <FieldLabel
                                htmlFor="adjustment-date"
                                className="text-[13px] font-semibold text-gray-700"
                            >
                                Date
                            </FieldLabel>
                            <DatePicker
                                value={field.value}
                                onChange={field.onChange}
                                placeholder="Pick a date"
                                className="h-9"
                            />
                        </Field>
                    )}
                />
            </div>
        </FormSection>
    );
}
