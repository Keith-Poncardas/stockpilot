import React from 'react';
import { Filter, SlidersHorizontal } from 'lucide-react';
import { DataTableToolbar } from '@/components/ui/data-table-toolbar';
import { FilterPopover } from '@/components/FilterPopover';
import { SelectFilter } from '@/components/ui/select-filter';
import { DatePicker } from '@/components/ui/date-picker';
import {
    PRODUCT_STATUS_OPTIONS,
    PRODUCT_ORDER_BY_OPTIONS,
    PRODUCT_ORDER_DIRECTION_OPTIONS,
} from '../../../constants';

interface ProductTableToolbarProps {
    globalFilter: string;
    setGlobalFilter: (val: string) => void;
    statusFilter: string;
    setStatusFilter: (val: string) => void;
    orderByFilter: string;
    setOrderByFilter: (val: string) => void;
    orderDirectionFilter: string;
    setOrderDirectionFilter: (val: string) => void;
    dateFrom: string;
    setDateFrom: (val: string) => void;
    dateTo: string;
    setDateTo: (val: string) => void;
    dateError: string | null;
    minPrice: string;
    setMinPrice: (val: string) => void;
    maxPrice: string;
    setMaxPrice: (val: string) => void;
    priceError: string | null;
    hasActiveFilters: boolean;
    onRefresh: () => void;
    onResetFilters: () => void;
}

export const ProductTableToolbar = React.memo(function ProductTableToolbar({
    globalFilter,
    setGlobalFilter,
    statusFilter,
    setStatusFilter,
    orderByFilter,
    setOrderByFilter,
    orderDirectionFilter,
    setOrderDirectionFilter,
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,
    dateError,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,
    priceError,
    hasActiveFilters,
    onRefresh,
    onResetFilters,
}: ProductTableToolbarProps) {
    return (
        <DataTableToolbar
            searchQuery={globalFilter}
            setSearchQuery={setGlobalFilter}
            searchPlaceholder="Search products..."
            onRefresh={onRefresh}
            hasActiveFilters={hasActiveFilters}
            onResetFilters={onResetFilters}
        >
            <FilterPopover
                title="Status & Sort"
                description="Filter products by status and sort order."
                icon={Filter}
                contentClassName="w-96 p-4"
            >
                <div className="grid grid-cols-2 gap-3">
                    <SelectFilter
                        value={statusFilter}
                        onChange={setStatusFilter}
                        options={PRODUCT_STATUS_OPTIONS}
                        defaultValue="all"
                        placeholder="All Statuses"
                        className="w-full h-8 text-xs lg:h-9 lg:text-sm border-slate-200"
                    />
                    <SelectFilter
                        value={orderByFilter}
                        onChange={setOrderByFilter}
                        options={PRODUCT_ORDER_BY_OPTIONS}
                        defaultValue="createdAt"
                        className="w-full h-8 text-xs lg:h-9 lg:text-sm border-slate-200"
                    />
                    <SelectFilter
                        value={orderDirectionFilter}
                        onChange={setOrderDirectionFilter}
                        options={PRODUCT_ORDER_DIRECTION_OPTIONS}
                        defaultValue="desc"
                        className="w-full h-8 text-xs lg:h-9 lg:text-sm border-slate-200 col-span-2"
                    />
                </div>
            </FilterPopover>

            <FilterPopover
                title="Date & Price Range"
                description="Filter products by date created and unit price."
                icon={SlidersHorizontal}
                contentClassName="w-80 p-4"
            >
                {/* Date Range */}
                <div className="flex flex-col gap-1.5">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Date Created
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
                    {dateError && <p className="text-xs text-red-500 font-medium">{dateError}</p>}
                </div>

                {/* Price Range */}
                <div className="flex flex-col gap-1.5 mt-3">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Unit Price
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                        <input
                            type="number"
                            min={0}
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                            placeholder="Min (₱)"
                            className="w-full h-8 lg:h-9 rounded-md border border-slate-200 px-3 text-xs lg:text-sm focus:outline-none focus:ring-1 focus:ring-slate-300"
                        />
                        <input
                            type="number"
                            min={0}
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                            placeholder="Max (₱)"
                            className="w-full h-8 lg:h-9 rounded-md border border-slate-200 px-3 text-xs lg:text-sm focus:outline-none focus:ring-1 focus:ring-slate-300"
                        />
                    </div>
                    {priceError && <p className="text-xs text-red-500 font-medium">{priceError}</p>}
                </div>
            </FilterPopover>
        </DataTableToolbar>
    );
});
