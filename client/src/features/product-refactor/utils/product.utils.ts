import { PRODUCT_STATUS_COLORS } from '../constants';

export function getProductStatusColor(status: string): string {
    return PRODUCT_STATUS_COLORS[status] || 'bg-gray-100 text-gray-500';
}

export function calculateProfitAndMargin(
    unitPrice?: number | string | null,
    costPrice?: number | string | null
): { margin: number | null; profit: number | null } {
    const price = Number(unitPrice);
    const cost = Number(costPrice);

    if (!price || isNaN(price) || price <= 0) {
        return { margin: null, profit: null };
    }

    const actualCost = !cost || isNaN(cost) ? 0 : cost;
    const profit = price - actualCost;
    const margin = (profit / price) * 100;

    return { margin, profit };
}
