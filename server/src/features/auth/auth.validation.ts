import { emailSchema, genericPasswordSchema, passwordSchema } from "@/schemas";
import z from "zod";

/** LOGIN SCHEMA */
export const loginSchema = z.object({
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

/** INFER TYPES  */
export type LoginInput = z.infer<typeof loginSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;