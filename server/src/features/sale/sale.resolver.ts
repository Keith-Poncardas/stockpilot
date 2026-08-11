import {
    applyErrorHandling,
    composeResolvers,
    protectResolvers,
    validate
} from "@/graphql/helpers";
import { UUIDInput, uuidSchema } from "@/schemas";
import { saleService } from "./sale.service";
import {
    changeSaleStatusSchema,
    createSaleSchema,
    paginatedSalesSchema
} from "./sale.validation";
import {
    ChangeSaleStatusInput,
    CreateSaleInput,
    PaginatedSalesInput
} from "./types";
import { Sale } from "@prisma/client";
import { customerService } from "../customer";
import { userService } from "../user";
import { GraphQLContext } from "@/types";

export const saleResolver = {

    Query: composeResolvers(
        protectResolvers,
        applyErrorHandling
    )({

        /**
         * Retrieves a single sale transaction by its unique ID.
         *
         * @param _ - Unused parent object.
         * @param args - The arguments containing the unique sale ID.
         * @returns The matching sale record.
         */
        getSale: composeResolvers(
            validate(uuidSchema)
        )(async (_: unknown, { saleId }: { saleId: UUIDInput }) => {
            return saleService.getSale({ where: { id: saleId } });
        }),

        /**
         * Retrieves a paginated list of sales based on filter criteria.
         *
         * @param _ - Unused parent object.
         * @param args - The input arguments for pagination and filtering.
         * @returns A paginated list of sales.
         */
        getSales: composeResolvers(
            validate(paginatedSalesSchema)
        )(async (_: unknown, { args }: { args: PaginatedSalesInput }) => {
            return saleService.getSales(args);
        }),

        /**
         * Calculates key performance indicators and aggregated metrics for sales.
         *
         * @returns Object containing sales metrics.
         */
        getSalesMetrics: async () => {
            return saleService.getSalesMetrics();
        },

    }),

    Sale: applyErrorHandling({

        /**
         * Resolves the line items associated with a given sale.
         *
         * @param sale - The parent sale record.
         * @returns An array of sale items for the sale.
         */
        saleItems: async (sale: Sale) => {
            return saleService.getSaleItems({ saleId: sale.id });
        },

        /**
         * Resolves the customer associated with a given sale.
         * Returns null if no customer is associated with the transaction.
         *
         * @param sale - The parent sale record.
         * @returns The customer record or null.
         */
        customer: async (sale: Sale) => {
            if (!sale.customerId) return null;
            return customerService.getCustomer({ id: sale.customerId });
        },

        /**
         * Resolves the user (author) who created the sale transaction.
         *
         * @param sale - The parent sale record.
         * @returns The user record.
         */
        author: async (sale: Sale) => {
            return userService.getUser({ id: sale.userId });
        },

    }),

    Mutation: composeResolvers(
        protectResolvers,
        applyErrorHandling
    )({

        /**
         * Creates a new sale transaction and its associated line items.
         *
         * @param _ - Unused parent object.
         * @param args - The input containing the details of the sale to create.
         * @param ctx - The GraphQL context containing the authenticated user.
         * @returns The newly created sale record.
         */
        createSale: composeResolvers(
            validate(createSaleSchema)
        )(async (
            _: unknown,
            { input }: { input: CreateSaleInput },
            ctx: GraphQLContext
        ) => {
            return saleService.createSale(ctx.user?.id!, input);
        }),

        /**
         * Updates the lifecycle status of an existing sale.
         *
         * @param _ - Unused parent object.
         * @param args - The input containing the sale ID and the new status.
         * @param ctx - The GraphQL context containing the authenticated user.
         * @returns The updated sale record.
         */
        changeSaleStatus: composeResolvers(
            validate(changeSaleStatusSchema)
        )(async (
            _: unknown,
            { input }: { input: ChangeSaleStatusInput },
            ctx: GraphQLContext
        ) => {
            return saleService.changeSaleStatus(ctx.user?.id!, input);
        }),
    })

};
