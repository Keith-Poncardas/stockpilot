import { useState, type SyntheticEvent } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { PATHS } from "@/routes";
import { ButtonLoading } from "@/components/ui/button";
import { AuthHeading } from "../components";
import Alert from "@/components/ui/alert";
import { handleGraphQLError } from "@/lib/utils";
import { useMutation } from "@apollo/client";
import { VERIFY_OTP_REGISTRATION, RESEND_OTP_SIGNUP, VERIFY_OTP_FORGOT_PASSWORD, RESEND_OTP_FORGOT_PASSWORD } from "../operations";
import { useAuthStore } from "@/store";
import { useOTP } from "@/hooks/useOTP";
import { useSafeQueryParams } from "../hooks/useSafeQueryParams";
import { verifyOtpSchema } from "../auth.validation";

export function OTPPage() {
    const navigate = useNavigate();
    const { login } = useAuthStore();

    // Safely retrieve query params — email is null when no active OTP session exists
    const { email, mode } = useSafeQueryParams("otp");

    const activeMode = mode === "forgot-password" ? "forgot-password" : "signup";

    const verifyMutation = activeMode === 'signup' ? VERIFY_OTP_REGISTRATION : VERIFY_OTP_FORGOT_PASSWORD;
    const resendMutation = activeMode === 'signup' ? RESEND_OTP_SIGNUP : RESEND_OTP_FORGOT_PASSWORD;

    const [verifyOtp, { loading: verifyLoading }] = useMutation(verifyMutation);
    const [resendOtp, { loading: resendLoading }] = useMutation(resendMutation);
    const loading = verifyLoading || resendLoading;

    const [error, setError] = useState<string | null>(null);

    // ── Guard: no active OTP session → redirect before rendering the page ────
    // NOTE: Must be placed AFTER all hook calls to comply with Rules of Hooks.
    const {
        otp,
        activeOTPIndex,
        inputRef,
        timeLeft,
        handleOnChange,
        handleOnKeyDown,
        handleOnPaste,
        setActiveOTPIndex,
        formatTime,
        resetOTP
    } = useOTP({ length: 6, initialTimeLeft: 60 });

    const handleResend = async () => {
        if (timeLeft > 0) return;
        setError(null);

        try {
            await resendOtp({
                variables: {
                    input: { email }
                }
            });
            resetOTP();
        } catch (err: any) {
            setError(handleGraphQLError(err));
        }
    };

    const handleVerify = async (e: SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        const code = otp.join("");

        const validationResult = verifyOtpSchema.safeParse({ otp: code });

        if (!validationResult.success) {
            setError(validationResult.error.issues[0].message);
            return;
        }

        setError(null);

        try {
            const { data } = await verifyOtp({
                variables: {
                    input: {
                        otp: validationResult.data.otp,
                        email
                    }
                }
            });

            if (activeMode === "forgot-password") {
                // Seed the change-password session before navigating.
                // OTP keys are cleared by ChangePasswordPage on mount.
                sessionStorage.setItem("auth_email_change-password", email || "");
                navigate(`${PATHS.auth.changePassword}?email=${email}`, {
                    replace: true,
                    state: {
                        otpVerified: true,
                        otp: validationResult.data.otp
                    }
                });
            } else {
                // Login immediately — PublicRoute will redirect away from /otp.
                // OTP keys are naturally orphaned once the user is authenticated.
                login(data.verifyOtpRegistration.user, data.verifyOtpRegistration.token, false);
            }
        } catch (err: any) {
            setError(handleGraphQLError(err));
        }
    };

    if (!email) {
        return <Navigate to={activeMode === "forgot-password" ? "/forgot-password" : "/signup"} replace />;
    }

    return (
        <>
            <AuthHeading
                title={activeMode === "forgot-password" ? "Reset your password" : "Verify your email"}
                description={email ? `We've sent a 6-digit code to ${email}${activeMode === "forgot-password" ? " to reset your password" : ""}.` : "We've sent a 6-digit code to your email address."}
            />

            {error && (
                <Alert variant="error" className="font-bold mb-4">
                    {error}
                </Alert>
            )}

            <form onSubmit={handleVerify}>
                <div className="flex justify-center items-center gap-2 mb-8 mt-4">
                    {otp.map((_, index) => (
                        <input
                            key={index}
                            ref={(el) => { inputRef.current[index] = el; }}
                            type="text"
                            inputMode="numeric"
                            className={`w-10 h-12 sm:w-11 sm:h-14 text-center text-lg sm:text-xl font-bold rounded-lg border-2 bg-white outline-none transition-all
                                ${activeOTPIndex === index ? "border-amber-400 ring-2 ring-amber-400/20" : "border-gray-200 hover:border-gray-300"}
                                focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 text-gray-900`}
                            value={otp[index]}
                            onChange={(e) => handleOnChange(e, index)}
                            onKeyDown={(e) => handleOnKeyDown(e, index)}
                            onFocus={() => setActiveOTPIndex(index)}
                            onPaste={handleOnPaste}
                            disabled={loading}
                        />
                    ))}
                </div>

                <ButtonLoading
                    type="submit"
                    size="lg"
                    className="w-full bg-amber-400 hover:bg-amber-500 text-black font-semibold rounded-md justify-center py-2.5 transition-colors"
                    loading={loading}
                >
                    Verify Code
                </ButtonLoading>
            </form>

            <div className="mt-8 text-center">
                <p className="text-sm text-gray-500">
                    Didn't receive the code?{" "}
                    {timeLeft > 0 ? (
                        <span className="text-gray-400 font-medium ml-1">
                            Resend in {formatTime(timeLeft)}
                        </span>
                    ) : (
                        <button
                            type="button"
                            onClick={handleResend}
                            className="text-amber-600 font-semibold hover:underline ml-1"
                            disabled={loading}
                        >
                            Resend now
                        </button>
                    )}
                </p>
            </div>
        </>
    );
}
