import React from 'react';
import { Filter, SlidersHorizontal } from 'lucide-react';
import { DataTableToolbar } from '@/components/ui/data-table-toolbar';
import { SelectFilter } from '@/components/ui/select-filter';
import { DatePicker } from '@/components/ui/date-picker';
import { FilterPopover } from '@/components/FilterPopover';
import { Input } from '@/components/ui/input';
import type { StockMovementTableToolbarProps } from './types';
import { getDatePickerOptions, getQtyInputOptions } from './options';

/**
 * Toolbar component for the Stock Movement data table.
 *
 * Provides a consolidated interface for searching, filtering by type/sort,
 * selecting a date range, and filtering by quantity range. It utilizes
 * memoized option factories to prevent unnecessary re-renders.
 *
 * @param {StockMovementTableToolbarProps} props - The toolbar properties including filter states and action callbacks.
 * @returns {JSX.Element} The rendered toolbar component.
 */
export const StockMovementTableToolbar = React.memo(function StockMovementTableToolbar({
    search,
    setSearch,
    filters,
    setFilters,
    filterOptions,
    dateError,
    qtyError,
    onRefresh,
    onResetFilters
}: StockMovementTableToolbarProps) {

    const hasActiveFilters = !!(
        filters.movementTypeFilter ||
        filters.dateFrom ||
        filters.dateTo ||
        filters.minQty ||
        filters.maxQty ||
        filters.orderByFilter ||
        filters.orderDirectionFilter ||
        search
    );

    const datePickers = React.useMemo(() => getDatePickerOptions(
        filters,
        setFilters
    ), [filters.dateFrom, filters.dateTo, setFilters]);

    const qtyInputs = React.useMemo(() => getQtyInputOptions(
        filters,
        setFilters
    ), [filters.minQty, filters.maxQty, setFilters]);

    return (
        <DataTableToolbar
            searchQuery={search}
            setSearchQuery={setSearch}
            searchPlaceholder="Search product name or SKU..."
            onRefresh={onRefresh}
            hasActiveFilters={hasActiveFilters}
            onResetFilters={onResetFilters}
        >
            <FilterPopover
                title="Type & Sort"
                description="Filter movements by type and sort order."
                icon={Filter}
                contentClassName="w-96 p-4"
            >
                <div className="grid grid-cols-2 gap-3">
                    {filterOptions.map((opt, idx) => (
                        <SelectFilter
                            key={idx}
                            value={opt.value}
                            onChange={opt.onChange}
                            options={opt.options}
                            defaultValue={opt.defaultValue}
                            placeholder={opt.placeholder}
                            className={opt.className}
                        />
                    ))}
                </div>
            </FilterPopover>

            <FilterPopover
                title="Date & Quantity Range"
                description="Filter stock movements by date and quantity range."
                icon={SlidersHorizontal}
                contentClassName="w-80 p-4"
            >
                {/* Date Range */}
                <div className="flex flex-col gap-1.5">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Date Created</p>
                    <div className="grid grid-cols-2 gap-2">
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
                    {dateError && <p className="text-xs text-red-500 font-medium">{dateError}</p>}
                </div>

                {/* Quantity Range */}
                <div className="flex flex-col gap-1.5 mt-2">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Quantity Range</p>
                    <div className="grid grid-cols-2 gap-2">
                        {qtyInputs.map((inputProps, idx) => (
                            <Input
                                key={idx}
                                type="number"
                                min={0}
                                value={inputProps.value}
                                onChange={inputProps.onChange}
                                placeholder={inputProps.placeholder}
                                className="h-8 lg:h-9 text-xs lg:text-sm border-slate-200"
                            />
                        ))}
                    </div>
                    {qtyError && <p className="text-xs text-red-500 font-medium">{qtyError}</p>}
                </div>
            </FilterPopover>
        </DataTableToolbar>
    );
});
