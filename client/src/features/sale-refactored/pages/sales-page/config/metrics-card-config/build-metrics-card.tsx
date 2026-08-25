import { TrendingUp, ShoppingCart, BarChart2, RefreshCcw } from 'lucide-react';
import type { GridMetricItem } from '@/components';
import type { IGetSalesMetricsResponse, ISaleMetrics } from './types';

/**
 * Generates the config array for the GridMetrics component.
 * Uses raw LucideIcon component references and passes raw numbers for values.
 */
export const buildMetricsCards = (
    metricsData: IGetSalesMetricsResponse | undefined,
    formatCurrency: (val: number) => string
): GridMetricItem[] => {
    const metrics = metricsData?.getSalesMetrics || {};

    const {
        totalRevenue,
        totalTransactions,
        completedSales,
        refundedOrVoidedCount
    } = metrics as Partial<ISaleMetrics>;

    const formattedCurrency = totalRevenue !== undefined ? formatCurrency(totalRevenue) : undefined;

    return [
        {
            value: formattedCurrency,
            label: 'Total Revenue',
            icon: TrendingUp,
            iconContainerClass: 'bg-emerald-50 text-emerald-600'
        },
        {
            value: totalTransactions,
            label: 'Total Transactions',
            icon: ShoppingCart,
            iconContainerClass: 'bg-blue-50 text-blue-600'
        },
        {
            value: completedSales,
            label: 'Completed Sales',
            icon: BarChart2,
            iconContainerClass: 'bg-violet-50 text-violet-600'
        },
        {
            value: refundedOrVoidedCount,
            label: 'Refunded / Voided',
            icon: RefreshCcw,
            iconContainerClass: 'bg-amber-50 text-amber-600'
        }
    ];
};

