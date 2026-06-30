import { Mail, Lock } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ButtonLoading } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { FormField } from "@/components/ui/form-field";
import { useState } from "react";
import Alert from "@/components/ui/alert";
import { signupSchema, type SignupInput } from "../auth.validation";
import { AuthFooter, AuthHeading } from "../components";
import { useMutation } from "@apollo/client";
import { SIGN_UP } from "../operations";

import { useNavigate } from "react-router-dom";
import { handleGraphQLError } from "@/lib/utils";

export function SignupPage() {
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);
    const [signUp, { loading }] = useMutation(SIGN_UP);

    const form = useForm<SignupInput>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    async function onSubmit(data: SignupInput) {
        setError(null);
        try {
            const { confirmPassword, ...input } = data;
            await signUp({ variables: { input } });
            sessionStorage.setItem("auth_email_otp", data.email);
            sessionStorage.setItem("auth_mode_otp", "signup");
            navigate(`/otp?email=${encodeURIComponent(data.email)}`);
        } catch (err: any) {
            setError(handleGraphQLError(err));
        }
    }

    return (
        <>
            <AuthHeading
                title="Create your account"
                description="Get started with StockPilot today."
            />

            {error && (
                <Alert variant="error" className="font-bold mb-4">
                    {error}
                </Alert>
            )}

            <form onSubmit={form.handleSubmit(onSubmit)}>
                <FieldGroup>
                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            name="firstName"
                            control={form.control}
                            label="First Name"
                            type="text"
                            placeholder="Juan"
                            required
                            disabled={loading}
                        />
                        <FormField
                            name="lastName"
                            control={form.control}
                            label="Last Name"
                            type="text"
                            placeholder="dela Cruz"
                            required
                            disabled={loading}
                        />
                    </div>

                    <FormField
                        name="email"
                        control={form.control}
                        label="Email address"
                        type="email"
                        placeholder="you@company.com"
                        required
                        disabled={loading}
                        icon={<Mail size={16} strokeWidth={2.5} />}
                    />

                    <FormField
                        name="password"
                        control={form.control}
                        label="Password"
                        type="password"
                        placeholder="Min. 8 characters"
                        required
                        disabled={loading}
                        icon={<Lock size={16} strokeWidth={2.5} />}
                    />

                    <FormField
                        name="confirmPassword"
                        control={form.control}
                        label="Confirm Password"
                        type="password"
                        placeholder="Repeat password"
                        required
                        disabled={loading}
                        icon={<Lock size={16} strokeWidth={2.5} />}
                    />

                    <ButtonLoading
                        type="submit"
                        size="lg"
                        className="w-full bg-amber-400 hover:bg-amber-500 text-black font-semibold rounded-md justify-center py-2.5 transition-colors mt-2"
                        loading={loading}
                    >
                        Create Account
                    </ButtonLoading>
                </FieldGroup>
            </form>

            <AuthFooter
                text="Already have an account?"
                linkText="Sign in"
                linkTo="/login"
            />
        </>
    );
}