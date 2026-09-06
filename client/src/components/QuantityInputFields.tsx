import { Controller, type FieldValues, type Path } from 'react-hook-form';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { NumberStepper } from '@/components/ui/number-stepper';
import type { StepperSize } from '@/components/ui/number-stepper';

export interface QuantityFieldConfig<T extends FieldValues> {
    name: Path<T>;
    label: string;
    description?: string;
    min?: number;
    max?: number;
}

export interface QuantityInputFieldsProps<T extends FieldValues> {
    control: any;
    /**
     * Optional custom fields configuration. If provided, renders these specific stepper fields.
     */
    fields?: QuantityFieldConfig<T>[];
    /**
     * Override default field names for standard inventory/stock setup
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
    /**
     * Minimum allowed quantity for the quantity field (default: 0)
     */
    minQuantity?: number;
    /**
     * Whether to show reorderLevel and maxStock fields when using defaults (defaults to true)
     */
    showInventoryBounds?: boolean;
    /** Visual size of all stepper inputs (default: "md") */
    size?: StepperSize;
    className?: string;
}

export function QuantityInputFields<T extends FieldValues>({
    control,
    fields: customFields,
    names,
    quantityLabel = "Starting quantity",
    minQuantity = 0,
    showInventoryBounds = true,
    size = "md",
    className = "flex flex-col md:flex-row gap-5",
}: QuantityInputFieldsProps<T>) {
    const qtyName = names?.quantityOnHand || ("quantityOnHand" as Path<T>);
    const reorderName = names?.reorderLevel || ("reorderLevel" as Path<T>);
    const maxName = names?.maxStock || ("maxStock" as Path<T>);

    const defaultFields: QuantityFieldConfig<T>[] = [
        { name: qtyName, label: quantityLabel, min: minQuantity },
        ...(showInventoryBounds
            ? [
                {
                    name: reorderName,
                    label: "Reorder level",
                    description: "You'll be alerted when stock drops below this",
                    min: 0,
                },
                {
                    name: maxName,
                    label: "Maximum stock",
                    description: "Maximum capacity for this product",
                    min: 0,
                },
            ]
            : []),
    ];

    const fieldsToRender = customFields ?? defaultFields;

    return (
        <div className={className}>
            {fieldsToRender.map(({ name, label, description, min = 0, max }) => (
                <div key={String(name)} className="flex-1 min-w-0">
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
                                    onChange={(val) => field.onChange(val === "" ? min : val)}
                                    onBlur={field.onBlur}
                                    inputRef={field.ref}
                                    invalid={fieldState.invalid}
                                    size={size}
                                    min={min}
                                    max={max}
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

/**
 * Backwards compatibility alias
 */
export const InventoryQuantityFields = QuantityInputFields;
