import { Prisma, SaleStatus, ProductStatus } from "@prisma/client";
import { throwNotFound, throwConflict } from "@/utils";
import { SortOrder } from "@/enums";
import { ProductWithInventory, SaleItemData, SalesAggregationRow, SalesOverviewItem, SalesLocationRow } from "./types";
import { CreateSaleItemInput } from "./types";
import { listMuncities } from "@jobuntux/psgc";

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

/**
 * Returns a Date object representing the current time in Manila,
 * but mapped as a naive UTC Date. 
 * This aligns with Prisma's parsing of timezone-stripped Postgres timestamps.
 */
export function getManilaToday(): Date {
    // Current time in real world + 8 hours for Manila
    return new Date(Date.now() + 8 * 60 * 60 * 1000);
}

/**
 * Compares two naive UTC dates to see if they fall on the same day.
 */
export function isSameDay(d1: Date, d2: Date): boolean {
    return d1.getUTCFullYear() === d2.getUTCFullYear() &&
        d1.getUTCMonth() === d2.getUTCMonth() &&
        d1.getUTCDate() === d2.getUTCDate();
}

/**
 * Compares two naive UTC dates to see if they fall in the same month.
 */
export function isSameMonth(d1: Date, d2: Date): boolean {
    return d1.getUTCFullYear() === d2.getUTCFullYear() &&
        d1.getUTCMonth() === d2.getUTCMonth();
}

/**
 * Compares two naive UTC dates to see if they fall in the same week (Monday start).
 */
export function isSameWeek(d1: Date, d2: Date): boolean {
    const getWeekStart = (d: Date) => {
        const date = new Date(d.getTime());
        const day = date.getUTCDay();
        const diff = date.getUTCDate() - day + (day === 0 ? -6 : 1);
        date.setUTCDate(diff);
        date.setUTCHours(0, 0, 0, 0);
        return date;
    };
    return getWeekStart(d1).getTime() === getWeekStart(d2).getTime();
}

/**
 * Formats a naive UTC date to its short weekday name (e.g., 'Mon', 'Tue').
 */
export function formatShortWeekday(date: Date): string {
    return date.toLocaleDateString("en-US", { weekday: "short", timeZone: "UTC" });
}

/**
 * Formats a naive UTC date to its short month name (e.g., 'Jan', 'Feb').
 */
export function formatShortMonth(date: Date): string {
    return date.toLocaleDateString("en-US", { month: "short", timeZone: "UTC" });
}

/**
 * Returns the week of the month (1-5) for a given naive UTC date.
 */
export function getWeekOfMonth(date: Date): number {
    const firstDayOfMonth = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1));
    const firstDayWeekday = firstDayOfMonth.getUTCDay() || 7;
    const offsetDate = date.getUTCDate() + firstDayWeekday - 1;
    return Math.ceil(offsetDate / 7);
}

/**
 * Formats a naive UTC date to 'Mon DD, YYYY'
 */
export function formatDate(date: Date): string {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${monthNames[date.getUTCMonth()]} ${date.getUTCDate()}, ${date.getUTCFullYear()}`;
}

/**
 * Generates the raw SQL query for sales aggregation.
 */
export const buildSalesAggregationQuery = (
    rangeType: string,
    rangeInterval: string,
    bucketInterval: string,
    bucketType: string,
    timezone: string
) => {
    return Prisma.sql`
        WITH date_range AS (
          SELECT
            date_trunc(
              ${Prisma.raw(`'${rangeType}'`)},
              CURRENT_TIMESTAMP AT TIME ZONE ${timezone}
            ) AS start_date,
            date_trunc(
              ${Prisma.raw(`'${rangeType}'`)},
              CURRENT_TIMESTAMP AT TIME ZONE ${timezone}
            ) + ${Prisma.raw(`INTERVAL '${rangeInterval}'`)} AS end_date
        ),
        buckets AS (
          SELECT generate_series(
            start_date,
            end_date - ${Prisma.raw(`INTERVAL '${bucketInterval}'`)},
            ${Prisma.raw(`INTERVAL '${bucketInterval}'`)}
          ) AS bucket
          FROM date_range
        )
        SELECT
          buckets.bucket,
          COALESCE(
            SUM(s.total_amount),
            0
          ) AS sales
        FROM buckets
        LEFT JOIN sales s
          ON date_trunc(
               ${Prisma.raw(`'${bucketType}'`)},
               s.sale_date AT TIME ZONE ${timezone}
             ) = buckets.bucket
          AND s.status = 'COMPLETED'
        GROUP BY buckets.bucket
        ORDER BY buckets.bucket;
    `;
};

/**
 * Formats raw sales aggregation rows into structured overview items.
 * 
 * @param rows - The raw sales aggregation rows returned by the database query.
 * @param labelFn - A function that generates a descriptive label for a given bucket date.
 * @param isActiveFn - A function that determines if the given bucket date corresponds to the current active period.
 * @returns An array of formatted sales overview items ready for frontend presentation.
 */
export const formatSalesOverviewRows = (
    rows: SalesAggregationRow[],
    labelFn: (date: Date) => string,
    isActiveFn: (date: Date) => boolean
): SalesOverviewItem[] => {
    return rows.map((row) => {
        const date = new Date(row.bucket);

        return {
            label: labelFn(date),
            date: formatDate(date),
            sales: Number(row.sales) ?? 0,
            isActive: isActiveFn(date),
        };
    });
};

/**
 * Generates the raw SQL query to get sales ranked by location.
 */
export const buildSalesLocationQuery = (sort: SortOrder, limit: number) => {
    const orderClause = sort === SortOrder.HIGH ? Prisma.sql`DESC` : Prisma.sql`ASC`;
    return Prisma.sql`
        SELECT
            c.city,
            SUM(s.total_amount) AS revenue
        FROM sales s
        LEFT JOIN customers c ON c.id = s.customer_id
        WHERE s.status = 'COMPLETED'
        GROUP BY c.city
        ORDER BY revenue ${orderClause}
        LIMIT ${limit}
    `;
};

/**
 * Formats sales by location into a ranked response with city names.
 * Uses @jobuntux/psgc to translate city codes into actual names.
 */
export const formatSalesLocationRanking = (
    rows: SalesLocationRow[]
) => {
    if (rows.length === 0) return [];

    const allMuncities = listMuncities();
    const cityMap = new Map(allMuncities.map(m => [m.munCityCode, m.munCityName]));

    const maxRevenue = Number(rows[0].revenue);

    return rows.map((r, index) => {
        let name = "Unknown";

        if (r.city) {

            const mappedName = cityMap.get(r.city);
            if (mappedName) {
                name = mappedName;
            } else {
                name = r.city;
            }
        }

        return {
            cityCode: r.city ?? "unknown",
            name,
            revenue: Number(r.revenue),
            percentage: maxRevenue > 0 ? Math.round((Number(r.revenue) / maxRevenue) * 100) : 0,
            rank: index + 1,
        };
    });
};
