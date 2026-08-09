import z from "zod";
import {
    paginatedCustomersSchema,
    createCustomerSchema,
    searchCustomersInfiniteSchema
} from "./customer.validation";

/**
 * Type representing the input for paginated customer requests.
 * Inferred from the paginatedCustomersSchema.
 */
export type PaginatedCustomersInput = z.infer<
    typeof paginatedCustomersSchema
>;

/**
 * Type representing the input for creating a new customer.
 * Inferred from the createCustomerSchema.
 */
export type CreateCustomerInput = z.infer<
    typeof createCustomerSchema
>;

/**
 * Type representing the input for infinite scroll customer searches.
 * Inferred from the searchCustomersInfiniteSchema.
 */
export type SearchCustomersInfiniteInput = z.infer<
    typeof searchCustomersInfiniteSchema
>;
