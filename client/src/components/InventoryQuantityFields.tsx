import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { NumberStepper } from '@/components/ui/number-stepper';
import type { StepperSize } from '@/components/ui/number-stepper';

export interface InventoryQuantityFieldsProps<T extends FieldValues> {
    control: Control<T>;
    /**
     * Override the default field names if they differ in your form schema
     */
    names?: {
        quantityOnHand?: Path<T>;
        reorderLevel?: Path<T>;
        maxStock?: Path<T>;
    };
    /**
     * Optional label for the quantity field. Defaults to "Starting quantity" for creation,
     * but might be "Current quantity" or "Quantity on hand" in other contexts.
     */
    quantityLabel?: string;
    /** Visual size of all stepper inputs (default: "md") */
    size?: StepperSize;
}

export function InventoryQuantityFields<T extends FieldValues>({
    control,
    names,
    quantityLabel = "Starting quantity",
    size = "md",
}: InventoryQuantityFieldsProps<T>) {
    const qtyName = names?.quantityOnHand || ("quantityOnHand" as Path<T>);
    const reorderName = names?.reorderLevel || ("reorderLevel" as Path<T>);
    const maxName = names?.maxStock || ("maxStock" as Path<T>);

    const fields: { name: Path<T>; label: string; description?: string }[] = [
        { name: qtyName, label: quantityLabel },
        {
            name: reorderName,
            label: "Reorder level",
            description: "You'll be alerted when stock drops below this",
        },
        {
            name: maxName,
            label: "Maximum stock",
            description: "Maximum capacity for this product",
        },
    ];

    return (
        <div className="flex flex-col md:flex-row gap-5">
            {fields.map(({ name, label, description }) => (
                <div key={String(name)} className="flex-1">
                    <Controller
                        name={name}
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel
                                    htmlFor={String(name)}
                                    className="text-[13px] font-semibold text-gray-700 m-0"
                                >
                                    {label}
                                </FieldLabel>

                                <NumberStepper
                                    id={String(name)}
                                    name={field.name}
                                    value={field.value}
                                    onChange={(val) => field.onChange(val === "" ? 0 : val)}
                                    onBlur={field.onBlur}
                                    inputRef={field.ref}
                                    invalid={fieldState.invalid}
                                    size={size}
                                    min={0}
                                    className="mt-1"
                                />

                                {description && !fieldState.invalid && (
                                    <p className="text-xs text-slate-400 mt-1">{description}</p>
                                )}
                                {fieldState.invalid && (
                                    <FieldError
                                        errors={[fieldState.error]}
                                        className="text-red-600 text-xs font-normal"
                                    />
                                )}
                            </Field>
                        )}
                    />
                </div>
            ))}
        </div>
    );
}
