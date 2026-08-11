import * as React from "react";
import { useQuery } from "@apollo/client";
import {
    AlertTriangle,
    ArrowDownRight,
    ArrowUpDown,
    ArrowUpRight,
    Filter,
    Plus,
    ServerCrash,
    SlidersHorizontal,
} from "lucide-react";
import { columns } from "../stock-movement.columns";
import type { IStockMovement } from "../stock-movement.types";
import { GET_ALL_STOCK_MOVEMENTS, GET_STOCK_MOVEMENT_DASHBOARD_METRICS } from "../operations";
import { useDebounce } from "@/hooks/useDebounce";
import { useDataTable } from "@/hooks/useDataTable";
import { DataTableLayout } from "@/components/ui/data-table-layout";
import { DataTableToolbar } from "@/components/ui/data-table-toolbar";
import { SelectFilter } from "@/components/ui/select-filter";
import { DatePicker } from "@/components/ui/date-picker";
import { Button } from "@/components/ui/button";
import SectionHeader from "@/components/SectionHeader";
import { FilterPopover } from "@/components/FilterPopover";
import { EmptyState } from "@/components/ui/empty-state";
import { MetricCard } from "@/components/MetricCard";
import { useNavigate } from "react-router-dom";

const movementTypeOptions = [
    { value: "all", label: "All Movement Types" },
    { value: "IN", label: "Stock In (IN)" },
    { value: "OUT", label: "Stock Out (OUT)" },
    { value: "ADJUSTMENT", label: "Adjustment" },
];

const orderByOptions = [
    { value: "createdAt", label: "Date Created" },
    { value: "quantity", label: "Quantity" },
];

const orderDirectionOptions = [
    { value: "desc", label: "Latest / Highest" },
    { value: "asc", label: "Oldest / Lowest" },
];

