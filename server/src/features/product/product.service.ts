import { prisma } from "@/lib";
import { buildSearchQuery, createPaginator, throwConflict } from "@/utils";
import { MovementType, Prisma } from "@prisma/client";
import { ProductStatus } from "@/enums";
import { ensureNotDiscontinued } from "./product.util";
import {
    AddProductInput,
    ChangeProductStatusInput,
    EditProductInput,
    PaginatedProductsInput
} from "./types";
import { inventoryService } from "../inventory";
import { stockMovementsService } from "../stockMovements";
import { UUIDInput } from "@/schemas";

export class ProductService {

    /**
     * Retrieves a single product by a unique identifier.
     *
     * Uses Prisma's `findUniqueOrThrow()`, which throws an error if the
     * product does not exist instead of returning `null`.
     *
     * @param where Unique criteria used to locate the product (e.g. `id`, `sku`).
     * @returns The matching product.
     * @throws {Prisma.PrismaClientKnownRequestError} If no matching product is found.
     */
    async getProduct(where: Prisma.ProductWhereUniqueInput) {
        return await prisma.product.findUniqueOrThrow({
            where
        });
    }

    /**
     * Counts the number of products that match the given filter.
     *
     * @param where Optional Prisma filter. If omitted, counts all products.
     * @returns The total number of matching products.
     */
    async getProductCount(where?: Prisma.ProductWhereInput) {
        return prisma.product.count({ where });
    }

    /**
     * Retrieves summary metrics for products.
     *
     * Returns the total number of products, along with counts for
     * active and draft products.
     *
     * @returns An object containing product metrics.
     */
    async getProductMetrics() {
        const [total, active, draft] = await Promise.all([
            this.getProductCount(),
            this.getProductCount({ status: ProductStatus.ACTIVE }),
            this.getProductCount({ status: ProductStatus.DRAFT }),
        ]);
        return { total, active, draft };
    }

    /**
     * Retrieves a paginated list of products with filtering and sorting.
     *
     * Supports filtering by status, search keyword, price range, and
     * creation date range. Results can also be sorted and paginated.
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

            prisma.product.findMany({
                where,
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
     * Ensures that no existing product has the same value for the specified field.
     *
     * Performs a case-insensitive uniqueness check and throws a conflict
     * error if a matching product is found.
     *
     * @template K A product field that can be used for filtering.
     * @param field The product field to check (e.g. `sku`, `name`).
     * @param value The value to search for.
     * @param message Optional custom conflict error message.
     * @throws {ConflictError} If a matching product already exists.
     */
    private async ensureNoDuplication<
        K extends keyof Prisma.ProductWhereInput
    >(
        field: K,
        value: string,
        message?: string
    ) {
        const exists = await prisma.product.findFirst({
            where: {
                [field]: {
                    equals: value,
                    mode: "insensitive",
                },
            } as Prisma.ProductWhereInput,
        });

        if (exists) {
            throwConflict(
                message ?? `Product with ${field} "${value}" already exists.`
            );
        }
    }

    /**
     * Creates a new product and optionally initializes its inventory.
     *
     * Ensures the product does not already exist, then creates the product
     * within a transaction. If an initial stock quantity is provided, an
     * inventory record is created and an initial stock movement is recorded.
     *
     * @param userId The ID of the user performing the operation.
     * @param input The validated product and inventory data.
     * @returns The newly created product.
     * @throws {ConflictError} If a product with the same SKU already exists.
     */
    async createProduct(userId: UUIDInput, input: AddProductInput) {

        const { product, inventory } = input;
        const hasInitialInventory = inventory && inventory.quantityOnHand > 0;

        const { createInventoryInternal } = inventoryService;
        const { recordStockMovement } = stockMovementsService;

        await this.ensureNoDuplication("sku", product.sku);

        return await prisma.$transaction(async (tx) => {

            const prod = await tx.product.create({
                data: product,
            });

            if (hasInitialInventory) {

                await createInventoryInternal(tx, {
                    productId: prod.id,
                    userId,
                    ...inventory
                });

                await recordStockMovement(tx, {
                    productId: prod.id,
                    userId,
                    type: MovementType.IN,
                    quantity: inventory.quantityOnHand,
                    notes: 'Initial stock on product creation',
                });

            }

            return prod;
        });
    }

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
     * Edits an existing product.
     *
     * @param input The validated product and inventory data.
     * @returns The updated product.
     * @throws {ConflictError} If a product with the same SKU already exists.
     * @throws {Prisma.PrismaClientKnownRequestError} If the product does not exist.
     */
    async editProduct(input: EditProductInput) {

        const { productId, product } = input;
        await this.ensureProductExist(productId);

        return await prisma.product.update({
            where: { id: productId },
            data: product
        });

    }

    /**
     * Changes the status of an existing product.
     *
     * Ensures the product exists and is not already discontinued.
     * Throws an error if the product is discontinued or if the
     * product ID does not exist.
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

}

export const productService = new ProductService();

