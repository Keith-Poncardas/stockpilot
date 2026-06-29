import * as z from "zod";

export const loginSchema = z.object({
    email: z.email("Email is required."),
    password: z.string().min(1, "Password is required."),
    rememberMe: z.boolean().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const signupSchema = z.object({
    firstName: z.string().min(1, "First name is required."),
    lastName: z.string().min(1, "Last name is required."),
    email: z.email("Invalid email address."),
    password: z.string().min(8, "Must be at least 8 characters."),
    confirmPassword: z.string().min(1, "Confirm password is required.")
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

export type SignupInput = z.infer<typeof signupSchema>;

export const verifyOtpSchema = z.object({
    otp: z.string().length(6, "Please enter the 6-digit code."),
});

export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>;

export const forgotPasswordSchema = z.object({
    email: z.email("Please enter a valid email address."),
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;