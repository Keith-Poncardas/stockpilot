import { ArrowDownRight, ArrowUpRight, SlidersHorizontal, AlertTriangle } from 'lucide-react';

export interface StockMovementDashboardMetrics {
    totalStockIn?: number | null;
    totalStockOut?: number | null;
    totalStockAdjustments?: number | null;
    lowStockProducts?: number | null;
}

/**
 * Generates configuration options for displaying metric cards on the stock movement dashboard.
 */
export const getMetricCardOptions = (metrics?: StockMovementDashboardMetrics | null) => [
    {
        id: "stock-in",
        value: metrics?.totalStockIn?.toLocaleString() ?? "-",
        label: "Total Stock In",
        icon: <ArrowDownRight className="w-5 h-5" />,
        iconContainerClass: "bg-emerald-50 text-emerald-600"
    },
    {
        id: "stock-out",
        value: metrics?.totalStockOut?.toLocaleString() ?? "-",
        label: "Total Stock Out",
        icon: <ArrowUpRight className="w-5 h-5" />,
        iconContainerClass: "bg-blue-50 text-blue-600"
    },
    {
        id: "adjustments",
        value: metrics?.totalStockAdjustments?.toLocaleString() ?? "-",
        label: "Total Adjustments",
        icon: <SlidersHorizontal className="w-5 h-5" />,
        iconContainerClass: "bg-purple-50 text-purple-600"
    },
    {
        id: "low-stock",
        value: metrics?.lowStockProducts?.toLocaleString() ?? "-",
        label: "Low Stock Products",
        icon: <AlertTriangle className="w-5 h-5" />,
        iconContainerClass: "bg-amber-50 text-amber-600"
    }
];
