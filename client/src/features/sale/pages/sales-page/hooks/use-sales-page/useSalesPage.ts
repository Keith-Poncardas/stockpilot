import { useState, useCallback, useMemo } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { usePaginatedQuery } from '@/hooks/usePaginatedQuery';
import { useDateRangeValidation } from '@/hooks/useDateRangeValidation';
import { useSaleFilterOptions } from '../use-sale-filter-options';
import type { ISaleFilters } from '../../../../components';
import { useSaleMetrics } from '../use-sale-metrics';
import { GET_SALES } from '../../../../operations';
import { columns } from '../../columns';
import { cleanObject } from '@/lib/utils';

/**
 * Custom hook that orchestrates the state, metrics fetching, and filtering
 * logic for the refactored SalesPage component.
 */
export function useSalesPage() {
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 500);

    const [filters, setFilters] = useState<ISaleFilters>({
        status: '',
        paymentMethod: '',
        orderBy: '',
        orderDirection: '',
        dateFrom: '',
        dateTo: '',
    });

    const {
        dateError,
        dateFrom,
        dateTo
    } = useDateRangeValidation(filters.dateFrom, filters.dateTo);

    const { cardMetrics, isLoading: isMetricsLoading } = useSaleMetrics();
    const filterOptions = useSaleFilterOptions(filters, setFilters);

    // Build query filter by cleaning up empty values
    const buildSaleQueryFilter = useCallback((
        activeFilters: ISaleFilters & { search: string },
        queryParams: { page?: number; limit?: number; orderBy?: string; orderDirection?: string }
    ) => {
        return cleanObject({
            search: activeFilters.search,
            status: activeFilters.status === 'ALL' ? undefined : activeFilters.status,
            paymentMethod: activeFilters.paymentMethod === 'ALL' ? undefined : activeFilters.paymentMethod,
            dateFrom,
            dateTo,
            orderBy: activeFilters.orderBy || queryParams.orderBy || 'saleDate',
            orderDirection: activeFilters.orderDirection || queryParams.orderDirection || 'desc',
        });
    }, [dateFrom, dateTo]);

    const {
        table,
        loading,
        error,
        refetch,
        isEmpty,
    } = usePaginatedQuery({
        query: GET_SALES,
        columns,
        initialPageSize: 10,
        filters: {
            search: debouncedSearch,
            ...filters,
        },
        buildVariables: useCallback(({ queryParams, filters }) => ({
            args: {
                page: queryParams.page,
                limit: queryParams.limit,
                filter: buildSaleQueryFilter(filters, queryParams),
            }
        }), [buildSaleQueryFilter]),
    });

    const refresh = useCallback(() => {
        refetch();
        setSearch('');
    }, [refetch]);

    const handleReset = useCallback(() => {
        setFilters({
            status: '',
            paymentMethod: '',
            orderBy: '',
            orderDirection: '',
            dateFrom: '',
            dateTo: '',
        });
        setSearch('');
    }, []);

    const isLoading = isMetricsLoading;

    return useMemo(() => ({
        search,
        setSearch,
        filters,
        setFilters,
        dateError,
        cardMetrics,
        isLoading,
        filterOptions,
        refresh,
        handleReset,
        // Paginated query values
        table,
        loading,
        error,
        isEmpty,
        refetch
    }), [
        search,
        filters,
        dateError,
        cardMetrics,
        isLoading,
        filterOptions,
        refresh,
        handleReset,
        table,
        loading,
        error,
        isEmpty,
        refetch
    ]);
}
