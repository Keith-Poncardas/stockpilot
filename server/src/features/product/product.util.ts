import { Prisma } from "@prisma/client";
import { prisma } from "@/lib";
import { generateSku, throwConflict } from "@/utils";
/**
 * Calculates the gross profit margin.
 * @returns Gross margin as a percentage, or null if it cannot be calculated.
 */
export function calculateGrossMargin(unitPrice: Prisma.Decimal | number, costPrice: Prisma.Decimal | number | null): number | null {
    if (costPrice === null) return null;

    const uPrice = Number(unitPrice);
    const cPrice = Number(costPrice);

    if (uPrice > 0) {
        const margin = ((uPrice - cPrice) / uPrice) * 100;
        return parseFloat(margin.toFixed(1));
    }
    return null;
}

/**
 * Calculates additional inventory metrics like maxStock, lastRestockDate, and estimatedDaysOfStock.
 */
export function calculateInventoryMetrics(
    saleItems: { quantity: number }[],
    stockAggregation: { _sum: { quantity: number | null }, _max: { createdAt: Date | null } },
    inventory: { quantityOnHand?: any, reorderLevel?: any, maxStock?: any },
    daysElapsed: number
) {
    const quantityOnHand = Number(inventory.quantityOnHand ?? 0);
    const reorderLevel = Number(inventory.reorderLevel ?? 0);

    const unitsSoldMonth = saleItems.reduce((sum, item) => sum + item.quantity, 0);
    const avgUnitsSoldPerDay = daysElapsed > 0 ? unitsSoldMonth / daysElapsed : 0;

    const estimatedDaysOfStock = avgUnitsSoldPerDay > 0
        ? Math.floor(quantityOnHand / avgUnitsSoldPerDay)
        : 0;

    const maxStock = Number(inventory.maxStock ?? 0);
    const lastRestockDate = stockAggregation._max.createdAt?.toISOString() ?? null;

    return {
        quantityOnHand,
        reorderLevel,
        estimatedDaysOfStock,
        maxStock,
        lastRestockDate,
    };
}

/**
 * Converts raw saleItems into a day-by-day trend array of length `days`,
 * filling any days with no sales as 0.
 */
export function buildSalesTrend(
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

/**
 * Calculates the sales summary metrics in a single pass to optimize performance.
 */
export function calculateSaleSummary(
    saleItems: { quantity: number; unitPrice: any; saleId: string }[],
    quantityOnHand: number,
    daysElapsed: number
) {
    let unitsSoldMonth = 0;
    let revenueMonth = 0;
    const uniqueSaleIds = new Set<string>();

    for (const item of saleItems) {
        unitsSoldMonth += item.quantity;
        revenueMonth += item.quantity * Number(item.unitPrice);
        uniqueSaleIds.add(item.saleId);
    }

    const avgSalePerDay = daysElapsed > 0 ? revenueMonth / daysElapsed : 0;
    const transactions = uniqueSaleIds.size;
    const avgPerSale = transactions > 0 ? revenueMonth / transactions : 0;

    const totalUnits = unitsSoldMonth + quantityOnHand;
    const sellThroughRate = totalUnits > 0 ? (unitsSoldMonth / totalUnits) * 100 : 0;

    return {
        unitsSoldMonth,
        revenueMonth: parseFloat(revenueMonth.toFixed(2)),
        avgSalePerDay: parseFloat(avgSalePerDay.toFixed(2)),
        transactions,
        avgPerSale: parseFloat(avgPerSale.toFixed(2)),
        sellThroughRate: parseFloat(sellThroughRate.toFixed(1)),
    };
}

/**
 * Resolves a product SKU: uses the provided input (uppercased) or auto-generates a unique one.
 * Auto-generation retries up to 5 times.
 */
export async function resolveProductSku(name: string, inputSku?: string | null): Promise<string> {
    if (inputSku?.trim()) {
        return inputSku.toUpperCase();
    }

    for (let attempt = 0; attempt < 5; attempt++) {
        const generated = generateSku(name);
        const conflict = await prisma.product.findFirst({
            where: { sku: { equals: generated, mode: "insensitive" } },
            select: { id: true },
        });
        if (!conflict) return generated;
        if (attempt === 4) throwConflict("Could not generate a unique SKU. Please provide one manually.");
    }

    throwConflict("Could not generate a unique SKU. Please provide one manually.");
}