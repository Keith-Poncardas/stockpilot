import { emailSchema, firstNameSchema, genericPasswordSchema, lastNameSchema, passwordSchema } from "@/schemas";
import z from "zod";

/** LOGIN SCHEMA */
export const loginSchema = z.object({
    email: emailSchema,
    password: genericPasswordSchema
});

/** SIGN UP SCHEMA */
export const signUpSchema = z.object({
    firstName: firstNameSchema,
    lastName: lastNameSchema,
    email: emailSchema,
    password: genericPasswordSchema
});

/** CHANGE PASSWORD SCHEMA */
export const changePasswordSchema = z.object({
    email: emailSchema,
    newPassword: passwordSchema,
    confirmPassword: z
        .string({ message: "Please confirm your password" })
        .trim()
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
});

/** VERIFY OTP REGISTRATION SCHEMA */
export const verifyOtpRegistrationSchema = z.object({
    email: emailSchema,
    otp: z.string().trim().length(6, "OTP must be exactly 6 characters")
});

/** RESEND OTP SCHEMA */
export const resendOtpSchema = z.object({
    email: emailSchema
});

/** FORGOT PASSWORD SCHEMA */
export const forgotPasswordSchema = z.object({
    email: emailSchema
});

/** VERIFY FORGOT PASSWORD OTP SCHEMA */
export const verifyForgotPasswordOtpSchema = z.object({
    email: emailSchema,
    otp: z.string().trim().length(6, "OTP must be exactly 6 characters")
});

/** INFER TYPES  */
export type LoginInput = z.infer<typeof loginSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type VerifyOtpRegistrationInput = z.infer<typeof verifyOtpRegistrationSchema>;
export type ResendOtpInput = z.infer<typeof resendOtpSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type VerifyForgotPasswordOtpInput = z.infer<typeof verifyForgotPasswordOtpSchema>;