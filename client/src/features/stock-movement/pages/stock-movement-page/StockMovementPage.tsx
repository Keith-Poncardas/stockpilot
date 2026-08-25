import * as React from "react";
import { useQuery } from "@apollo/client";
import {
    ArrowUpDown,
    Plus,
    ServerCrash,
} from "lucide-react";
import { columns } from "../../sm.columns";
import {
    GET_ALL_STOCK_MOVEMENTS,
    GET_STOCK_MOVEMENT_DASHBOARD_METRICS
} from "../../operations";
import { useDebounce } from "@/hooks/useDebounce";
import { usePaginatedQuery } from "@/hooks/usePaginatedQuery";
import { useDateRangeValidation } from "@/hooks/useDateRangeValidation";
import { useQtyRangeValidation } from "../../hooks";
import { DataTableLayout } from "@/components/ui/data-table-layout";
import { Button } from "@/components/ui/button";
import SectionHeader from "@/components/SectionHeader";
import { EmptyState } from "@/components/ui/empty-state";
import { MetricCard } from "@/components/MetricCard";
import { useNavigate } from "react-router-dom";
import { PATHS } from "@/routes";
import {
    getFilterOptions,
    getMetricCardOptions,
    buildStockMovementVariables
} from "./options";
import type { SMFilters } from "../../types";
import { StockMovementTableToolbar } from "../../components";

/**
 * The main page component for viewing and managing stock movements.
 * This component displays a dashboard with metric cards and a paginated table of stock movements
 * with filtering and sorting capabilities.
 */
export function StockMovementPage() {
    const [globalFilter, setGlobalFilter] = React.useState("");
    const debouncedSearch = useDebounce(globalFilter, 500);

    const navigate = useNavigate();

    /**
     * State managing all active filters for the stock movements table.
     * These filters are applied to the paginated query to filter/sort the table data.
     */
    const [filters, setFilters] = React.useState<SMFilters>({
        movementTypeFilter: "",
        orderByFilter: "",
        orderDirectionFilter: "",
        dateFrom: "",
        dateTo: "",
        minQty: "",
        maxQty: "",
    });

    /**
     * Debounced version of the minimum quantity filter.
     * This is used to prevent excessive API calls when the user is typing
     * in the minimum quantity filter input.
     */
    const debouncedMinQty = useDebounce(filters.minQty, 500);

    /**
     * Debounced version of the maximum quantity filter.
     * This is used to prevent excessive API calls when the user is typing
     * in the maximum quantity filter input.
     */
    const debouncedMaxQty = useDebounce(filters.maxQty, 500);

    /**
     * Validates the date range and returns the validated dates.
     */
    const {
        dateError,
        dateFrom,
        dateTo
    } = useDateRangeValidation(filters.dateFrom, filters.dateTo);

    /**
     * Validates the quantity range and returns the validated quantities.
     */
    const { qtyError } = useQtyRangeValidation(
        debouncedMinQty,
        debouncedMaxQty
    );

    /**
     * Hooks into the usePaginatedQuery hook to fetch paginated data from the API.
     * This hook handles pagination, sorting, and filtering of the stock movements table.
     */
    const {
        table,
        loading,
        error,
        refetch,
        isEmpty,
    } = usePaginatedQuery({
        query: GET_ALL_STOCK_MOVEMENTS,
        columns,
        initialPageSize: 10,
        filters: {
            search: debouncedSearch,
            debouncedMinQty,
            debouncedMaxQty,
            ...filters,
        },
        buildVariables: React.useCallback(({ queryParams, filters }: any) => buildStockMovementVariables(
            { queryParams, filters },
            { dateError, qtyError, dateFrom, dateTo }
        ), [dateError, qtyError, dateFrom, dateTo]),
    });

    /**
     * Fetches dashboard metrics for stock movements.
     * This includes total stock in, total stock out, total adjustments, and low stock products.
     */
    const { data: metricsData, loading: metricsLoading } = useQuery(GET_STOCK_MOVEMENT_DASHBOARD_METRICS, {
        fetchPolicy: "cache-and-network",
        notifyOnNetworkStatusChange: true,
    });

    /**
     * Memoizes the filter options for the stock movements table.
     * This is used to prevent excessive re-renders of the filter options.
     */
    const filterOptions = React.useMemo(() => getFilterOptions(
        filters,
        setFilters
    ), [filters, setFilters]);

    /**
     * Memoizes the metric card options for the stock movements table.
     * This is used to prevent excessive re-renders of the metric cards.
     */
    const metricCards = React.useMemo(() => getMetricCardOptions(
        metricsData?.getStockMovementDashboardMetrics
    ), [metricsData]);

    /**
     * Resets the search filter and refetches the data.
     */
    function refresh() {
        refetch();
        setGlobalFilter("");
    };

    /**
     * Navigates to the record stock movement page.
     */
    function handleRecordMovement() {
        navigate(PATHS.inventory.record);
    };

    /**
     * Resets all filters and the search filter.
     */
    function resetFilters() {
        setFilters({
            movementTypeFilter: "",
            orderByFilter: "",
            orderDirectionFilter: "",
            dateFrom: "",
            dateTo: "",
            minQty: "",
            maxQty: "",
        });
        setGlobalFilter("");
    };

    return (
        <>
            {/* Page Header */}
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
                {!metricsLoading ? metricCards.map(card => (
                    <MetricCard
                        key={card.id}
                        value={card.value}
                        label={card.label}
                        icon={card.icon}
                        iconContainerClass={card.iconContainerClass}
                    />
                )) : metricCards.map(card => (
                    <MetricCard.Skeleton
                        key={card.id}
                    />
                ))}
            </div>

            {/* Toolbar & Filters */}
            <StockMovementTableToolbar
                search={globalFilter}
                setSearch={setGlobalFilter}
                filters={filters}
                setFilters={setFilters}
                filterOptions={filterOptions}
                dateError={dateError}
                qtyError={qtyError}
                onRefresh={refresh}
                onResetFilters={resetFilters}
            />

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
};