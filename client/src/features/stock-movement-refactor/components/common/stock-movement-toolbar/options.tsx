import React from "react";
import type { SMFilters } from "@/features/stock-movement-refactor/types";

const toDateString = (val: string | Date | null | undefined): string => {
    if (!val) return "";
    if (val instanceof Date) return val.toISOString();
    return String(val);
};

/**
 * Generates configuration options for date picker inputs in the toolbar.
 */
export const getDatePickerOptions = (
    filters: SMFilters,
    setFilters: React.Dispatch<React.SetStateAction<SMFilters>>
) => [
    {
        value: filters.dateFrom,
        onChange: (val: string | Date | null | undefined) => setFilters(prev => ({ ...prev, dateFrom: toDateString(val) })),
        placeholder: "Start Date"
    },
    {
        value: filters.dateTo,
        onChange: (val: string | Date | null | undefined) => setFilters(prev => ({ ...prev, dateTo: toDateString(val) })),
        placeholder: "End Date"
    }
];

/**
 * Generates configuration options for quantity inputs in the toolbar.
 */
export const getQtyInputOptions = (
    filters: SMFilters,
    setFilters: React.Dispatch<React.SetStateAction<SMFilters>>
) => [
    {
        value: filters.minQty,
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => setFilters(prev => ({ ...prev, minQty: e.target.value })),
        placeholder: "Min Qty"
    },
    {
        value: filters.maxQty,
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => setFilters(prev => ({ ...prev, maxQty: e.target.value })),
        placeholder: "Max Qty"
    }
];
