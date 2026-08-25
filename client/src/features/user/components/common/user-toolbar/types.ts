import type { UserFilters } from "../../../types";

/**
 * Props for the UserTableToolbar component.
 * 
 * @param search - The current search query string.
 * @param setSearch - Callback function to update the search query.
 * @param filters - Current filter state object.
 * @param setFilters - Callback function to update the filters state.
 * @param filterOptions - Array of filter configuration options for rendering.
 * @param dateError - Any error message related to date filtering.
 * @param onRefresh - Callback function to handle data refresh action.
 * @param onResetFilters - Callback function to clear all active filters.
 */
export interface UserTableToolbarProps {
    search: string;
    setSearch: (value: string) => void;
    filters: UserFilters;
    setFilters: React.Dispatch<React.SetStateAction<UserFilters>>;
    filterOptions: any[];
    dateError: string | null;
    onRefresh: () => void;
    onResetFilters: () => void;
}