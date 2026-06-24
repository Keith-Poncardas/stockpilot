import { Controller, type Control, type FieldValues, type Path } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { InputPassword } from "@/components/ui/input-password";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Label } from "./label";
import { Checkbox } from "./checkbox";

interface FormFieldProps<TFieldValues extends FieldValues> {
    name: Path<TFieldValues>;
    control: Control<TFieldValues>;
    label: string;
    required?: boolean;
    placeholder?: string;
    type?: "text" | "email" | "password" | "checkBox";
    disabled?: boolean;
    icon?: React.ReactNode;
}

function FormField<TFieldValues extends FieldValues>({
    name,
    control,
    label,
    required,
    placeholder,
    type = "text",
    disabled,
    icon,
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
                            {required && <span className="text-red-500 ml-0.5">*</span>}
                        </FieldLabel>

                        {type === "password" ? (
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
                            />
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
