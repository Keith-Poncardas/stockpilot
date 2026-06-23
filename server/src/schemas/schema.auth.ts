import z from "zod";

/**
 * Reusable strong password schema.
 * Enforces minimum security requirements.
 */
export const passwordSchema = z
    .string({ message: "Password is required" })
    .min(8, "Password must be at least 8 characters")
    .max(64, "Password must not exceed 64 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character");

/**
 * Loose password schema — accepts any non-empty string.
 * Used when receiving an existing password (login, old password field).
 */
export const genericPasswordSchema = z
    .string({ message: "Password is required" })
    .min(1, "Password cannot be empty");

/**
 * Reusable email schema.
 * Trims whitespace and normalises to lowercase.
 */
export const emailSchema = z
    .email("Invalid email address")
    .trim()
    .toLowerCase();
