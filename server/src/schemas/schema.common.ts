import { OrderDirection, OrderDirectionLower } from "@/enums";
import z from "zod";

/**
 * Reusable search/text field schema.
 * Trims whitespace and caps at 100 characters.
 */
export const searchSchema = z
    .string()
    .trim()
    .max(100, "Search term must not exceed 100 characters")
    .optional();

/**
 * Reusable first name schema.
 * Trims whitespace and caps at 100 characters.
 */
export const firstNameSchema = z
    .string()
    .trim()
    .min(1, "First name is required")
    .max(100, "First name must be at most 100 characters");

/**
 * Reusable last name schema.
 * Trims whitespace and caps at 100 characters.
 */
export const lastNameSchema = z
    .string()
    .trim()
    .min(1, "Last name is required")
    .max(100, "Last name must be at most 100 characters");

/**
 * Reusable date-range pair schema.
 * Apply this via .extend() or use the refine helper below.
 */
export const dateRangeSchema = z.object({
    dateFrom: z.preprocess((val) => (val === "" || val === null || val === undefined ? undefined : val), z.coerce.date().optional()),
    dateTo: z.preprocess((val) => (val === "" || val === null || val === undefined ? undefined : val), z.coerce.date().optional()),
});

/**
 * Refine function for dateFrom <= dateTo validation.
 * Attach to any schema that includes dateFrom / dateTo.
 *
 * @example
 *   mySchema.refine(dateRangeRefine, dateRangeRefineMessage)
 */
export const dateRangeRefine = (data: { dateFrom?: Date; dateTo?: Date }) => {
    if (data.dateFrom !== undefined && data.dateTo !== undefined) {
        return data.dateFrom <= data.dateTo;
    }
    return true;
};

/**
 * Error message configuration for date range validation.
 *
 * This object should be used as the second argument to `.refine()`
 * when validating date ranges to provide a consistent error message
 * when `dateFrom` is after `dateTo`.
 */
export const dateRangeRefineMessage = {
    message: "dateFrom must be before or equal to dateTo",
    path: ["dateFrom"],
};

/**
 * Reusable order-direction schema.
 * @description
 * Contains only 'ASC' and 'DESC' enum values.
 */
export const orderDirectionSchema = z.enum(OrderDirection);
export const orderDirectionLowerSchema = z.enum(OrderDirectionLower);
