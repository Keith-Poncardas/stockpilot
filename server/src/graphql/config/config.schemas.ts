import { mergeTypeDefs } from "@graphql-tools/merge";
import { authTypeDefs, inventoryTypeDefs, productTypeDefs, stockMovementsTypeDefs, userTypeDefs } from "@/features";

/**
 * Config TypeDefs
 */
export const typeDefs = mergeTypeDefs([
    authTypeDefs,
    userTypeDefs,
    productTypeDefs,
    inventoryTypeDefs,
    stockMovementsTypeDefs,
]);
