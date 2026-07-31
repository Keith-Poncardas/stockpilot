import { useQuery } from "@apollo/client";
import { useState } from "react";
import { GET_DASHBOARD_DATA } from "../operations";
import type { TimeRange } from "../components/SalesOverviewChart";
import type { TopProductItem } from "../components/TopProducts";
import type { TopLocationItem } from "../components/TopLocations";
import type { RecentSaleItem } from "../components/RecentSales";
import type { LowStockAlertItem } from "../components/LowStockAlerts";

export interface DashboardMetrics {
    totalSales: number;
    totalProducts: number;
    totalCustomers: number;
    totalUnitsInStock: number;
}

export interface SalesChartPoint {
    label: string;
    value: number;
}

export interface DashboardDataResponse {
    getDashboardData: {
        metrics: DashboardMetrics;
        salesChart: SalesChartPoint[];
        topProducts: {
            id: string;
            name: string;
            revenue: number;
            percentage: number;
        }[];
        topLocations: {
            id: string;
            name: string;
            revenue: number;
            percentage: number;
        }[];
        recentSales: {
            id: string;
            customer: string;
            product?: string;
            quantity: number;
            amount: number;
            status: string;
        }[];
        lowStockAlerts: {
            id: string;
            productName: string;
            sku?: string;
            quantityOnHand: number;
            reorderLevel: number;
            stockStatus: string;
        }[];
    };
}

export function useDashboardData(initialTimeRange: TimeRange = "daily") {
    const [timeRange, setTimeRange] = useState<TimeRange>(initialTimeRange);

    const { data, loading, error, refetch } = useQuery<DashboardDataResponse>(
        GET_DASHBOARD_DATA,
        {
            variables: { timeRange },
            notifyOnNetworkStatusChange: true,
        }
    );

    const raw = data?.getDashboardData;

    const metrics: DashboardMetrics = raw?.metrics ?? {
        totalSales: 0,
        totalProducts: 0,
        totalCustomers: 0,
        totalUnitsInStock: 0,
    };

    const salesChart = raw?.salesChart ?? [];

    const topProducts: TopProductItem[] = (raw?.topProducts ?? []).map((p) => ({
        id: p.id,
        name: p.name,
        revenue: p.revenue,
        percentage: p.percentage,
    }));

    const topLocations: TopLocationItem[] = (raw?.topLocations ?? []).map((l) => ({
        id: l.id,
        name: l.name,
        revenue: l.revenue,
        rawValue: l.revenue,
        percentage: l.percentage,
    }));

    const recentSales: RecentSaleItem[] = (raw?.recentSales ?? []).map((s) => ({
        id: s.id,
        customer: s.customer,
        product: s.product,
        quantity: s.quantity,
        amount: s.amount,
        status: s.status,
    }));

    const lowStockAlerts: LowStockAlertItem[] = (raw?.lowStockAlerts ?? []).map((a) => ({
        id: a.id,
        productName: a.productName,
        sku: a.sku,
        quantityOnHand: a.quantityOnHand,
        reorderLevel: a.reorderLevel,
        stockStatus: a.stockStatus,
    }));

    return {
        metrics,
        salesChart,
        topProducts,
        topLocations,
        recentSales,
        lowStockAlerts,
        loading,
        error,
        timeRange,
        setTimeRange,
        refetch,
    };
}
