import * as React from "react";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// ─── Size Variants ────────────────────────────────────────────────────────────

export type StepperSize = "sm" | "md" | "lg";

interface SizeConfig {
    buttonSize: "icon-xs" | "icon-sm" | "icon-lg";
    buttonPx: string;
    inputClass: string;
    iconClass: string;
}

const SIZE_CONFIG: Record<StepperSize, SizeConfig> = {
    sm: {
        buttonSize: "icon-xs",
        buttonPx: "px-3",
        inputClass: "py-3 text-sm",
        iconClass: "h-3 w-3",
    },
    md: {
        buttonSize: "icon-sm",
        buttonPx: "px-4",
        inputClass: "py-4 text-base",
        iconClass: "h-3.5 w-3.5",
    },
    lg: {
        buttonSize: "icon-sm",
        buttonPx: "px-6",
        inputClass: "py-5 text-lg",
        iconClass: "h-4 w-4",
    },
};

// ─── Props ────────────────────────────────────────────────────────────────────

export interface NumberStepperProps {
    /** Current value — pass `field.value` from RHF or a local state variable */
    value: number | string | undefined;
    /** Called whenever the value changes (via button click or direct input) */
    onChange: (value: number | "") => void;
    /** Called on input blur — pass `field.onBlur` from RHF */
    onBlur?: React.FocusEventHandler<HTMLInputElement>;
    /** Forwarded ref — pass `field.ref` from RHF */
    inputRef?: React.Ref<HTMLInputElement>;

    id?: string;
    name?: string;

    /** Minimum value allowed (default: 0) */
    min?: number;
    /** Maximum value allowed */
    max?: number;
    /** Step size for increment/decrement buttons (default: 1) */
    step?: number;

    /** Visual size of the stepper (default: "lg") */
    size?: StepperSize;

    disabled?: boolean;
    /** Set to true when the containing field has a validation error (styles the input red) */
    invalid?: boolean;

    /** Extra class names for the outermost wrapper div */
    className?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function NumberStepper({
    value,
    onChange,
    onBlur,
    inputRef,
    id,
    name,
    min = 0,
    max,
    step = 1,
    size = "lg",
    disabled = false,
    invalid = false,
    className,
}: NumberStepperProps) {
    const cfg = SIZE_CONFIG[size];

    // ── Local display state ───────────────────────────────────────────────────
    // Decouples what the <input> shows from the RHF value.
    // This lets the user clear the field and type a new number freely.
    const [display, setDisplay] = React.useState<string>(
        value !== undefined && value !== "" ? String(value) : ""
    );

    // Keep display in sync when the external value changes (e.g. button clicks
    // or parent resets the form), but only if the user isn't mid-edit.
    const externalStr = value !== undefined && value !== "" ? String(value) : "";
    React.useEffect(() => {
        setDisplay(externalStr);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [externalStr]);

    // ── Derived ───────────────────────────────────────────────────────────────
    const currentNum = Number(display) || 0;

    // ── Handlers ─────────────────────────────────────────────────────────────
    const decrement = () => {
        const next = currentNum - step;
        const clamped = max !== undefined ? Math.min(max, Math.max(min, next)) : Math.max(min, next);
        setDisplay(String(clamped));
        onChange(clamped);
    };

    const increment = () => {
        const next = currentNum + step;
        const clamped = max !== undefined ? Math.min(max, next) : next;
        setDisplay(String(clamped));
        onChange(clamped);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value;
        setDisplay(raw);
        // Only propagate a numeric value — empty string is an intermediate state
        if (raw !== "") onChange(Number(raw));
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        // If the field was cleared, fall back to min so the form never holds ""
        if (display === "") {
            setDisplay(String(min));
            onChange(min);
        }
        onBlur?.(e);
    };

    return (
        <div className={cn("flex items-stretch", className)}>
            {/* Decrement */}
            <Button
                type="button"
                variant="outline"
                size={cfg.buttonSize}
                aria-label="Decrease value"
                onClick={decrement}
                disabled={disabled || currentNum <= min}
                className={cn(
                    "h-auto rounded-r-none border-gray-300 border-r-gray-300 text-slate-600",
                    cfg.buttonPx
                )}
            >
                <Minus className={cfg.iconClass} strokeWidth={2} />
            </Button>

            {/* Input */}
            <Input
                ref={inputRef}
                id={id}
                name={name}
                type="number"
                min={min}
                max={max}
                step={step}
                inputMode="numeric"
                value={display}
                onChange={handleInputChange}
                onBlur={handleBlur}
                disabled={disabled}
                aria-invalid={invalid}
                className={cn(
                    "z-10 rounded-none border-x-0 border-y-gray-300 text-center font-semibold tabular-nums",
                    "[appearance:textfield]",
                    "[&::-webkit-inner-spin-button]:appearance-none",
                    "[&::-webkit-outer-spin-button]:appearance-none",
                    cfg.inputClass
                )}
            />

            {/* Increment */}
            <Button
                type="button"
                variant="outline"
                size={cfg.buttonSize}
                aria-label="Increase value"
                onClick={increment}
                disabled={disabled || (max !== undefined && currentNum >= max)}
                className={cn(
                    "h-auto rounded-l-none border-gray-300 border-l-gray-300 text-slate-600",
                    cfg.buttonPx
                )}
            >
                <Plus className={cfg.iconClass} strokeWidth={2} />
            </Button>
        </div>
    );
}
