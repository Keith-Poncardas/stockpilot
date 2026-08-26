import React from 'react';
import { DataTableToolbar } from '@/components/ui/data-table-toolbar';
import { FilterPopover } from '@/components/FilterPopover';
import { SelectFilter } from '@/components/ui/select-filter';
import { DatePicker } from '@/components/ui/date-picker';
import { Filter, SlidersHorizontal } from 'lucide-react';

interface CustomerTableToolbarProps {
    globalFilter: string;
    setGlobalFilter: (val: string) => void;
    orderByFilter: string;
    setOrderByFilter: (val: string) => void;
    orderDirectionFilter: string;
    setOrderDirectionFilter: (val: string) => void;
    dateFrom: string;
    setDateFrom: (val: string) => void;
    dateTo: string;
    setDateTo: (val: string) => void;
    dateError: string | null;
    hasActiveFilters: boolean;
    onRefresh: () => void;
    onResetFilters: () => void;
}

const orderByOptions = [
    { value: 'createdAt', label: 'Date Registered' },
    { value: 'firstName', label: 'First Name' },
    { value: 'lastName',  label: 'Last Name' },
];

const orderDirectionOptions = [
    { value: 'desc', label: 'Latest First' },
    { value: 'asc',  label: 'Oldest First' },
];

export const CustomerTableToolbar = React.memo(function CustomerTableToolbar({
    globalFilter,
    setGlobalFilter,
    orderByFilter,
    setOrderByFilter,
    orderDirectionFilter,
    setOrderDirectionFilter,
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,
    dateError,
    hasActiveFilters,
    onRefresh,
    onResetFilters
}: CustomerTableToolbarProps) {

    return (
        <DataTableToolbar
            searchQuery={globalFilter}
            setSearchQuery={setGlobalFilter}
            searchPlaceholder="Search customers…"
            onRefresh={onRefresh}
            hasActiveFilters={hasActiveFilters}
            onResetFilters={onResetFilters}
        >
            {/* Sort */}
            <FilterPopover
                title="Sort"
                description="Sort customers by field and direction."
                icon={Filter}
                contentClassName="w-80 p-4"
            >
                <div className="grid grid-cols-2 gap-3">
                    <SelectFilter
                        value={orderByFilter}
                        onChange={setOrderByFilter}
                        options={orderByOptions}
                        defaultValue="createdAt"
                        className="w-full h-8 text-xs lg:h-9 lg:text-sm border-slate-200"
                    />
                    <SelectFilter
                        value={orderDirectionFilter}
                        onChange={setOrderDirectionFilter}
                        options={orderDirectionOptions}
                        defaultValue="desc"
                        className="w-full h-8 text-xs lg:h-9 lg:text-sm border-slate-200"
                    />
                </div>
            </FilterPopover>

            {/* Date range */}
            <FilterPopover
                title="Date Range"
                description="Filter customers by their registration date."
                icon={SlidersHorizontal}
                contentClassName="w-72 p-4"
            >
                <div className="flex flex-col gap-1.5">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Customer Since
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                        <DatePicker
                            value={dateFrom}
                            onChange={setDateFrom}
                            placeholder="Start Date"
                            className="w-full h-8 text-xs lg:h-9 lg:text-sm border-slate-200"
                        />
                        <DatePicker
                            value={dateTo}
                            onChange={setDateTo}
                            placeholder="End Date"
                            className="w-full h-8 text-xs lg:h-9 lg:text-sm border-slate-200"
                        />
                    </div>
                    {dateError && (
                        <p className="text-xs text-red-500 font-medium">{dateError}</p>
                    )}
                </div>
            </FilterPopover>
        </DataTableToolbar>
    );
});
