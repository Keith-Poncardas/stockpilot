import type { Dispatch, SetStateAction } from "react";
import type { SMFilters } from "@/features/stock-movement-refactor/types";

export interface FilterOptionItem {
    value: string | undefined;
    onChange: (val: string) => void;
    options: { label: string; value: string }[];
    defaultValue?: string;
    placeholder?: string;
    className?: string;
}

/**
 * Props for the StockMovementTableToolbar component.
 * Configures the search, filters, and actions for the stock movement data table.
 */
export interface StockMovementTableToolbarProps {
    search: string;
    setSearch: (val: string) => void;
    filters: SMFilters;
    setFilters: Dispatch<SetStateAction<SMFilters>>;
    filterOptions: FilterOptionItem[];
    dateError: string | null;
    qtyError: string | null;
    onRefresh: () => void;
    onResetFilters: () => void;
}
