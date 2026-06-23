import * as React from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

function InputPassword({ className, disabled, ...props }: React.ComponentProps<"input">) {
    const [showPassword, setShowPassword] = React.useState(false);

    return (
        <div className="relative">
            <Input
                type={showPassword ? "text" : "password"}
                data-slot="input-password"
                className={cn("pr-10", className)}
                {...props}
                disabled={disabled}
            />
            <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                disabled={disabled}
            >
                {!showPassword ? (
                    <EyeOffIcon size={16} />
                ) : (
                    <EyeIcon size={16} />
                )}
            </button>
        </div>
    );
}

export { InputPassword };
