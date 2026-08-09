import z from "zod";
import {
    dateRangeRefine,
    dateRangeRefineMessage,
    dateRangeSchema,
    firstNameSchema,
    lastNameSchema,
    orderDirectionLowerSchema,
    paginationSchema,
    searchSchema,
    emailSchema,
    infiniteSchema
} from "@/schemas";
import { OrderDirectionLower } from "@/enums";
import { psgcAddressRefine } from "@/utils";
import { CustomerOrderBy } from "./constants";


/**
 * Schema for sorting customer records.
 * Ensures the order by field is a valid column from CustomerOrderBy.
 */
const customerOrderBySchema = z.enum(CustomerOrderBy);

/**
 * Schema for filtering customer records.
 * Includes optional date ranges, search query, ordering, and direction.
 */
const filterCustomersSchema = dateRangeSchema.extend({
    search: searchSchema,
    orderBy: customerOrderBySchema.default(CustomerOrderBy.CREATED_AT),
    orderDirection: orderDirectionLowerSchema.default(OrderDirectionLower.DESC),
}).refine(dateRangeRefine, dateRangeRefineMessage);

/**
 * Schema for paginated customer requests.
 * Combines pagination settings (page, limit) with customer filters.
 */
export const paginatedCustomersSchema = paginationSchema.extend({
    filter: filterCustomersSchema,
});

/**
 * Schema for infinite scroll searches of customers.
 * Combines cursor-based infinite pagination with search text.
 */
export const searchCustomersInfiniteSchema = infiniteSchema.extend({
    search: searchSchema,
});

/**
 * Schema for creating a new customer.
 * Validates personal information, contact details, and requires a valid PSGC address for the Philippines.
 */
export const createCustomerSchema = z
    .object({
        firstName: firstNameSchema,
        lastName: lastNameSchema,
        phone: z
            .string()
            .trim()
            .max(20, "Phone number must not exceed 20 characters")
            .optional(),
        email: emailSchema.optional(),
        addressLine1: z
            .string()
            .trim()
            .max(255)
            .optional(),
        addressLine2: z
            .string()
            .trim()
            .max(255)
            .optional(),
        provinceCode: z
            .string()
            .trim()
            .length(4, "Province code must be exactly 4 characters"),
        cityCode: z
            .string()
            .trim()
            .length(6, "City/municipality code must be exactly 6 characters"),
        postalCode: z.string().trim().max(10).optional(),
        country: z.literal("Philippines").default("Philippines"),
    })
    .superRefine(psgcAddressRefine);