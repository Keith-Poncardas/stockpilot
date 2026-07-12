import { prisma } from "@/lib";
import { productIdSchema, UUIDInput } from "@/schemas";
import { buildSearchQuery, createPaginator, throwConflict, throwNotFound, getCurrentMonthMetrics, getTrendDateRange } from "@/utils";
import { MovementType, Prisma, SaleStatus } from "@prisma/client";
import { ChangeProductStatusInput, changeProductStatusSchema, CreateProductInput, createProductSchema, EditProductInput, editProductSchema, PaginatedProductsInput, paginatedProductsSchema } from "./product.validation";
import { ProductStatus } from "@/enums";
import { calculateGrossMargin, calculateInventoryMetrics, calculateSaleSummary, buildSalesTrend, resolveProductSku } from "./product.util";

export class ProductService {

    /**
     * Get product by id 
     */
    async getProduct(productId: UUIDInput) {

        const id = productIdSchema.parse(productId);

        const [
            productInfo,
            inventoryStatus,
            salesSummary,
            salesTrend
        ] = await Promise.all([
            this.productInfo(id),
            this.inventoryStatus(id),
            this.saleSummary(id),
            this.salesTrend(id)
        ]);

        return {
            productInfo,
            inventoryStatus,
            salesSummary,
            salesTrend,
        };

    }

    /**
     * Get product info by product ID
     */
    async productInfo(productId: UUIDInput) {
        const id = productIdSchema.parse(productId);

        const product = await prisma.product.findUnique({
            where: { id }
        });

        if (!product) throwNotFound('Product not found');

        const grossMargin = calculateGrossMargin(
            product.unitPrice,
            product.costPrice
        );

        const unitPrice = Number(product.unitPrice);
        const costPrice = product.costPrice ? Number(product.costPrice) : null;

        return {
            ...product,
            unitPrice,
            costPrice,
            grossMargin,
        };
    }

    /**
     * Get inventory status by product ID
     */
    async inventoryStatus(productId: UUIDInput) {
        const id = productIdSchema.parse(productId);

        const { startOfMonth, daysElapsed } = getCurrentMonthMetrics();

        const [product, stockAggregation] = await Promise.all([
            prisma.product.findUnique({
                where: { id },
                include: {
                    inventory: true,
                    saleItems: {
                        where: {
                            sale: {
                                status: SaleStatus.COMPLETED,
                                saleDate: { gte: startOfMonth },
                            },
                        },
                        select: { quantity: true },
                    },
                },
            }),
            prisma.stockMovement.aggregate({
                where: { productId: id, type: MovementType.IN },
                _sum: { quantity: true },
                _max: { createdAt: true },
            })
        ]);

        if (!product) throwNotFound('Product not found');

        const productInventory = product.inventory ?? {};

        const inventoryMetrics = calculateInventoryMetrics(
            product.saleItems,
            stockAggregation,
            productInventory,
            daysElapsed
        );

        return {
            ...productInventory,
            ...inventoryMetrics,
        };
    }

    /**
     * Get the sale summary for a product
     */
    async saleSummary(productId: UUIDInput) {
        const id = productIdSchema.parse(productId);

        const { startOfMonth, daysElapsed } = getCurrentMonthMetrics();

        const product = await prisma.product.findUnique({
            where: { id },
            include: {
                inventory: true,
                saleItems: {
                    where: {
                        sale: {
                            status: SaleStatus.COMPLETED,
                            saleDate: { gte: startOfMonth },
                        },
                    },
                    select: { quantity: true, unitPrice: true, saleId: true },
                },
            },
        });

        if (!product) throwNotFound('Product not found');

        const quantityOnHand = Number(product.inventory?.quantityOnHand ?? 0);

        return calculateSaleSummary(
            product.saleItems,
            quantityOnHand,
            daysElapsed
        );
    }

    /**
     * Get the sales trend for a product
     */
    async salesTrend(productId: UUIDInput, days: number = 7) {
        const id = productIdSchema.parse(productId);

        const { endOfToday, trendStart } = getTrendDateRange(days);

        const trendItems = await prisma.saleItem.findMany({
            where: {
                productId: id,
                sale: {
                    status: SaleStatus.COMPLETED,
                    saleDate: { gte: trendStart, lte: endOfToday },
                },
            },
            select: {
                quantity: true,
                sale: { select: { saleDate: true } },
            },
        });

        return buildSalesTrend(trendItems, endOfToday, days);
    }

    /**
     * Get the total count of all products
     */
    async getTotalProductsCount(): Promise<number> {
        return await prisma.product.count();
    }