export function StockMovementPage() {
    // 1. Search state
    const [globalFilter, setGlobalFilter] = React.useState("");
    const debouncedSearch = useDebounce(globalFilter, 500);

    // 2. Filter states
    const [movementTypeFilter, setMovementTypeFilter] = React.useState<string>("");
    const [orderByFilter, setOrderByFilter] = React.useState<string>("");
    const [orderDirectionFilter, setOrderDirectionFilter] = React.useState<string>("");
    const [dateFrom, setDateFrom] = React.useState<string>("");
    const [dateTo, setDateTo] = React.useState<string>("");
    const [minQty, setMinQty] = React.useState<string>("");
    const [maxQty, setMaxQty] = React.useState<string>("");

    const debouncedMinQty = useDebounce(minQty, 500);
    const debouncedMaxQty = useDebounce(maxQty, 500);

    const dateError = dateFrom && dateTo && new Date(dateFrom) > new Date(dateTo)
        ? "Start Date must be before or equal to End Date"
        : null;

    const qtyError = debouncedMinQty && debouncedMaxQty && Number(debouncedMinQty) > Number(debouncedMaxQty)
        ? "Min quantity must be less than or equal to max quantity"
        : null;

    // 3. Extract query parameters from data table hook
    const { table, queryParams, setQueryData, setPagination } = useDataTable<IStockMovement, unknown>({
        columns,
        initialPageSize: 10,
    });

    // Reset pagination when filters change
    React.useEffect(() => {
        setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    }, [
        debouncedSearch,
        movementTypeFilter,
        dateFrom,
        dateTo,
        debouncedMinQty,
        debouncedMaxQty,
        orderByFilter,
        orderDirectionFilter,
        setPagination,
    ]);

    // 4. API Requests
    const { loading, error, refetch, data } = useQuery(GET_ALL_STOCK_MOVEMENTS, {
        variables: {
            args: {
                page: queryParams.page,
                limit: queryParams.limit,
                filter: {
                    search: debouncedSearch || undefined,
                    movementType: movementTypeFilter && movementTypeFilter !== "all" ? movementTypeFilter : undefined,
                    dateFrom: dateError ? undefined : (dateFrom || undefined),
                    dateTo: dateError ? undefined : (dateTo || undefined),
                    minQty: qtyError ? undefined : (debouncedMinQty ? Number(debouncedMinQty) : undefined),
                    maxQty: qtyError ? undefined : (debouncedMaxQty ? Number(debouncedMaxQty) : undefined),
                    orderBy: orderByFilter || (queryParams.orderBy || "createdAt"),
                    orderDirection: orderDirectionFilter || (queryParams.orderDirection || "desc"),
                },
            },
        },
        fetchPolicy: "cache-and-network",
        notifyOnNetworkStatusChange: true,
    });

    const { data: metricsData } = useQuery(GET_STOCK_MOVEMENT_DASHBOARD_METRICS, {
        fetchPolicy: "cache-and-network",
        notifyOnNetworkStatusChange: true,
    });

    const metrics = metricsData?.getStockMovementDashboardMetrics;

    React.useEffect(() => {
        if (data?.getStockMovements) {
            setQueryData({
                data: data.getStockMovements.data,
                meta: data.getStockMovements.meta,
            });
        }
    }, [data, setQueryData]);

    const isEmpty = !loading && !error && table.getRowModel().rows?.length === 0;

    function refresh() {
        refetch();
        setGlobalFilter("");
    }

    const hasActiveFilters = !!(
        movementTypeFilter ||
        dateFrom ||
        dateTo ||
        minQty ||
        maxQty ||
        orderByFilter ||
        orderDirectionFilter ||
        globalFilter
    );

    function resetFilters() {
        setMovementTypeFilter("");
        setOrderByFilter("");
        setOrderDirectionFilter("");
        setDateFrom("");
        setDateTo("");
        setMinQty("");
        setMaxQty("");
        setGlobalFilter("");
    }

    const navigate = useNavigate();

    function handleRecordMovement() {
        navigate("/inventory/record");
    }

    return (
        <>
            <SectionHeader
                title="Stock Movements"
                subtitle="Manage and track all stock adjustments in your warehouse."
                icon={ArrowUpDown}
                actions={
                    <Button size="lg" onClick={handleRecordMovement}>
                        <Plus data-icon="inline-start" />
                        Record Movement
                    </Button>
                }
            />

            {/* Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard
                    value={metrics?.totalStockIn?.toLocaleString() ?? "-"}
                    label="Total Stock In"
                    icon={<ArrowDownRight className="w-5 h-5" />}
                    iconContainerClass="bg-emerald-50 text-emerald-600"

                />
                <MetricCard
                    value={metrics?.totalStockOut?.toLocaleString() ?? "-"}
                    label="Total Stock Out"
                    icon={<ArrowUpRight className="w-5 h-5" />}
                    iconContainerClass="bg-blue-50 text-blue-600"

                />
                <MetricCard
                    value={metrics?.totalStockAdjustments?.toLocaleString() ?? "-"}
                    label="Total Adjustments"
                    icon={<SlidersHorizontal className="w-5 h-5" />}
                    iconContainerClass="bg-purple-50 text-purple-600"

                />
                <MetricCard
                    value={metrics?.lowStockProducts?.toLocaleString() ?? "-"}
                    label="Low Stock Products"
                    icon={<AlertTriangle className="w-5 h-5" />}
                    iconContainerClass="bg-amber-50 text-amber-600"

                />
            </div>

            {/* Toolbar & Filters */}
            <DataTableToolbar
                searchQuery={globalFilter}
                setSearchQuery={setGlobalFilter}
                searchPlaceholder="Search product name or SKU..."
                onRefresh={refresh}
                hasActiveFilters={hasActiveFilters}
                onResetFilters={resetFilters}
            >
                <FilterPopover
                    title="Type & Sort"
                    description="Filter movements by type and sort order."
                    icon={Filter}
                    contentClassName="w-96 p-4"
                >
                    <div className="grid grid-cols-2 gap-3">
                        <SelectFilter
                            value={movementTypeFilter}
                            onChange={setMovementTypeFilter}
                            options={movementTypeOptions}
                            className="w-full h-8 text-xs lg:h-9 lg:text-sm border-slate-200"
                        />
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
                            className="w-full h-8 text-xs lg:h-9 lg:text-sm border-slate-200 col-span-2"
                        />
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

                    {/* Quantity Range */}
                    <div className="flex flex-col gap-1.5">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Quantity Range</p>
                        <div className="grid grid-cols-2 gap-2">
                            <input
                                type="number"
                                min={0}
                                value={minQty}
                                onChange={(e) => setMinQty(e.target.value)}
                                placeholder="Min Qty"
                                className="w-full h-8 lg:h-9 rounded-md border border-slate-200 px-3 text-xs lg:text-sm focus:outline-none focus:ring-1 focus:ring-slate-300"
                            />
                            <input
                                type="number"
                                min={0}
                                value={maxQty}
                                onChange={(e) => setMaxQty(e.target.value)}
                                placeholder="Max Qty"
                                className="w-full h-8 lg:h-9 rounded-md border border-slate-200 px-3 text-xs lg:text-sm focus:outline-none focus:ring-1 focus:ring-slate-300"
                            />
                        </div>
                        {qtyError && <p className="text-xs text-red-500 font-medium">{qtyError}</p>}
                    </div>
                </FilterPopover>
            </DataTableToolbar>

            {/* Data Table */}
            <DataTableLayout
                table={table}
                isLoading={loading}
                error={error}
                isEmpty={isEmpty}
                errorState={
                    <EmptyState
                        title="Something went wrong"
                        description="Failed to load stock movements"
                        icon={ServerCrash}
                    />
                }
            />
        </>
    );
}