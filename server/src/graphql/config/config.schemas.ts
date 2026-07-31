import { mergeTypeDefs } from "@graphql-tools/merge";
import { authTypeDefs, inventoryTypeDefs, productTypeDefs, stockMovementsTypeDefs, userTypeDefs, customerTypeDefs, saleTypeDefs, dashboardTypeDefs } from "@/features";

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
    dashboardTypeDefs,
]);
