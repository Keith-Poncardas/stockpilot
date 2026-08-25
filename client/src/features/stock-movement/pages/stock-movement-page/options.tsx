import React from 'react';
import type { SMFilters } from "../../types";
import { ArrowDownRight, ArrowUpRight, SlidersHorizontal, AlertTriangle } from 'lucide-react';

/**
 * Options for filtering stock movements by their movement type.
 */
export const movementTypeOptions = [
    { value: "all", label: "All Movement Types" },
    { value: "IN", label: "Stock In (IN)" },
    { value: "OUT", label: "Stock Out (OUT)" },
    { value: "ADJUSTMENT", label: "Adjustment" },
];

/**
 * Options for sorting stock movements by different fields.
 */
export const orderByOptions = [
    { value: "createdAt", label: "Date Created" },
    { value: "quantity", label: "Quantity" },
];

/**
 * Options for the direction of sorting.
 */
export const orderDirectionOptions = [
    { value: "desc", label: "Latest / Highest" },
    { value: "asc", label: "Oldest / Lowest" },
];

/**
 * Generates the filter options configuration array for the stock movement toolbar.
 * 
 * @param filters - The current state of the stock movement filters.
 * @param setFilters - The state setter function to update the filters.
 * @returns An array of configuration objects for rendering filter select inputs.
 */
export const getFilterOptions = (
    filters: SMFilters,
    setFilters: React.Dispatch<React.SetStateAction<SMFilters>>
) => [
        {
            value: filters.movementTypeFilter,
            onChange: (val: string) => setFilters(prev => ({ ...prev, movementTypeFilter: val })),
            options: movementTypeOptions,
            className: "w-full h-8 text-xs lg:h-9 lg:text-sm border-slate-200"
        },
        {
            value: filters.orderByFilter,
            onChange: (val: string) => setFilters(prev => ({ ...prev, orderByFilter: val })),
            options: orderByOptions,
            defaultValue: "createdAt",
            className: "w-full h-8 text-xs lg:h-9 lg:text-sm border-slate-200"
        },
        {
            value: filters.orderDirectionFilter,
            onChange: (val: string) => setFilters(prev => ({ ...prev, orderDirectionFilter: val })),
            options: orderDirectionOptions,
            defaultValue: "desc",
            className: "w-full h-8 text-xs lg:h-9 lg:text-sm border-slate-200 col-span-2"
        }
    ];

/**
 * Generates configuration options for displaying metric cards on the stock movement dashboard.
 * 
 * @param metrics - The fetched metrics data containing totals for different stock movement categories.
 * @returns An array of configuration objects for rendering metric cards.
 */
export const getMetricCardOptions = (metrics: any) => [
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

/**
 * Builds the GraphQL variables object for the stock movement paginated query.
 * 
 * @param params - Object containing the current query parameters (page, limit) and raw filters.
 * @param validationState - Object containing validation errors and parsed date values.
 * @returns The structured variables object to pass to the GraphQL query.
 */
export const buildStockMovementVariables = (
    { queryParams, filters }: { queryParams: any; filters: any },
    {
        dateError,
        qtyError,
        dateFrom,
        dateTo
    }: {
        dateError: string | null;
        qtyError: string | null;
        dateFrom?: string | Date | null;
        dateTo?: string | Date | null;
    }
) => ({
    args: {
        page: queryParams.page,
        limit: queryParams.limit,
        filter: {
            search: filters.search || undefined,
            movementType: filters.movementTypeFilter && filters.movementTypeFilter !== "all" ? filters.movementTypeFilter : undefined,
            dateFrom: dateError ? undefined : (dateFrom || undefined),
            dateTo: dateError ? undefined : (dateTo || undefined),
            minQty: qtyError ? undefined : (filters.debouncedMinQty ? Number(filters.debouncedMinQty) : undefined),
            maxQty: qtyError ? undefined : (filters.debouncedMaxQty ? Number(filters.debouncedMaxQty) : undefined),
            orderBy: filters.orderByFilter || (queryParams.orderBy || "createdAt"),
            orderDirection: filters.orderDirectionFilter || (queryParams.orderDirection || "desc"),
        },
    }
});
