import { Prisma, SaleStatus, ProductStatus } from "@prisma/client";
import { throwNotFound, throwConflict } from "@/utils";
import { ProductWithInventory, SaleItemData } from "./types";
import { CreateSaleItemInput } from "./sale.validation";

export const formatSaleItems = (items: CreateSaleItemInput[]) => {
    return items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
    }));
};

export const calculateTotalAmount = (items: { quantity: number; unitPrice: number }[]) => {
    return items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
};

export const ensureProductExist = (
    product: ProductWithInventory | undefined,
    productId: string
): ProductWithInventory => {
    if (!product) {
        throwNotFound(`Product ${productId} not found`);
    }
    return product;
};

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

export const ensureSufficientStock = (
    product: ProductWithInventory,
    item: SaleItemData,
    status: SaleStatus
): void => {
    if (status === SaleStatus.COMPLETED) {
        const available = product.inventory?.quantityOnHand ?? 0;

        if (item.quantity > available) {
            throwConflict(
                `Insufficient stock for "${product.name}".`
            );
        }
    }
};

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

export const buildSaleSearchQuery = (search?: string | null): Prisma.SaleWhereInput | undefined => {
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

export const ensureSaleIsMutable = (status: SaleStatus): void => {
    if (status === SaleStatus.VOIDED || status === SaleStatus.REFUNDED) {
        throwConflict(`Cannot change status of a ${status.toLowerCase()} sale.`);
    }
};
