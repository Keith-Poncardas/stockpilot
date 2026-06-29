import { Mail, Lock } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { ButtonLoading } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { FormField } from "@/components/ui/form-field";
import { useMutation } from "@apollo/client";
import { useAuthStore } from "@/store";
import { useState } from "react";
import Alert from "@/components/ui/alert";
import { loginSchema, type LoginInput } from "../auth.validation";
import { handleGraphQLError } from "@/lib/utils";
import { AuthFooter, AuthHeading } from "../components";
import { LOGIN } from "../operations";

export function LoginPage() {

    const [error, setError] = useState<string | null>(null);
    const { login } = useAuthStore();


    /* form controller */
    const form = useForm<LoginInput>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
            rememberMe: true,
        },
    });

    /* login mutation */
    const [loginMutation, { loading: loadingLogin }] = useMutation(LOGIN, {
        onCompleted: (data) => {
            const rememberMe = form.getValues("rememberMe");
            login(data.login.user, data.login.token, rememberMe);
            // PublicRoute detects the token and redirects automatically
        },
        onError: (err) => {
            setError(handleGraphQLError(err));
        },
    });

    /* form submit handler */
    function onSubmit(data: LoginInput) {
        setError(null);
        loginMutation({
            variables: {
                input: {
                    email: data.email,
                    password: data.password
                },
            },
        });
    }

    return (
        <>
            <AuthHeading
                title="Welcome back!"
                description="Sign in to your account to continue."
            />

            {error && (
                <Alert variant="error" className="font-bold">
                    {error}
                </Alert>
            )}

            {/* Form */}
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <FieldGroup>

                    {/* Email */}
                    <FormField
                        name="email"
                        control={form.control}
                        label="Email address"
                        type="email"
                        placeholder="you@company.com"
                        required
                        disabled={loadingLogin}
                        icon={<Mail size={16} strokeWidth={2.5} />}
                    />

                    {/* Password */}
                    <FormField
                        name="password"
                        control={form.control}
                        label="Password"
                        type="password"
                        placeholder="••••••••"
                        required
                        disabled={loadingLogin}
                        icon={<Lock size={16} strokeWidth={2.5} />}
                    />

                    {/* Remember me / Forgot */}
                    <div className="flex items-center justify-between text-sm">
                        <FormField
                            name="rememberMe"
                            control={form.control}
                            type="checkBox"
                            label="Remember me"
                            disabled={loadingLogin}
                        />
                        <Link
                            to="/forgot-password"
                            className="text-amber-600 font-semibold hover:underline transition-colors"
                        >
                            Forgot password?
                        </Link>
                    </div>

                    {/* Submit */}
                    <ButtonLoading
                        type="submit"
                        size="lg"
                        className="w-full bg-amber-400 hover:bg-amber-500 text-black font-semibold rounded-md justify-center py-2.5 transition-colors"
                        loading={loadingLogin}
                    >
                        Sign In
                    </ButtonLoading>

                </FieldGroup>
            </form>

            <AuthFooter
                text="Don't have an account?"
                linkText="Create one"
                linkTo="/signup"
            />
        </>
    );
}
