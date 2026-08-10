import { ProductStatus } from "@prisma/client";
import { throwConflict } from "@/utils";
import { SortOrder } from "@/enums";
import { ProductSalesRanking, ProductWithSaleItems } from "./types";

/**
 * Validates that a product's cost price does not exceed its unit price.
 *
 * Intended for use with Zod's `.refine()` when validating product
 * create and update schemas. Returns `true` if either price is
 * undefined, allowing optional fields to be validated separately.
 */
export function refineProductSchema(data: any) {

    const min = data.product.costPrice;
    const max = data.product.unitPrice;

    if (min !== undefined && max !== undefined) {
        return min <= max;
    }

    return true;
}

/**
 * Ensures that the product is not discontinued.
 *
 * Throws a conflict error if the product's current status is
 * `DISCONTINUED`, preventing further status changes.
 *
 * @param status The current status of the product.
 * @throws {ConflictError} If the product is discontinued.
 */
export function ensureNotDiscontinued(
    status: ProductStatus
) {
    if (status === ProductStatus.DISCONTINUED) {
        throwConflict(
            "Cannot change the status of a discontinued product"
        );
    }
}

/**
 * Calculates, ranks, and formats products based on their sales quantity.
 *
 * @param products The raw products with their sale items.
 * @param sort The sorting order (high or low sales).
 * @returns An array of top ranked products with their sales percentage.
 */
export function calculateRankedProducts(
    products: ProductWithSaleItems[],
    sort: SortOrder
): ProductSalesRanking[] {
    const rankedProducts = products
        .map((product) => {
            const quantitySold = product.saleItems.reduce(
                (total, item) => total + item.quantity,
                0,
            );

            return {
                id: product.id,
                name: product.name,
                quantitySold,
            };
        })
        .filter((product) => product.quantitySold > 0)
        .sort((a, b) =>
            sort === SortOrder.HIGH
                ? b.quantitySold - a.quantitySold
                : a.quantitySold - b.quantitySold,
        )
        .slice(0, 5);

    if (rankedProducts.length === 0) {
        return [];
    }

    const maxQuantitySold = Math.max(
        ...rankedProducts.map((product) => product.quantitySold),
    );

    return rankedProducts.map((product, index) => ({
        id: product.id,
        name: product.name,
        quantitySold: product.quantitySold,
        percentage:
            maxQuantitySold > 0
                ? Math.round((product.quantitySold / maxQuantitySold) * 100)
                : 0,
        rank: index + 1,
    }));
}