import { useState, useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { PATHS } from "@/routes";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, Check } from "lucide-react";
import { useMutation } from "@apollo/client";
import { CHANGE_PASSWORD } from "../operations";
import { changePasswordSchema, type ChangePasswordInput } from "../auth.validation";
import { AuthHeading } from "../components";
import Alert from "@/components/ui/alert";
import { FieldGroup } from "@/components/ui/field";
import { FormField } from "@/components/ui/form-field";
import { ButtonLoading } from "@/components/ui/button";
import { handleGraphQLError } from "@/lib/utils";
import { useSafeQueryParams } from "../hooks/useSafeQueryParams";

export function ChangePasswordPage() {
    const navigate = useNavigate();
    const { email } = useSafeQueryParams("change-password");

    useEffect(() => {
        sessionStorage.removeItem("auth_email_otp");
        sessionStorage.removeItem("auth_mode_otp");
    }, []);

    const [changePassword, { loading }] = useMutation(CHANGE_PASSWORD);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const form = useForm<ChangePasswordInput>({
        resolver: zodResolver(changePasswordSchema),
        defaultValues: {
            email: email ?? "",
            newPassword: "",
            confirmPassword: ""
        },
    });

    if (!email) {
        return <Navigate to="/forgot-password" replace />;
    }

    const onSubmit = async (data: ChangePasswordInput) => {
        setError(null);
        try {
            await changePassword({
                variables: {
                    input: data
                }
            });
            setSuccess(true);
            setTimeout(() => {
                sessionStorage.removeItem("auth_email_change-password");
                navigate(PATHS.auth.login, { replace: true });
            }, 3000);
        } catch (err: any) {
            setError(handleGraphQLError(err));
        }
    };

    if (success) {
        return (
            <div className="text-center py-8 animate-in fade-in zoom-in duration-300">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4 shadow-sm">
                    <Check size={32} strokeWidth={2.5} className="text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Password Updated!</h2>
                <p className="text-gray-500 mb-6">Your password has been changed successfully. Redirecting to login...</p>
            </div>
        );
    }

    return (
        <>
            <AuthHeading
                title="Create new password"
                description="Your new password must be different from previously used passwords."
            />

            {error && (
                <Alert variant="error" className="font-bold mb-4">
                    {error}
                </Alert>
            )}

            <form onSubmit={form.handleSubmit(onSubmit)}>
                <FieldGroup>
                    <FormField
                        name="newPassword"
                        control={form.control}
                        label="New Password"
                        type="password"
                        placeholder="••••••••"
                        required
                        icon={<Lock size={16} strokeWidth={2.5} />}
                    />

                    <FormField
                        name="confirmPassword"
                        control={form.control}
                        label="Confirm New Password"
                        type="password"
                        placeholder="••••••••"
                        required
                        icon={<Lock size={16} strokeWidth={2.5} />}
                    />
                </FieldGroup>

                <ButtonLoading
                    type="submit"
                    size="lg"
                    className="w-full mt-6 bg-amber-400 hover:bg-amber-500 text-black font-semibold rounded-md py-2.5 transition-colors"
                    loading={loading || form.formState.isSubmitting}
                >
                    Reset password
                </ButtonLoading>
            </form>
        </>
    );
}