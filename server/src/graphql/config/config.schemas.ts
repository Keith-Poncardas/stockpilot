import { mergeTypeDefs } from "@graphql-tools/merge";
import { authTypeDefs, inventoryTypeDefs, productTypeDefs, stockMovementsTypeDefs, userTypeDefs, customerTypeDefs, saleTypeDefs, dashboardTypeDefs } from "@/features";
import { baseTypeDefs } from "./config.base.schema";

/**
 * Config TypeDefs
 */
export const typeDefs = mergeTypeDefs([
    baseTypeDefs,
    authTypeDefs,
    userTypeDefs,
    productTypeDefs,
    inventoryTypeDefs,
    stockMovementsTypeDefs,
    customerTypeDefs,
    saleTypeDefs,
    dashboardTypeDefs,
]);
