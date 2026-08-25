import { Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { PATHS } from "@/routes";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema, type ForgotPasswordInput } from "../auth.validation";
import { AuthHeading, AuthFooter } from "../components";
import Alert from "@/components/ui/alert";
import { FieldGroup } from "@/components/ui/field";
import { FormField } from "@/components/ui/form-field";
import { ButtonLoading } from "@/components/ui/button";
import { useMutation } from "@apollo/client";
import { FORGOT_PASSWORD } from "../operations";
import { handleGraphQLError } from "@/lib/utils";
import { useState } from "react";

export function ForgotPasswordPage() {
    const navigate = useNavigate();
    const form = useForm<ForgotPasswordInput>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: "",
        },
    });

    const [forgotPassword, { loading }] = useMutation(FORGOT_PASSWORD);
    const [error, setError] = useState<string | null>(null);

    const onSubmit = async (data: ForgotPasswordInput) => {
        setError(null);
        try {
            await forgotPassword({
                variables: {
                    input: {
                        email: data.email
                    }
                }
            });
            sessionStorage.setItem("auth_email_otp", data.email);
            sessionStorage.setItem("auth_mode_otp", "forgot-password");
            navigate(`${PATHS.auth.otp}?email=${data.email}&mode=forgot-password`);
        } catch (err: any) {
            setError(handleGraphQLError(err));
        }
    };

    return (
        <>
            <AuthHeading
                title="Forgot Password"
                description="Enter your email and we'll send you a link to reset your password."
            />

            {error && (
                <Alert variant="error" className="font-bold mb-4">
                    {error}
                </Alert>
            )}

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
                    className="w-full mt-6 bg-amber-400 hover:bg-amber-500 text-black font-semibold rounded-md py-2.5 transition-colors"
                    loading={loading || form.formState.isSubmitting}
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