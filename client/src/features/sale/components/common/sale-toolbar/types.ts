import type React from 'react';
import type { ISaleFilters } from "../../../types";

/**
 * Props for the SaleTableToolbar component.
 */
export interface SaleTableToolbarProps {
    search: string;
    setSearch: (value: string) => void;
    filters: ISaleFilters;
    setFilters: React.Dispatch<React.SetStateAction<ISaleFilters>>;
    filterOptions: any[];
    dateError: string | null;
    onRefresh: () => void;
    onResetFilters: () => void;
}
