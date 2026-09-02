import { authResolver, inventoryResolver, productResolver, stockMovementsResolver, userResolver, customerResolver, saleResolver, dashboardResolver } from "@/features";
import { mergeResolvers } from "@graphql-tools/merge";
import { GraphQLUpload } from "graphql-upload-ts";

/**
 * Config Resolvers
 */
export const resolvers = mergeResolvers([
    {
        Upload: GraphQLUpload,
    },
    authResolver,
    userResolver,
    productResolver,
    inventoryResolver,
    stockMovementsResolver,
    customerResolver,
    saleResolver,
    dashboardResolver,
]);