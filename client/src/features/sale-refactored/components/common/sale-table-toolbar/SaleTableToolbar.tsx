import React from 'react';
import { DataTableToolbar } from '@/components/ui/data-table-toolbar';
import { FilterPopover } from '@/components/FilterPopover';
import type { SaleTableToolbarProps } from './types';
import { buildDatePicker, buildSaleFilter } from './config';

/**
 * Toolbar component for the Sales data table.
 * 
 * Provides search, filtering (by status, payment method, etc.), date range selection, 
 * and refresh/reset functionalities. It is memoized to prevent unnecessary re-renders.
 * 
 * @param {SaleTableToolbarProps} props - The toolbar properties including filter states and action callbacks.
 * @returns {JSX.Element} The rendered toolbar component.
 */
export const SaleTableToolbar = React.memo(function SaleTableToolbar({
    search,
    setSearch,
    filters,
    setFilters,
    filterOptions,
    dateError,
    onRefresh,
    onResetFilters
}: SaleTableToolbarProps) {

    const hasActiveFilters = !!(
        filters.status ||
        filters.paymentMethod ||
        filters.dateFrom ||
        filters.dateTo ||
        filters.orderBy ||
        filters.orderDirection ||
        search
    );

    const handleDateFromChange = React.useCallback((val: any) => {
        setFilters(prev => ({ ...prev, dateFrom: val }));
    }, [setFilters]);

    const handleDateToChange = React.useCallback((val: any) => {
        setFilters(prev => ({ ...prev, dateTo: val }));
    }, [setFilters]);

    const datePickers = buildDatePicker(
        filters,
        handleDateFromChange,
        handleDateToChange
    );

    const popovers = buildSaleFilter(filterOptions, datePickers, dateError);

    return (
        <DataTableToolbar
            searchQuery={search}
            setSearchQuery={setSearch}
            searchPlaceholder="Search by customer or cashier…"
            onRefresh={onRefresh}
            hasActiveFilters={hasActiveFilters}
            onResetFilters={onResetFilters}
        >
            {popovers.map((popover, idx) => (
                <FilterPopover
                    key={idx}
                    title={popover.title}
                    description={popover.description}
                    icon={popover.icon}
                    contentClassName={popover.contentClassName}
                >
                    {popover.children}
                </FilterPopover>
            ))}
        </DataTableToolbar>
    );
});
