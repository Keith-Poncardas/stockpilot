import React from 'react';
import type { SMFilters } from "@/features/stock-movement-refactor/types";

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
 */
export const getFilterOptions = (
    filters: SMFilters,
    setFilters: React.Dispatch<React.SetStateAction<SMFilters>>
) => [
    {
        value: filters.movementTypeFilter,
        onChange: (val: string) => setFilters(prev => ({ ...prev, movementTypeFilter: val })),
        options: movementTypeOptions,
        defaultValue: "all",
        placeholder: "All Movement Types",
        className: "w-full h-8 text-xs lg:h-9 lg:text-sm border-slate-200"
    },
    {
        value: filters.orderByFilter,
        onChange: (val: string) => setFilters(prev => ({ ...prev, orderByFilter: val })),
        options: orderByOptions,
        defaultValue: "createdAt",
        placeholder: "Date Created",
        className: "w-full h-8 text-xs lg:h-9 lg:text-sm border-slate-200"
    },
    {
        value: filters.orderDirectionFilter,
        onChange: (val: string) => setFilters(prev => ({ ...prev, orderDirectionFilter: val })),
        options: orderDirectionOptions,
        defaultValue: "desc",
        placeholder: "Latest / Highest",
        className: "w-full h-8 text-xs lg:h-9 lg:text-sm border-slate-200 col-span-2"
    }
];
