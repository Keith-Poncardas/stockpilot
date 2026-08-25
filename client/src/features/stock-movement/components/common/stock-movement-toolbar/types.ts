import type { SMFilters } from "@/features/stock-movement/types";


/**
 * Props for the StockMovementTableToolbar component.
 * Configures the search, filters, and actions for the stock movement data table.
 */
export interface StockMovementTableToolbarProps {
    search: string;
    setSearch: (val: string) => void;
    filters: SMFilters;
    setFilters: React.Dispatch<React.SetStateAction<SMFilters>>;
    filterOptions: any[];
    dateError: string | null;
    qtyError: string | null;
    onRefresh: () => void;
    onResetFilters: () => void;
};