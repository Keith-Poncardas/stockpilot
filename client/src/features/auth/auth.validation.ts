import * as z from "zod";

export const loginSchema = z.object({
    email: z.email("Email is required."),
    password: z.string().min(1, "Password is required."),
    rememberMe: z.boolean().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;