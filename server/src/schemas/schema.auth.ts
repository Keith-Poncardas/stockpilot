import z from "zod";

/**
 * Zod schema for validating user passwords.
 *
 * This schema enforces the application's password policy by
 * requiring a minimum length and a mix of uppercase letters,
 * lowercase letters, numbers, and special characters.
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
 * Zod schema for validating a password without enforcing
 * password strength requirements.
 *
 * This schema only checks that a password is provided and
 * is commonly used for authentication or login requests.
 */
export const genericPasswordSchema = z
    .string({ message: "Password is required" })
    .min(1, "Password cannot be empty");

/**
 * Zod schema for validating email addresses.
 *
 * This schema ensures the email has a valid format, removes
 * leading and trailing whitespace, and converts the value
 * to lowercase for consistent storage and comparison.
 */
export const emailSchema = z
    .email("Invalid email address")
    .trim()
    .toLowerCase();
