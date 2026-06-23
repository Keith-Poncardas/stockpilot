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
