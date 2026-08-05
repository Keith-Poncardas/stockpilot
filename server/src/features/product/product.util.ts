import { ProductStatus } from "@prisma/client";
import { throwConflict } from "@/utils";

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