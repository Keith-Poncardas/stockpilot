import z from "zod";
import { customerId } from "@/schemas";
import { dateRangeSchema, orderDirectionLowerSchema, paginationSchema, searchSchema } from "@/schemas";
import { OrderDirectionLower } from "@/enums";

/**
 * CUSTOMER ORDER BY ENUM
 */
export enum CustomerOrderBy {
    CREATED_AT = "createdAt",
    FIRST_NAME  = "firstName",
    LAST_NAME   = "lastName",
}

const customerOrderBySchema = z.nativeEnum(CustomerOrderBy);

/**
 * GET CUSTOMERS FILTER SCHEMA
 */
export const filterCustomersSchema = dateRangeSchema.extend({
    search: searchSchema,
    orderBy: customerOrderBySchema.default(CustomerOrderBy.CREATED_AT),
    orderDirection: orderDirectionLowerSchema.default(OrderDirectionLower.DESC),
});

/**
 * PAGINATED CUSTOMERS SCHEMA
 */
export const paginatedCustomersSchema = paginationSchema.extend({
    filter: filterCustomersSchema,
});

/**
 * GET CUSTOMER BY ID SCHEMA
 */
export const getCustomerSchema = z.object({
    id: customerId,
});

/**
 * CREATE CUSTOMER SCHEMA
 */
export const createCustomerSchema = z.object({
    firstName: z
        .string()
        .trim()
        .min(1, "First name is required")
        .max(100, "First name must not exceed 100 characters"),

    lastName: z
        .string()
        .trim()
        .min(1, "Last name is required")
        .max(100, "Last name must not exceed 100 characters"),

    phone: z
        .string()
        .trim()
        .max(20, "Phone number must not exceed 20 characters")
        .optional()
        .transform((val) => (val === "" ? undefined : val)),

    email: z
        .string()
        .trim()
        .toLowerCase()
        .email("Must be a valid email address")
        .optional()
        .or(z.literal("").transform(() => undefined)),

    addressLine1: z.string().trim().max(255).optional().transform((val) => val || undefined),
    addressLine2: z.string().trim().max(255).optional().transform((val) => val || undefined),
    city:         z.string().trim().max(100).optional().transform((val) => val || undefined),
    province:     z.string().trim().max(100).optional().transform((val) => val || undefined),
    postalCode:   z.string().trim().max(10).optional().transform((val) => val || undefined),
    country:      z.string().trim().max(100).default("Philippines"),
});

export const searchCustomersInfiniteSchema = z.object({
    search: z.string().trim().optional().default(""),
    cursor: z.string().trim().optional().nullable(),
    limit:  z.number().int().min(1).max(50).default(20),
});

/**
 * TYPE ALIASES
 */
export type FilterCustomersInput    = z.infer<typeof filterCustomersSchema>;
export type PaginatedCustomersInput = z.infer<typeof paginatedCustomersSchema>;
export type GetCustomerInput        = z.infer<typeof getCustomerSchema>;
export type CreateCustomerInput     = z.infer<typeof createCustomerSchema>;
export type SearchCustomersInfiniteInput = z.infer<typeof searchCustomersInfiniteSchema>;