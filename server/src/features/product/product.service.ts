import { prisma } from "@/lib";
import { buildSearchQuery, createInfiniteScroller, createPaginator, generateSku, throwConflict } from "@/utils";
import { MovementType, Prisma, SaleStatus } from '@/generated/client.js';
import { ProductStatus } from "@/enums";
import { ensureNotDiscontinued, calculateRankedProducts } from "./product.util";
import {
    AddProductInput,
    ChangeProductStatusInput,
    EditProductInput,
    getTopSellingProductsInput,
    PaginatedProductsInput,
    ProductSalesRanking,
    SearchProductsInfiniteInput
} from "./types";
import { inventoryService } from "../inventory";
import { stockMovementsService } from "../stockMovements";
import { UUIDInput } from "@/schemas";

export class ProductService {

    /**
     * Ensures that a product with the given ID exists.
     *
     * @param productId The unique identifier of the product.
     * @returns The matching product.
     * @throws {Prisma.PrismaClientKnownRequestError} If the product does not exist.
     */
    private async ensureProductExist(productId: UUIDInput) {
        return await prisma.product.findUniqueOrThrow({
            where: { id: productId },
        });
    }

    /**
     * Ensures that no existing product has the same value for the specified field.
     *
     * Performs a case-insensitive uniqueness check and throws a conflict
     * error if a matching product is found.
     *
     * @template K A product field that can be used for filtering.
     * @param field The product field to check (e.g. `sku`, `name`).
     * @param value The value to search for.
     * @param excludeId Optional product ID to exclude from the check (e.g. on edit).
     * @param message Optional custom conflict error message.
     * @throws {ConflictError} If a matching product already exists.
     */
    private async ensureNoDuplication<
        K extends keyof Prisma.ProductWhereInput
    >(
        field: K,
        value: string,
        excludeId?: string,
        message?: string
    ) {
        const exists = await prisma.product.findFirst({
            where: {
                [field]: {
                    equals: value,
                    mode: "insensitive",
                },
                ...(excludeId && {
                    id: { not: excludeId }
                }),
            } as Prisma.ProductWhereInput,
        });

        if (exists) {
            throwConflict(
                message ?? `Product with ${field} "${value}" already exists.`
            );
        }
    }

    /**
     * Retrieves a single product by a unique identifier.
     *
     * @param where Unique criteria used to locate the product (e.g. `id`, `sku`).
     * @returns The matching product.
     * @throws {Prisma.PrismaClientKnownRequestError} If no matching product is found.
     */
    async getProduct(where: Prisma.ProductWhereUniqueInput) {
        return await prisma.product.findUniqueOrThrow({
            where,
            include: {
                inventory: true,
            },
        });
    }

    /**
     * Retrieves a list of products matching the given criteria.
     */
    get findProducts() {
        return prisma.product.findMany;
    }

    /**
     * Counts the number of products that match the given filter.
     *
     * @param where Optional Prisma filter. If omitted, counts all products.
     * @returns The total number of matching products.
     */
    async productCount(where?: Prisma.ProductWhereInput) {
        return prisma.product.count({ where });
    }

    /**
     * Retrieves summary metrics for products.
     *
     * @returns An object containing product metrics.
     */
    async getProductMetrics() {
        const [total, active, draft] = await Promise.all([
            this.productCount(),
            this.productCount({ status: ProductStatus.ACTIVE }),
            this.productCount({ status: ProductStatus.DRAFT }),
        ]);
        return { total, active, draft };
    }

    /**
     * Retrieves a list of top-selling products.
     *
     * @param input The sort order for the products.
     * @returns A list of top-selling products.
     */
    async getTopSellingProducts(
        input: getTopSellingProductsInput
    ): Promise<ProductSalesRanking[]> {
        const { sort } = input;

        const products = await this.findProducts({
            where: {
                saleItems: {
                    some: {
                        sale: {
                            status: SaleStatus.COMPLETED,
                        },
                    },
                },
            },
            select: {
                id: true,
                name: true,
                saleItems: {
                    where: {
                        sale: {
                            status: SaleStatus.COMPLETED,
                        },
                    },
                    select: {
                        quantity: true,
                        unitPrice: true,
                    },
                },
            },
        });

        return calculateRankedProducts(products, sort);
    }

