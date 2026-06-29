import { Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema, type ForgotPasswordInput } from "../auth.validation";
import { AuthHeading, AuthFooter } from "../components";
import { FieldGroup } from "@/components/ui/field";
import { FormField } from "@/components/ui/form-field";
import { ButtonLoading } from "@/components/ui/button";

export function ForgotPasswordPage() {
    const navigate = useNavigate();
    const form = useForm<ForgotPasswordInput>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: "",
        },
    });

    const onSubmit = (data: ForgotPasswordInput) => {
        console.log("Forgot password data:", data);
        // TODO: Handle forgot password mutation
        navigate(`/otp?email=${data.email}&mode=forgot-password`);
    };

    return (
        <>
            <AuthHeading
                title="Forgot Password"
                description="Enter your email and we'll send you a link to reset your password."
            />

            <form onSubmit={form.handleSubmit(onSubmit)}>
                <FieldGroup>
                    <FormField
                        name="email"
                        control={form.control}
                        label="Email address"
                        type="email"
                        placeholder="you@company.com"
                        required
                        icon={<Mail size={16} strokeWidth={2.5} />}
                    />
                </FieldGroup>

                <ButtonLoading
                    type="submit"
                    size="lg"
                    className="w-full mt-6"
                    loading={form.formState.isSubmitting}
                >
                    Send reset link
                </ButtonLoading>
            </form>

            <AuthFooter
                text="Remember your password?"
                linkText="Back to login"
                linkTo="/login"
            />
        </>
    );
}