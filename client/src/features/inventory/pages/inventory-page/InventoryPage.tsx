import {
    Warehouse,
    Filter,
    CheckCircle2,
    AlertTriangle,
    XCircle,
    ServerCrash,
    SlidersHorizontal,
    PackagePlus,
    History,
} from 'lucide-react';
import { DataTableLayout } from '@/components/ui/data-table-layout';
import { DataTableToolbar } from '@/components/ui/data-table-toolbar';
import { SelectFilter } from '@/components/ui/select-filter';
import SectionHeader from '@/components/SectionHeader';
import { FilterPopover } from '@/components/FilterPopover';
import { EmptyState } from '@/components/ui/empty-state';
import { MetricCard } from '@/components/MetricCard';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { PATHS } from '@/routes';
import { useCreateInventorySheet } from '../../components';
import { useInventoryTable } from './hooks';
import { inventoryToolbarConfig } from './config';

export function InventoryPage() {
    const navigate = useNavigate();
    const { onOpen: openCreateSheet } = useCreateInventorySheet();

    const {
        table,
        loading,
        error,
        isEmpty,
        refresh,
        hasActiveFilters,
        resetFilters,
        globalFilter,
        setGlobalFilter,
        stockStatusFilter,
        setStockStatusFilter,
        orderByFilter,
        setOrderByFilter,
        orderDirectionFilter,
        setOrderDirectionFilter,
        minQty,
        setMinQty,
        maxQty,
        setMaxQty,
        qtyError,
        statuses,
    } = useInventoryTable();

    return (
        <>
            <SectionHeader
                title="Inventory"
                subtitle="Monitor real-time stock levels, movements, and track reorder alerts"
                icon={Warehouse}
                actions={
                    <div className="flex items-center gap-2.5">
                        <Button
                            onClick={() => navigate(PATHS.stockMovement.root)}
                            size="lg"
                            variant="outline"
                            className="bg-transparent text-slate-600 hover:text-slate-900"
                        >
                            <History className="mr-1.5 h-4 w-4 text-slate-500" />
                            Stock Movement Log
                        </Button>
                        <Button onClick={openCreateSheet} size="lg">
                            <PackagePlus className="mr-1.5 h-4 w-4" />
                            Record Inventory
                        </Button>
                    </div>
                }
            />

            {/* ── Metric Cards ─────────────────────────────────────────────── */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <MetricCard
                    value={statuses?.wellStocked !== undefined ? statuses.wellStocked.toLocaleString() : '—'}
                    label="Well Stocked"
                    icon={<CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                    iconContainerClass="bg-emerald-50 text-emerald-600"
                />
                <MetricCard
                    value={statuses?.lowStock !== undefined ? statuses.lowStock.toLocaleString() : '—'}
                    label="Low Stock"
                    icon={<AlertTriangle className="w-5 h-5 text-amber-600" />}
                    iconContainerClass="bg-amber-50 text-amber-600"
                />
                <MetricCard
                    value={statuses?.criticalOut !== undefined ? statuses.criticalOut.toLocaleString() : '—'}
                    label="Critical / Out of Stock"
                    icon={<XCircle className="w-5 h-5 text-rose-600" />}
                    iconContainerClass="bg-rose-50 text-rose-600"
                />
            </div>

            {/* ── Toolbar ──────────────────────────────────────────────────── */}
            <DataTableToolbar
                searchQuery={globalFilter}
                setSearchQuery={setGlobalFilter}
                searchPlaceholder={inventoryToolbarConfig.searchPlaceholder}
                onRefresh={refresh}
                hasActiveFilters={hasActiveFilters}
                onResetFilters={resetFilters}
            >
                <FilterPopover
                    title="Status & Sort"
                    description="Filter inventory items by status and sort criteria."
                    icon={Filter}
                    contentClassName="w-96 p-4"
                >
                    <div className="grid grid-cols-2 gap-3">
                        <SelectFilter
                            value={stockStatusFilter}
                            onChange={setStockStatusFilter}
                            options={inventoryToolbarConfig.stockStatusOptions}
                            className="w-full h-8 text-xs lg:h-9 lg:text-sm border-slate-200 col-span-2"
                        />
                        <SelectFilter
                            value={orderByFilter}
                            onChange={(val) => setOrderByFilter(val as import('@/features/inventory/types').InventoryOrderBy)}
                            options={inventoryToolbarConfig.orderByOptions}
                            defaultValue="updatedAt"
                            className="w-full h-8 text-xs lg:h-9 lg:text-sm border-slate-200"
                        />
                        <SelectFilter
                            value={orderDirectionFilter}
                            onChange={setOrderDirectionFilter}
                            options={inventoryToolbarConfig.orderDirectionOptions}
                            defaultValue="desc"
                            className="w-full h-8 text-xs lg:h-9 lg:text-sm border-slate-200"
                        />
                    </div>
                </FilterPopover>

                <FilterPopover
                    title="Quantity Range"
                    description="Filter products by quantity on hand range."
                    icon={SlidersHorizontal}
                    contentClassName="w-72 p-4"
                >
                    <div className="flex flex-col gap-1.5">
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                            Qty on Hand
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                            <input
                                type="number"
                                min={0}
                                value={minQty}
                                onChange={(e) => setMinQty(e.target.value)}
                                placeholder="Min"
                                className="w-full h-8 lg:h-9 rounded-md border border-slate-200 px-3 text-xs lg:text-sm font-mono focus:outline-none focus:ring-1 focus:ring-slate-300"
                            />
                            <input
                                type="number"
                                min={0}
                                value={maxQty}
                                onChange={(e) => setMaxQty(e.target.value)}
                                placeholder="Max"
                                className="w-full h-8 lg:h-9 rounded-md border border-slate-200 px-3 text-xs lg:text-sm font-mono focus:outline-none focus:ring-1 focus:ring-slate-300"
                            />
                        </div>
                        {qtyError && (
                            <p className="text-xs text-rose-500 font-medium">{qtyError}</p>
                        )}
                    </div>
                </FilterPopover>
            </DataTableToolbar>

            {/* ── Data Table ───────────────────────────────────────────────── */}
            <DataTableLayout
                table={table}
                isLoading={loading}
                error={error}
                isEmpty={isEmpty}
                errorState={
                    <EmptyState
                        title="Something went wrong"
                        description="Failed to load inventory records. Please check your network or try again."
                        icon={ServerCrash}
                    />
                }
            />
        </>
    );
}
