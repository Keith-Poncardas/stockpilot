import * as React from "react";
import { useQuery } from "@apollo/client";
import { useDebounce } from "@/hooks/useDebounce";
import { usePaginatedQuery } from "@/hooks/usePaginatedQuery";
import { useDateRangeValidation } from "@/hooks/useDateRangeValidation";
import { useQtyRangeValidation } from "@/features/stock-movement-refactor/hooks";
import {
    GET_ALL_STOCK_MOVEMENTS,
    GET_STOCK_MOVEMENT_DASHBOARD_METRICS,
} from "@/features/stock-movement-refactor/operations";
import { buildStockMovementVariables } from "@/features/stock-movement-refactor/utils";
import type { SMFilters } from "@/features/stock-movement-refactor/types";
import { columns } from "../columns";
import { getFilterOptions, getMetricCardOptions } from "../config";

export function useStockMovementPage() {
    const [globalFilter, setGlobalFilter] = React.useState("");
    const debouncedSearch = useDebounce(globalFilter, 500);

    const [filters, setFilters] = React.useState<SMFilters>({
        movementTypeFilter: "",
        orderByFilter: "",
        orderDirectionFilter: "",
        dateFrom: "",
        dateTo: "",
        minQty: "",
        maxQty: "",
    });

    const debouncedMinQty = useDebounce(filters.minQty, 500);
    const debouncedMaxQty = useDebounce(filters.maxQty, 500);

    const {
        dateError,
        dateFrom,
        dateTo
    } = useDateRangeValidation(filters.dateFrom, filters.dateTo);

    const { qtyError } = useQtyRangeValidation(
        debouncedMinQty,
        debouncedMaxQty
    );

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
        buildVariables: React.useCallback(({ queryParams, filters }: {
            queryParams: import("@/features/stock-movement-refactor/utils").StockMovementQueryParams;
            filters: import("@/features/stock-movement-refactor/utils").StockMovementFilterParams;
        }) => buildStockMovementVariables(
            { queryParams, filters },
            { dateError, qtyError, dateFrom, dateTo }
        ), [dateError, qtyError, dateFrom, dateTo]),
    });

    const { data: metricsData, loading: metricsLoading } = useQuery(GET_STOCK_MOVEMENT_DASHBOARD_METRICS, {
        fetchPolicy: "cache-and-network",
        notifyOnNetworkStatusChange: true,
    });

    const filterOptions = React.useMemo(() => getFilterOptions(
        filters,
        setFilters
    ), [filters]);

    const metricCards = React.useMemo(() => getMetricCardOptions(
        metricsData?.getStockMovementDashboardMetrics
    ), [metricsData]);

    const refresh = React.useCallback(() => {
        refetch();
        setGlobalFilter("");
    }, [refetch]);

    const resetFilters = React.useCallback(() => {
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
    }, []);

    return {
        globalFilter,
        setGlobalFilter,
        filters,
        setFilters,
        dateError,
        qtyError,
        table,
        loading,
        error,
        isEmpty,
        metricsLoading,
        filterOptions,
        metricCards,
        refresh,
        resetFilters,
    };
}
