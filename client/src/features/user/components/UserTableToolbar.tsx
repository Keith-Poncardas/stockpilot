import React from 'react';
import { Filter, Calendar } from 'lucide-react';
import { DataTableToolbar } from '@/components/ui/data-table-toolbar';
import { SelectFilter } from '@/components/ui/select-filter';
import { DatePicker } from '@/components/ui/date-picker';
import { FilterPopover } from '@/components/FilterPopover';
import type { UserFilters } from '../types';

interface UserTableToolbarProps {
    search: string;
    setSearch: (value: string) => void;
    filters: UserFilters;
    setFilters: React.Dispatch<React.SetStateAction<UserFilters>>;
    filterOptions: any[];
    dateError: string | null;
    onRefresh: () => void;
    onResetFilters: () => void;
}

export const UserTableToolbar = React.memo(function UserTableToolbar({
    search,
    setSearch,
    filters,
    setFilters,
    filterOptions,
    dateError,
    onRefresh,
    onResetFilters
}: UserTableToolbarProps) {

    const hasActiveFilters = !!(
        filters.role ||
        filters.status ||
        filters.dateFrom ||
        filters.dateTo ||
        filters.acsDesc ||
        filters.approvalStatus ||
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
            placeholder: "Oldest"
        }
    ];

    return (
        <DataTableToolbar
            searchQuery={search}
            setSearchQuery={setSearch}
            searchPlaceholder="Search users..."
            onRefresh={onRefresh}
            hasActiveFilters={hasActiveFilters}
            onResetFilters={onResetFilters}
        >
            <FilterPopover
                title="Role & Status"
                description="Filter users by role and status."
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
                description="Filter users by creation date."
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
                {dateError && <p className="text-xs text-red-500 font-medium">{dateError}</p>}
            </FilterPopover>
        </DataTableToolbar>
    );
});
