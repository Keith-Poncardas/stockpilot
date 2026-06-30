import { prisma } from "@/lib";
import { productIdSchema, UUIDInput } from "@/schemas";
import { buildSearchQuery, createPaginator, smartDelete, throwConflict, throwNotFound } from "@/utils";
import { Prisma, SaleStatus } from "@prisma/client";
import { CreateProductInput, createProductSchema, EditProductInput, editProductSchema, PaginatedProductsInput, paginatedProductsSchema } from "./product.validation";
import { ProductStatus } from "@/enums";

export class ProductService {

    /**
     * Get product by id 
     */
    async getProduct(productId: UUIDInput) {

        const id = productIdSchema.parse(productId);

        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const daysElapsed = now.getDate();

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
                    select: {
                        quantity: true,
                        unitPrice: true,
                    },
                },
            },
        });

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

        return {
            productInfo: {
                id: product.id,
                sku: product.sku,
                name: product.name,
                description: product.description,
                unitPrice: Number(product.unitPrice),
                costPrice: product.costPrice ? Number(product.costPrice) : null,
                grossMargin: grossMargin !== null ? parseFloat(grossMargin.toFixed(1)) : null, // e.g. 50.4
                createdAt: product.createdAt,
                updatedAt: product.updatedAt,
            },
            inventoryStatus: {
                quantityOnHand: product.inventory?.quantityOnHand ?? 0,
                reorderLevel: product.inventory?.reorderLevel ?? 0,
            },
            salesSummary: {
                unitsSoldMonth,
                revenueMonth: parseFloat(revenueMonth.toFixed(2)),
                avgSalePerDay: parseFloat(avgSalePerDay.toFixed(2)),
            },
        };

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
            ...(status && status !== ProductStatus.ALL && { status: status as any }),

            /** Filtering by search */
            ...(search && buildSearchQuery(search, ['id:equals', 'sku', 'name', 'description'])),

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
                orderBy: { [orderBy]: orderDirection },
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

}

export const productService = new ProductService();