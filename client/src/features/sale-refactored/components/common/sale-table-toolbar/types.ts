import type React from 'react';

/**
 * Local state filters for managing active filters on the sales table.
 */
export interface ISaleFilters {
    status: string;
    paymentMethod: string;
    orderBy: string;
    orderDirection: string;
    dateFrom: string;
    dateTo: string;
};

export interface FilterOption {
    value: string;
    onChange: (value: string) => void;
    options: { label: string; value: string }[];
    defaultValue: string;
}
/**
 * Props for the SaleTableToolbar component.
 */
export interface SaleTableToolbarProps {
    search: string;
    setSearch: (value: string) => void;
    filters: ISaleFilters;
    setFilters: React.Dispatch<React.SetStateAction<ISaleFilters>>;
    filterOptions: FilterOption[];
    dateError: string | null;
    onRefresh: () => void;
    onResetFilters: () => void;
};
