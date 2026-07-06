import { prisma } from "@/lib";
import { productIdSchema, UUIDInput } from "@/schemas";
import { buildSearchQuery, createPaginator, smartDelete, throwConflict, throwNotFound } from "@/utils";
import { Prisma, SaleStatus } from "@prisma/client";
import { ChangeProductStatusInput, changeProductStatusSchema, CreateProductInput, createProductSchema, EditProductInput, editProductSchema, PaginatedProductsInput, paginatedProductsSchema } from "./product.validation";
import { ProductStatus } from "@/enums";

export class ProductService {

    /**
     * Get product by id 
     */
    async getProduct(productId: UUIDInput) {

        const id = productIdSchema.parse(productId);

        const endOfToday = new Date();
        endOfToday.setHours(23, 59, 59, 999);

        const trendStart = new Date(endOfToday);
        trendStart.setDate(trendStart.getDate() - 6); // last 7 days
        trendStart.setHours(0, 0, 0, 0);

        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const daysElapsed = now.getDate();

        const [product, stockMovements, trendItems] = await Promise.all([

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
                        select: {
                            quantity: true,
                            unitPrice: true,
                            saleId: true,
                        },
                    },
                },
            }),

            prisma.stockMovement.findMany({
                where: { productId: id, type: 'IN' },
                orderBy: { createdAt: 'desc' },
                select: { quantity: true, createdAt: true },
            }),

            prisma.saleItem.findMany({
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
            }),

        ]);

        if (!product) throwNotFound('Product not found');

        /** Total Units Sold (this month) = Sum of quantities from all sales in the current month.  */
        const unitsSoldMonth = product.saleItems.reduce(
            (sum, item) => sum + item.quantity, 0
        );

        /** Total Revenue (this month) = Sum of (quantity × unitPrice) for all sales in the current month.  */
        const revenueMonth = product.saleItems.reduce(
            (sum, item) => sum + item.quantity * Number(item.unitPrice), 0
        );

        /** Average Sale Per Day = Total Revenue (this month) / Number of Days Passed (this month) */
        const avgSalePerDay = daysElapsed > 0
            ? revenueMonth / daysElapsed
            : 0;

        /** Gross Profit Margin (GPM) is the percentage of revenue remaining after accounting for the cost of goods sold (COGS). It indicates how efficiently a company is producing its goods or services. */
        const grossMargin =
            product.costPrice !== null && Number(product.unitPrice) > 0
                ? ((Number(product.unitPrice) - Number(product.costPrice)) /
                    Number(product.unitPrice)) *
                100
                : null;

        /** Unique transactions (sales) */
        const uniqueSaleIds = new Set(product.saleItems.map(item => item.saleId));
        const transactions = uniqueSaleIds.size;

        /** Average per sale = total revenue / number of transactions */
        const avgPerSale = transactions > 0 ? revenueMonth / transactions : 0;

        /** Max stock = sum of all IN stock movements (total ever received) */
        const maxStock = stockMovements.reduce((sum, m) => sum + m.quantity, 0);

        /** Last restock date = most recent IN movement */
        const lastRestockDate = stockMovements[0]?.createdAt?.toISOString() ?? null;

        /** Estimated days of stock = current quantity / avg units sold per day */
        const avgUnitsSoldPerDay = daysElapsed > 0 ? unitsSoldMonth / daysElapsed : 0;
        const quantityOnHand = product.inventory?.quantityOnHand ?? 0;
        const estimatedDaysOfStock = avgUnitsSoldPerDay > 0
            ? Math.floor(quantityOnHand / avgUnitsSoldPerDay)
            : 0;

        /** Sell-through rate = units sold / (units sold + units on hand) × 100 */
        const totalUnits = unitsSoldMonth + quantityOnHand;
        const sellThroughRate = totalUnits > 0
            ? parseFloat(((unitsSoldMonth / totalUnits) * 100).toFixed(1))
            : 0;

        return {
            productInfo: {
                id: product.id,
                sku: product.sku,
                name: product.name,
                description: product.description ?? '',
                unitPrice: Number(product.unitPrice),
                costPrice: product.costPrice ? Number(product.costPrice) : null,
                grossMargin: grossMargin !== null ? parseFloat(grossMargin.toFixed(1)) : null,
                status: product.status,
                createdAt: product.createdAt,
                updatedAt: product.updatedAt,
            },
            inventoryStatus: {
                quantityOnHand,
                reorderLevel: product.inventory?.reorderLevel ?? 0,
                maxStock,
                lastRestockDate,
                estimatedDaysOfStock,
            },
            salesSummary: {
                unitsSoldMonth,
                revenueMonth: parseFloat(revenueMonth.toFixed(2)),
                avgSalePerDay: parseFloat(avgSalePerDay.toFixed(2)),
                transactions,
                avgPerSale: parseFloat(avgPerSale.toFixed(2)),
                sellThroughRate,
            },
            salesTrend: this.buildSalesTrend(trendItems, endOfToday, 7),
        };

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

        const product = await prisma.$transaction(async (tx) => {

            /** Checking for the existence of a product based on name and SKU (excluding archived products) */
            const existingProduct = await tx.product.findFirst({
                where: {
                    OR: [
                        {
                            sku: {
                                equals: rest.sku.toUpperCase(),
                                mode: "insensitive"
                            }
                        }
                    ]
                }
            });

            /** Checking for duplicate products */
            if (existingProduct) {
                throwConflict('A product with the same name or SKU already exists.');
            }

            /** Creating product */
            const prod = await tx.product.create({
                data: {
                    ...rest,
                    name: rest.name.trim(),
                    sku: rest.sku.toUpperCase()
                }
            });

            /** Creating inventory for product if isAdded is true and quantity is greater than 0 */
            if (addToInventory?.isAdded && addToInventory?.quantity > 0) {

                await tx.inventory.create({
                    data: {
                        productId: prod.id,
                        quantityOnHand: addToInventory.quantity,
                        reorderLevel: addToInventory.reorderLevel,
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

        const { productId, ...rest } = editProductSchema.parse(input);

        // Guard: existence check
        const product = await prisma.product.findUnique({ where: { id: productId } });
        if (!product) throwNotFound('Product not found');

        const editedProduct = await prisma.$transaction(async (tx) => {

            // Check for name/SKU conflict against other active (non-archived) products
            const duplicate = await tx.product.findFirst({
                where: {
                    id: { not: productId },
                    OR: [
                        {
                            name: {
                                equals: rest.name.trim(),
                                mode: "insensitive"
                            }
                        },
                        {
                            sku: {
                                equals: rest.sku.toUpperCase(),
                                mode: "insensitive"
                            }
                        }
                    ]
                }
            });

            if (duplicate) {
                throwConflict(
                    'A product with the same name or SKU already exists.'
                );
            }

            /** Editing product */
            const editedProduct = await tx.product.update({
                where: { id: productId },
                data: {
                    ...rest,
                    name: rest.name.trim(),
                    sku: rest.sku.toUpperCase()
                }
            });

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

    /**
     * Get daily sales trend for a product over the last N days.
     * Can be called standalone; internally reuses buildSalesTrend.
     */
    async getProductSalesTrend(productId: UUIDInput, days = 7) {

        const id = productIdSchema.parse(productId);

        const endOfToday = new Date();
        endOfToday.setHours(23, 59, 59, 999);

        const startOfRange = new Date(endOfToday);
        startOfRange.setDate(startOfRange.getDate() - (days - 1));
        startOfRange.setHours(0, 0, 0, 0);

        const saleItems = await prisma.saleItem.findMany({
            where: {
                productId: id,
                sale: {
                    status: SaleStatus.COMPLETED,
                    saleDate: { gte: startOfRange, lte: endOfToday },
                },
            },
            select: {
                quantity: true,
                sale: { select: { saleDate: true } },
            },
        });

        return this.buildSalesTrend(saleItems, endOfToday, days);

    }

    /**
     * Converts raw saleItems into a day-by-day trend array of length `days`,
     * filling any days with no sales as 0.
     */
    private buildSalesTrend(
        saleItems: { quantity: number; sale: { saleDate: Date } }[],
        endOfToday: Date,
        days: number
    ) {
        const dailyBucket = new Map<string, number>();
        for (const item of saleItems) {
            const key = item.sale.saleDate.toISOString().split('T')[0];
            dailyBucket.set(key, (dailyBucket.get(key) ?? 0) + item.quantity);
        }

        const todayKey = endOfToday.toISOString().split('T')[0];
        return Array.from({ length: days }, (_, i) => {
            const date = new Date(endOfToday);
            date.setDate(date.getDate() - (days - 1 - i));
            const key = date.toISOString().split('T')[0];
            return {
                date: key,
                label: date.toLocaleDateString('en-US', { weekday: 'short' }),
                unitsSold: dailyBucket.get(key) ?? 0,
                isToday: key === todayKey,
            };
        });
    }

}

export const productService = new ProductService();

