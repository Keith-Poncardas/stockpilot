import type { SMFilters } from '@/features/stock-movement/types';
import React from 'react';

/**
 * Generates configuration options for date picker inputs in the toolbar.
 */
export const getDatePickerOptions = (
    filters: SMFilters,
    setFilters: React.Dispatch<React.SetStateAction<SMFilters>>
) => [
        {
            value: filters.dateFrom,
            onChange: (val: any) => setFilters(prev => ({ ...prev, dateFrom: val || "" })),
            placeholder: "Start Date"
        },
        {
            value: filters.dateTo,
            onChange: (val: any) => setFilters(prev => ({ ...prev, dateTo: val || "" })),
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
