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
    oldPassword: genericPasswordSchema,
    newPassword: passwordSchema,
    confirmPassword: z
        .string({ message: "Please confirm your password" })
        .trim()
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
});

/** VERIFY OTP SCHEMA */
export const verifyOtpSchema = z.object({
    email: emailSchema,
    otp: z.string().trim().length(6, "OTP must be exactly 6 characters")
});

/** RESEND OTP SCHEMA */
export const resendOtpSchema = z.object({
    email: emailSchema
});

/** INFER TYPES  */
export type LoginInput = z.infer<typeof loginSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>;
export type ResendOtpInput = z.infer<typeof resendOtpSchema>;