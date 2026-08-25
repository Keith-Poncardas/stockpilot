import React from 'react';
import { Filter, Calendar } from 'lucide-react';
import { DataTableToolbar } from '@/components/ui/data-table-toolbar';
import { SelectFilter } from '@/components/ui/select-filter';
import { DatePicker } from '@/components/ui/date-picker';
import { FilterPopover } from '@/components/FilterPopover';
import type { SaleTableToolbarProps } from './types';

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

    const datePickers = [
        {
            value: filters.dateFrom,
            onChange: handleDateFromChange,
            placeholder: "Start Date"
        },
        {
            value: filters.dateTo,
            onChange: handleDateToChange,
            placeholder: "End Date"
        }
    ];

    return (
        <DataTableToolbar
            searchQuery={search}
            setSearchQuery={setSearch}
            searchPlaceholder="Search by customer or cashier…"
            onRefresh={onRefresh}
            hasActiveFilters={hasActiveFilters}
            onResetFilters={onResetFilters}
        >
            <FilterPopover
                title="Status & Sort"
                description="Filter sales by status, payment and sort order."
                icon={Filter}
                contentClassName="w-96 p-4"
            >
                <div className="grid grid-cols-2 gap-3">
                    {filterOptions.map((filter, idx) => (
                        <SelectFilter
                            key={idx}
                            value={filter.value}
                            onChange={filter.onChange}
                            options={filter.options}
                            defaultValue={filter.defaultValue}
                            className="w-full h-8 text-xs lg:h-9 lg:text-sm border-slate-200"
                        />
                    ))}
                </div>
            </FilterPopover>

            <FilterPopover
                title="Date Range"
                description="Filter sales by transaction date."
                icon={Calendar}
                contentClassName="w-80 p-4"
            >
                <div className="grid grid-cols-2 gap-2 items-center">
                    {datePickers.map((dp, idx) => (
                        <DatePicker
                            key={idx}
                            value={dp.value}
                            onChange={dp.onChange}
                            placeholder={dp.placeholder}
                            className="w-full h-8 text-xs lg:h-9 lg:text-sm border-slate-200"
                        />
                    ))}
                </div>
                {dateError && <p className="text-xs text-red-500 font-medium mt-1">{dateError}</p>}
            </FilterPopover>
        </DataTableToolbar>
    );
});
