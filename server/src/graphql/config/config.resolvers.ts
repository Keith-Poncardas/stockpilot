import { authResolver, inventoryResolver, productResolver, stockMovementsResolver, userResolver, customerResolver, saleResolver } from "@/features";
import { mergeResolvers } from "@graphql-tools/merge";

/**
 * Config Resolvers
 */
export const resolvers = mergeResolvers([
    authResolver,
    userResolver,
    productResolver,
    inventoryResolver,
    stockMovementsResolver,
    customerResolver,
    saleResolver,
]);