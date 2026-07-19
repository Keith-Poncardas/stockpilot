import { Controller, type Control, type FieldValues, type Path } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { InputPassword } from "@/components/ui/input-password";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Label } from "./label";
import { Checkbox } from "./checkbox";

import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";

interface FormFieldProps<TFieldValues extends FieldValues> {
    name: Path<TFieldValues>;
    control: Control<TFieldValues>;
    label: React.ReactNode;
    required?: boolean;
    placeholder?: string;
    type?: "text" | "email" | "password" | "checkBox" | "textarea" | "select" | "number";
    disabled?: boolean;
    isLoading?: boolean;
    icon?: React.ReactNode;
    options?: { label: string; value: string }[];
    description?: React.ReactNode;
    min?: number | string;
    max?: number | string;
    step?: number | string;
}

function FormField<TFieldValues extends FieldValues>({
    name,
    control,
    label,
    required,
    placeholder,
    type = "text",
    disabled,
    isLoading,
    icon,
    options,
    description,
    min,
    max,
    step,
}: FormFieldProps<TFieldValues>) {

    if (type === "checkBox") {
        return (
            <Controller
                name={name}
                control={control}
                render={({ field }) => (
                    <Label htmlFor={name} className="flex items-center gap-2 text-gray-600 cursor-pointer font-normal text-sm">
                        <Checkbox
                            id={name}
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={disabled}
                        />
                        {label}
                    </Label>
                )}
            />
        );
    }

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState }) => {
                return (
                    <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={name} className="text-[13px] font-semibold text-gray-700 m-0">
                            {label}
                            {required && <span className="text-amber-700 ml-0.5">*</span>}
                        </FieldLabel>

                        <div className="relative w-full">
                            {type === "select" ? (
                                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={disabled}>
                                    <SelectTrigger aria-invalid={fieldState.invalid} className="w-full h-9 bg-white border-gray-300 rounded-md">
                                        <SelectValue placeholder={placeholder} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {options?.map((option) => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            ) : type === "textarea" ? (
                                <Textarea
                                    {...field}
                                    id={name}
                                    placeholder={placeholder}
                                    aria-invalid={fieldState.invalid}
                                    disabled={disabled}
                                    className="resize-none"
                                    rows={3}
                                />
                            ) : type === "password" ? (
                                <InputPassword
                                    {...field}
                                    id={name}
                                    placeholder={placeholder}
                                    aria-invalid={fieldState.invalid}
                                    disabled={disabled}
                                    icon={icon}
                                />
                            ) : (
                                <Input
                                    {...field}
                                    id={name}
                                    type={type}
                                    placeholder={placeholder}
                                    aria-invalid={fieldState.invalid}
                                    disabled={disabled}
                                    icon={icon}
                                    min={min}
                                    max={max}
                                    step={step}
                                />
                            )}
                            {isLoading && (
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 flex items-center justify-center pointer-events-none">
                                    <Loader2 className="h-4 w-4 animate-spin opacity-60" />
                                </div>
                            )}
                        </div>

                        {description && !fieldState.invalid && (
                            <p className="text-xs text-slate-400">{description}</p>
                        )}
                        {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} className="text-red-600 text-xs font-normal" />
                        )}
                    </Field>
                );
            }}
        />
    );
}

export { FormField };
