import { mergeTypeDefs } from "@graphql-tools/merge";
import { authTypeDefs, inventoryTypeDefs, productTypeDefs, stockMovementsTypeDefs, userTypeDefs, customerTypeDefs, saleTypeDefs } from "@/features";

/**
 * Config TypeDefs
 */
export const typeDefs = mergeTypeDefs([
    authTypeDefs,
    userTypeDefs,
    productTypeDefs,
    inventoryTypeDefs,
    stockMovementsTypeDefs,
    customerTypeDefs,
    saleTypeDefs,
]);
