import z from "zod";
import {
    changePasswordSchema,
    forgotPasswordSchema,
    loginSchema,
    resendOtpSchema,
    signUpSchema,
    verifyForgotPasswordOtpSchema,
    verifyOtpRegistrationSchema
} from "./auth.validation";

/**
 * Inferred type from `loginSchema`.
 * Represents the data structure required for user login.
 *
 * @typedef {z.infer<typeof loginSchema>} LoginInput
 */
export type LoginInput = z.infer<
    typeof loginSchema
>;
/**
 * Inferred type from `signUpSchema`.
 * Represents the data structure required for registering a new user.
 *
 * @typedef {z.infer<typeof signUpSchema>} SignUpInput
 */
export type SignUpInput = z.infer<
    typeof signUpSchema
>;
/**
 * Inferred type from `changePasswordSchema`.
 * Represents the data structure required for changing a user's password.
 *
 * @typedef {z.infer<typeof changePasswordSchema>} ChangePasswordInput
 */
export type ChangePasswordInput = z.infer<
    typeof changePasswordSchema
>;
/**
 * Inferred type from `verifyOtpRegistrationSchema`.
 * Represents the data structure required for verifying a sign-up OTP.
 *
 * @typedef {z.infer<typeof verifyOtpRegistrationSchema>} VerifyOtpRegistrationInput
 */
export type VerifyOtpRegistrationInput = z.infer<
    typeof verifyOtpRegistrationSchema
>;
/**
 * Inferred type from `resendOtpSchema`.
 * Represents the data structure required for resending an OTP.
 *
 * @typedef {z.infer<typeof resendOtpSchema>} ResendOtpInput
 */
export type ResendOtpInput = z.infer<
    typeof resendOtpSchema
>;
/**
 * Inferred type from `forgotPasswordSchema`.
 * Represents the data structure required for initiating a password reset request.
 *
 * @typedef {z.infer<typeof forgotPasswordSchema>} ForgotPasswordInput
 */
export type ForgotPasswordInput = z.infer<
    typeof forgotPasswordSchema
>;
/**
 * Inferred type from `verifyForgotPasswordOtpSchema`.
 * Represents the data structure required for verifying a password reset OTP.
 *
 * @typedef {z.infer<typeof verifyForgotPasswordOtpSchema>} VerifyForgotPasswordOtpInput
 */
export type VerifyForgotPasswordOtpInput = z.infer<
    typeof verifyForgotPasswordOtpSchema
>;