import { useState, useCallback, useMemo } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { usePaginatedQuery } from '@/hooks/usePaginatedQuery';
import { useDateRangeValidation } from '@/hooks/useDateRangeValidation';
import { useCustomerFilterOptions } from '../use-customer-filter-options';
import type { ICustomerFilters } from '../use-customer-filter-options';
import { useCustomerMetrics } from '../use-customer-metrics';
import { GET_CUSTOMERS } from '@/features/customer-refactor';
import { columns } from '../../columns/customer.columns';
import { cleanObject } from '@/lib/utils';
import type { IUseCustomersPageReturn } from './types';

export function useCustomersPage(): IUseCustomersPageReturn {
    const [globalFilter, setGlobalFilter] = useState('');
    const debouncedSearch = useDebounce(globalFilter, 500);

    const [filters, setFilters] = useState<ICustomerFilters>({
        orderBy: '',
        orderDirection: '',
        dateFrom: '',
        dateTo: '',
    });

    const {
        dateError,
        dateFrom: validatedDateFrom,
        dateTo: validatedDateTo
    } = useDateRangeValidation(filters.dateFrom, filters.dateTo);

    const { cardMetrics, isLoading: isMetricsLoading } = useCustomerMetrics();

    // We map the centralized filters state back to individual setters
    const filterOptions = useCustomerFilterOptions(filters, setFilters);

    const buildCustomerQueryFilter = useCallback((
        activeFilters: ICustomerFilters & { search: string },
        queryParams: { page?: number; limit?: number; orderBy?: string; orderDirection?: string }
    ) => {
        return cleanObject({
            search: activeFilters.search,
            dateFrom: validatedDateFrom,
            dateTo: validatedDateTo,
            orderBy: activeFilters.orderBy || queryParams.orderBy || 'createdAt',
            orderDirection: activeFilters.orderDirection || queryParams.orderDirection || 'desc',
        });
    }, [validatedDateFrom, validatedDateTo]);

    const {
        table,
        loading: queryLoading,
        error,
        refetch,
        isEmpty,
    } = usePaginatedQuery({
        query: GET_CUSTOMERS,
        columns,
        initialPageSize: 10,
        fetchPolicy: 'cache-and-network',
        filters: {
            search: debouncedSearch,
            ...filters,
        } as ICustomerFilters & { search: string },
        buildVariables: useCallback(({ queryParams, filters }) => ({
            args: {
                page: queryParams.page,
                limit: queryParams.limit,
                filter: buildCustomerQueryFilter(filters, queryParams),
            }
        }), [buildCustomerQueryFilter]),
    });

    const refresh = useCallback(() => {
        refetch();
        setGlobalFilter('');
    }, [refetch]);

    const resetFilters = useCallback(() => {
        setFilters({
            orderBy: '',
            orderDirection: '',
            dateFrom: '',
            dateTo: '',
        });
        setGlobalFilter('');
    }, []);

    const hasActiveFilters = !!(
        filters.dateFrom || filters.dateTo || filters.orderBy || filters.orderDirection || globalFilter
    );

    return useMemo(() => ({
        // Search & Filters
        globalFilter,
        setGlobalFilter,
        ...filterOptions,
        dateError,
        hasActiveFilters,

        // Actions
        refresh,
        resetFilters,

        // Table Data
        table,
        loading: queryLoading,
        error,
        isEmpty,

        // Metrics
        cardMetrics,
        metricsLoading: isMetricsLoading,
    }), [
        globalFilter,
        filterOptions,
        dateError,
        hasActiveFilters,
        refresh,
        resetFilters,
        table,
        queryLoading,
        error,
        isEmpty,
        cardMetrics,
        isMetricsLoading
    ]);
}
