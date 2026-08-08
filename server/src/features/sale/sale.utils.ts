import { Prisma, SaleStatus, ProductStatus } from "@prisma/client";
import { throwNotFound, throwConflict } from "@/utils";
import { ProductWithInventory, SaleItemData } from "./types";
import { CreateSaleItemInput } from "./types";

/**
 * Formats a list of sale item inputs by extracting the required fields.
 *
 * @param items - The input items to format.
 * @returns An array of formatted sale items.
 */
export const formatSaleItems = (items: CreateSaleItemInput[]) => {
    return items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
    }));
};

/**
 * Calculates the total amount for a list of items based on their quantity and unit price.
 *
 * @param items - The list of items to calculate the total for.
 * @returns The sum of (quantity * unitPrice) for all items.
 */
export const calculateTotalAmount = (
    items: { quantity: number; unitPrice: number }[]
) => {
    return items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
};

/**
 * Ensures a product exists; throws a NotFound error if it does not.
 *
 * @param product - The product object or undefined.
 * @param productId - The ID of the product for error messaging.
 * @returns The valid product object.
 */
export const ensureProductExist = (
    product: ProductWithInventory | undefined,
    productId: string
): ProductWithInventory => {
    if (!product) {
        throwNotFound(`Product ${productId} not found`);
    }
    return product;
};

/**
 * Ensures a product is currently active.
 * Throws a Conflict error if the product is discontinued or archived.
 *
 * @param product - The product to check.
 */
export const ensureProductIsActive = (product: ProductWithInventory): void => {
    if (
        product.status === ProductStatus.DISCONTINUED ||
        product.status === ProductStatus.ARCHIVED
    ) {
        throwConflict(
            `Product "${product.name}" is discontinued or archived`
        );
    }
};

/**
 * Ensures a product has sufficient stock available for the requested quantity.
 * This check is only enforced if the sale status is COMPLETED.
 *
 * @param product - The product whose inventory will be checked.
 * @param item - The item containing the requested quantity.
 * @param status - The target status of the sale.
 */
export const ensureSufficientStock = (
    product: ProductWithInventory,
    item: SaleItemData,
    status: SaleStatus
) => {
    if (status === SaleStatus.COMPLETED) {
        const available = product.inventory?.quantityOnHand ?? 0;

        if (item.quantity > available) {
            throwConflict(
                `Insufficient stock for "${product.name}".`
            );
        }
    }
};

/**
 * Validates a list of sale items by checking existence, active status, and stock availability.
 *
 * @param items - The array of sale items to validate.
 * @param productMap - A map of product IDs to their corresponding product objects.
 * @param status - The target status of the sale.
 */
export const validateSaleItems = (
    items: SaleItemData[],
    productMap: Map<string, ProductWithInventory>,
    status: SaleStatus
) => {
    for (const item of items) {

        const product = ensureProductExist(
            productMap.get(item.productId),
            item.productId
        );

        ensureProductIsActive(product);
        ensureSufficientStock(product, item, status);
    }
};

/**
 * Builds a Prisma query object to search for sales by customer or user name.
 *
 * @param search - The search string.
 * @returns A Prisma `SaleWhereInput` object, or undefined if no search string is provided.
 */
export const buildSaleSearchQuery = (
    search?: string | null
): Prisma.SaleWhereInput | undefined => {

    if (!search) return undefined;

    return {
        OR: search.trim().split(/\s+/).flatMap((word) => [
            { customer: { firstName: { contains: word, mode: "insensitive" } } },
            { customer: { lastName: { contains: word, mode: "insensitive" } } },
            { user: { firstName: { contains: word, mode: "insensitive" } } },
            { user: { lastName: { contains: word, mode: "insensitive" } } },
        ]),
    };
};

/**
 * Ensures a sale's status can still be modified.
 * Throws a Conflict error if the sale is already voided or refunded.
 *
 * @param status - The current status of the sale.
 */
export const ensureSaleIsMutable = (status: SaleStatus) => {

    if (status === SaleStatus.VOIDED || status === SaleStatus.REFUNDED) {

        throwConflict(
            `Cannot change status of a ${status.toLowerCase()} sale.`
        );

    }

};