    /**
     * Get product metrics (Total, Active, Draft)
     */
    async getProductMetrics() {
        const [total, active, draft] = await Promise.all([
            prisma.product.count(),
            prisma.product.count({ where: { status: ProductStatus.ACTIVE } }),
            prisma.product.count({ where: { status: ProductStatus.DRAFT } }),
        ]);
        return { total, active, draft };
    }

    /**
     * Get a paginated list of products with optional filters:
     */
    async getProducts(args: PaginatedProductsInput) {

        const { limit, page, filter } = paginatedProductsSchema.parse(args);

        const { params, buildMeta } = createPaginator({ limit, page });

        const {
            status,
            search,
            minPrice,
            maxPrice,
            dateFrom,
            dateTo,
            orderBy,
            orderDirection
        } = filter;

        const where: Prisma.ProductWhereInput = {

            /** Filtering by status */
            ...(status && { status }),

            /** Filtering by search */
            ...(search && buildSearchQuery(search, ['sku', 'name', 'description'])),

            /** Filtering by price */
            ...((minPrice !== undefined || maxPrice !== undefined) && {
                unitPrice: {
                    ...(minPrice !== undefined && { gte: minPrice }),
                    ...(maxPrice !== undefined && { lte: maxPrice }),
                },
            }),

            /** Filtering by date */
            ...((dateFrom || dateTo) && {
                createdAt: {
                    ...(dateFrom && { gte: dateFrom }),
                    ...(dateTo && { lte: dateTo }),
                },
            }),

        };

        const [products, total] = await Promise.all([

            prisma.product.findMany({
                where,
                include: { inventory: true },
                skip: params.skip,
                take: params.limit,
                orderBy: {
                    [orderBy]: orderDirection
                },
            }),

            prisma.product.count({ where }),

        ]);

        return {
            data: products,
            meta: buildMeta(total),
        };

    }

    /**
     * Creates a new product and, optionally, adds initial stock.
     */
    async createProduct(input: CreateProductInput) {

        const { addToInventory, ...rest } = createProductSchema.parse(input);

        /**
         * Resolve SKU: use the user's input (uppercased) or auto-generate a unique one.
         * Auto-generation retries up to 5 times; a collision is astronomically unlikely.
         */
        const resolvedSku = await resolveProductSku(rest.name, rest.sku);

        const product = await prisma.$transaction(async (tx) => {

            /** Guard: reject if the resolved SKU is already taken */
            const existingProduct = await tx.product.findFirst({
                where: { sku: { equals: resolvedSku, mode: "insensitive" } }
            });

            if (existingProduct) {
                throwConflict('A product with this SKU already exists.');
            }

            /** Creating product */
            const prod = await tx.product.create({
                data: {
                    ...rest,
                    name: rest.name.trim(),
                    sku: resolvedSku,
                }
            });

            /** Creating inventory for product only if a valid starting quantity is provided */
            if (addToInventory && addToInventory.quantity !== undefined && addToInventory.quantity > 0) {

                await tx.inventory.create({
                    data: {
                        productId: prod.id,
                        quantityOnHand: addToInventory.quantity,
                        reorderLevel: addToInventory.reorderLevel,
                        maxStock: addToInventory.maxStock,
                    },
                });

            }

            return prod;

        });

        return product;

    }

    /**
     * Edits an existing product.
     */
    async editProduct(input: EditProductInput) {

        const { productId, addToInventory, ...rest } = editProductSchema.parse(input);

        // Guard: existence check
        const product = await prisma.product.findUnique({ where: { id: productId } });
        if (!product) throwNotFound('Product not found');

        const editedProduct = await prisma.$transaction(async (tx) => {

            /** Editing product */
            const editedProduct = await tx.product.update({
                where: { id: productId },
                data: {
                    ...rest,
                    name: rest.name.trim()
                }
            });

            if (addToInventory) {
                await tx.inventory.upsert({
                    where: { productId },
                    create: {
                        productId,
                        quantityOnHand: addToInventory.quantity,
                        reorderLevel: addToInventory.reorderLevel,
                        maxStock: addToInventory.maxStock,
                    },
                    update: {
                        quantityOnHand: addToInventory.quantity,
                        reorderLevel: addToInventory.reorderLevel,
                        maxStock: addToInventory.maxStock,
                    }
                });
            }

            return editedProduct;

        });

        return editedProduct;

    }

    /**
     * Change the status of a product.
     */
    async changeStatus(input: ChangeProductStatusInput) {
        const { productId, status } = changeProductStatusSchema.parse(input);

        const product = await prisma.product.findUnique({ where: { id: productId } });
        if (!product) throwNotFound('Product not found');

        if (product.status === ProductStatus.DISCONTINUED) {
            throwConflict('Cannot change status of a discontinued product.');
        }

        const updatedProduct = await prisma.product.update({
            where: { id: productId },
            data: { status },
        });

        return updatedProduct;
    }

}

export const productService = new ProductService();

