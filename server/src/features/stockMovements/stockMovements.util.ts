import { Prisma } from "@/generated/client.js";

/**
 * Builds a Prisma query object to search stock movements.
 *
 * Searches across:
 * - reference (e.g. "SALE-20260904-0001", "PO-1049")
 * - notes
 * - linked product name and SKU
 * - author user firstName and lastName
 *
 * @param search - The search string.
 * @returns A Prisma StockMovementWhereInput object, or undefined if no search string is provided.
 */
export const buildStockMovementSearchQuery = (
    search?: string | null
): Prisma.StockMovementWhereInput | undefined => {
    if (!search || search.trim() === "") return undefined;

    return {
        AND: search
            .trim()
            .split(/\s+/)
            .map((word) => ({
                OR: [
                    { reference: { contains: word, mode: "insensitive" } },
                    { notes: { contains: word, mode: "insensitive" } },
                    { product: { name: { contains: word, mode: "insensitive" } } },
                    { product: { sku: { contains: word, mode: "insensitive" } } },
                    { user: { firstName: { contains: word, mode: "insensitive" } } },
                    { user: { lastName: { contains: word, mode: "insensitive" } } },
                ],
            })),
    };
};
