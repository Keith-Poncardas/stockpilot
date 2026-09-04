import { TrendingUp, ShoppingCart, BarChart2, RefreshCcw, Coins } from 'lucide-react';
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
        totalTaxCollected,
        totalTransactions,
        completedSales,
        refundedOrVoidedCount
    } = metrics as Partial<ISaleMetrics>;

    const formattedRevenue = totalRevenue !== undefined ? formatCurrency(totalRevenue) : undefined;
    const formattedTax = totalTaxCollected !== undefined ? formatCurrency(totalTaxCollected) : undefined;

    return [
        {
            value: formattedRevenue,
            label: 'Total Revenue (VAT-Inc)',
            icon: TrendingUp,
            iconContainerClass: 'bg-emerald-50 text-emerald-600'
        },
        {
            value: formattedTax,
            label: 'Total Tax Collected (12%)',
            icon: Coins,
            iconContainerClass: 'bg-indigo-50 text-indigo-600'
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

