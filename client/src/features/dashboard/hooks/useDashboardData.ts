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
    dashboardMetrics: DashboardMetrics;
    getSalesOverview: {
        label: string;
        date: string;
        sales: number;
        isActive: boolean;
    }[];
    getSalesByLocation: {
        cityCode: string;
        name: string;
        revenue: number;
        percentage: number;
        rank: number;
    }[];
    getTopSellingProducts: {
        id: string;
        name: string;
        quantitySold: number;
        percentage: number;
        rank: number;
    }[];
    recentSales: {
        data: {
            id: string;
            saleDate: string;
            totalAmount: number;
            paymentMethod: string | null;
            status: string;
            customer: {
                firstName: string | null;
                lastName: string | null;
            } | null;
        }[];
    };
    lowStockAlerts: {
        data: {
            id: string;
            productId: string;
            quantityOnHand: number;
            reorderLevel: number;
            stockStatus: string;
            product: {
                name: string;
                sku: string;
            };
        }[];
    };
}

export function useDashboardData(initialTimeRange: TimeRange = "daily") {
    const [timeRange, setTimeRange] = useState<TimeRange>(initialTimeRange);

    const { data, loading, error, refetch } = useQuery<DashboardDataResponse>(
        GET_DASHBOARD_DATA,
        {
            variables: {
                period: timeRange.toUpperCase(),
                locationInput: {
                    sort: "HIGH",
                    limit: 5,
                },
                productSort: "HIGH",
            },
            notifyOnNetworkStatusChange: true,
        }
    );

    const metrics: DashboardMetrics = data?.dashboardMetrics ?? {
        totalSales: 0,
        totalProducts: 0,
        totalCustomers: 0,
        totalUnitsInStock: 0,
    };

    // The frontend chart expects { label, value } instead of { label, date, sales, isActive }
    const salesChart: SalesChartPoint[] = (data?.getSalesOverview ?? []).map((point) => ({
        label: point.label,
        value: point.sales,
    }));

    // The backend uses quantitySold for products instead of revenue
    const topProducts: TopProductItem[] = (data?.getTopSellingProducts ?? []).map((p) => ({
        id: p.id,
        name: p.name,
        revenue: p.quantitySold, // Note: frontend component says "revenue" but it's quantitySold in backend
        percentage: p.percentage,
    }));

    const topLocations: TopLocationItem[] = (data?.getSalesByLocation ?? []).map((l) => ({
        id: l.cityCode,
        name: l.name,
        revenue: l.revenue,
        rawValue: l.revenue,
        percentage: l.percentage,
    }));

    // Format recent sales
    const recentSales: RecentSaleItem[] = (data?.recentSales?.data ?? []).map((s) => {
        const customerName = s.customer
            ? `${s.customer.firstName ?? ""} ${s.customer.lastName ?? ""}`.trim()
            : "Walk-in Customer";

        return {
            id: s.id,
            customer: customerName || "Walk-in Customer",
            quantity: 0, // Backend doesn't return total quantity in sale list by default, keep 0 or compute if added later
            amount: s.totalAmount,
            status: s.status,
        };
    });

    const lowStockAlerts: LowStockAlertItem[] = (data?.lowStockAlerts?.data ?? []).map((a) => ({
        id: a.id,
        productName: a.product.name,
        sku: a.product.sku,
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