    /**
     * Retrieves an infinite-scroll list of products.
     *
     * @param input The search criteria and pagination options.
     * @returns A paginated collection of products with cursor pagination metadata.
     */
    async searchProductsInfinite(input: SearchProductsInfiniteInput) {
        const { search, cursor, limit } = input;
        const { params, buildResult } = createInfiniteScroller({
            cursor,
            limit
        });

        const where: Prisma.ProductWhereInput = {
            status: { not: ProductStatus.DISCONTINUED },
            ...(search && buildSearchQuery(search, [
                'sku',
                'name',
                'description'
            ])),
        };

        const products = await this.findProducts({
            where,
            take: params.take + 1,
            ...(params.cursor && {
                cursor: { id: params.cursor },
                skip: 1,
            }),
            orderBy: { createdAt: 'desc' },
            include: {
                inventory: true,
            },
        });

        return buildResult(products);
    }

    /**
     * Retrieves a paginated list of products with filtering and sorting.
     *
     * @param args Pagination, filtering, and sorting options.
     * @returns A paginated collection of products with pagination metadata.
     */
    async getProducts(args: PaginatedProductsInput) {
        const { limit, page, filter } = args;
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
            ...(search && buildSearchQuery(search, [
                'sku',
                'name',
                'description'
            ])),

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
            this.findProducts({
                where,
                skip: params.skip,
                take: params.limit,
                orderBy: {
                    [orderBy]: orderDirection
                },
                include: {
                    inventory: true,
                },
            }),
            this.productCount(where),
        ]);

        return {
            data: products,
            meta: buildMeta(total),
        };
    }

    /**
     * Creates a new product and optionally initializes its inventory.
     *
     * @param userId The ID of the user performing the operation.
     * @param input The validated product and inventory data.
     * @returns The newly created product.
     * @throws {ConflictError} If a product with the same SKU already exists.
     */
    async createProduct(userId: UUIDInput, input: AddProductInput) {
        const { product, inventory } = input;
        const sku = product.sku?.trim() || generateSku(product.name);
        const hasInitialInventory = inventory && inventory.quantityOnHand > 0;

        const { createInventoryInternal } = inventoryService;
        const { recordStockMovement } = stockMovementsService;

        await this.ensureNoDuplication("sku", sku);

        return await prisma.$transaction(async (tx) => {
            const prod = await tx.product.create({
                data: {
                    name: product.name,
                    sku,
                    description: product.description,
                    unitPrice: product.unitPrice,
                    costPrice: product.costPrice,
                    status: product.status,
                },
            });

            if (inventory) {
                await createInventoryInternal(tx, {
                    productId: prod.id,
                    userId,
                    quantityOnHand: inventory.quantityOnHand || 0,
                    reorderLevel: inventory.reorderLevel ?? 10,
                    maxStock: inventory.maxStock ?? 100,
                });

                if (hasInitialInventory) {
                    await recordStockMovement(tx, "IN", {
                        productId: prod.id,
                        userId,
                        type: MovementType.IN,
                        quantity: inventory.quantityOnHand,
                        notes: 'Initial stock on product creation',
                    });
                }
            }

            return prod;
        });
    }

    /**
     * Edits an existing product.
     *
     * @param input The validated product and inventory data.
     * @returns The updated product.
     * @throws {ConflictError} If a product with the same SKU already exists.
     * @throws {Prisma.PrismaClientKnownRequestError} If the product does not exist.
     */
    async editProduct(input: EditProductInput) {
        const { productId, product, inventory } = input;
        await this.ensureProductExist(productId);

        if (product.sku) {
            await this.ensureNoDuplication("sku", product.sku, productId);
        }

        return await prisma.$transaction(async (tx) => {
            const updatedProduct = await tx.product.update({
                where: { id: productId },
                data: {
                    name: product.name,
                    ...(product.sku && { sku: product.sku }),
                    description: product.description,
                    unitPrice: product.unitPrice,
                    costPrice: product.costPrice,
                    status: product.status,
                },
            });

            if (inventory) {
                await tx.inventory.upsert({
                    where: { productId },
                    update: {
                        reorderLevel: inventory.reorderLevel,
                        maxStock: inventory.maxStock,
                        ...(inventory.quantityOnHand !== undefined && {
                            quantityOnHand: inventory.quantityOnHand,
                        }),
                    },
                    create: {
                        productId,
                        userId: (await tx.inventory.findFirst({ where: { productId } }))?.userId || updatedProduct.id,
                        quantityOnHand: inventory.quantityOnHand || 0,
                        reorderLevel: inventory.reorderLevel ?? 10,
                        maxStock: inventory.maxStock ?? 100,
                    },
                });
            }

            return updatedProduct;
        });
    }

    /**
     * Changes the status of an existing product.
     *
     * @param input The product ID and the new status.
     * @returns The updated product.
     * @throws {ConflictError} If the product is discontinued.
     * @throws {Prisma.PrismaClientKnownRequestError} If the product does not exist.
     */
    async changeStatus(input: ChangeProductStatusInput) {
        const { productId, status } = input;
        const product = await this.ensureProductExist(productId);

        ensureNotDiscontinued(product.status);

        return await prisma.product.update({
            where: { id: productId },
            data: { status },
        });
    }

    /**
     * Calculates performance metrics for a specific product based on completed sales.
     */
    async getProductPerformanceMetrics(productId: string) {
        const now = new Date();
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

        const [allItems, currentMonthItems, prevMonthItems, inventory] = await Promise.all([
            prisma.saleItem.findMany({
                where: {
                    productId,
                    sale: { status: SaleStatus.COMPLETED },
                },
                include: {
                    sale: { select: { id: true, saleDate: true } },
                },
            }),
            prisma.saleItem.findMany({
                where: {
                    productId,
                    sale: {
                        status: SaleStatus.COMPLETED,
                        saleDate: { gte: thirtyDaysAgo },
                    },
                },
            }),
            prisma.saleItem.findMany({
                where: {
                    productId,
                    sale: {
                        status: SaleStatus.COMPLETED,
                        saleDate: { gte: sixtyDaysAgo, lt: thirtyDaysAgo },
                    },
                },
            }),
            prisma.inventory.findUnique({
                where: { productId },
                select: { quantityOnHand: true },
            }),
        ]);

        const unitsSold = allItems.reduce((sum, item) => sum + item.quantity, 0);
        const revenue = allItems.reduce(
            (sum, item) => sum + item.quantity * Number(item.unitPrice),
            0
        );
        const transactionIds = new Set(allItems.map((item) => item.sale.id));
        const transactions = transactionIds.size;
        const avgPerSale = transactions > 0 ? Number((revenue / transactions).toFixed(2)) : 0;

        const currentStock = inventory?.quantityOnHand ?? 0;
        const totalStockHandled = unitsSold + currentStock;
        const sellThroughRate =
            totalStockHandled > 0
                ? Number(((unitsSold / totalStockHandled) * 100).toFixed(1))
                : 0;

        const currentMonthUnits = currentMonthItems.reduce((sum, item) => sum + item.quantity, 0);
        const prevMonthUnits = prevMonthItems.reduce((sum, item) => sum + item.quantity, 0);
        const unitsSoldTrend =
            prevMonthUnits > 0
                ? Number((((currentMonthUnits - prevMonthUnits) / prevMonthUnits) * 100).toFixed(1))
                : currentMonthUnits > 0 ? 100 : 0;

        const currentMonthRevenue = currentMonthItems.reduce(
            (sum, item) => sum + item.quantity * Number(item.unitPrice),
            0
        );
        const prevMonthRevenue = prevMonthItems.reduce(
            (sum, item) => sum + item.quantity * Number(item.unitPrice),
            0
        );
        const revenueTrend =
            prevMonthRevenue > 0
                ? Number((((currentMonthRevenue - prevMonthRevenue) / prevMonthRevenue) * 100).toFixed(1))
                : currentMonthRevenue > 0 ? 100 : 0;

        return {
            unitsSold,
            unitsSoldTrend,
            revenue: Number(revenue.toFixed(2)),
            revenueTrend,
            transactions,
            avgPerSale,
            sellThroughRate,
        };
    }

}

export const productService = new ProductService();
