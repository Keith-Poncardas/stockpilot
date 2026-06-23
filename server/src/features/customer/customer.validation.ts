import z from "zod";
import { customerId, productIdSchema } from "@/schemas";

/** Get Customer Schema */
export const getCustomerSchema = z.object({
    id: customerId
});

/** Get Customer Purchase History Schema */
export const customerPurchaseHistorySchema = z.object({
    customerId: customerId,
});

/** TYPE ALIASES */
export type GetCustomerInput = z.infer<typeof getCustomerSchema>;
export type CustomerPurchaseHistoryInput = z.infer<typeof customerPurchaseHistorySchema>;