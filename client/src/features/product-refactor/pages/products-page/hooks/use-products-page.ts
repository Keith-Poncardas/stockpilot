import { useState, useCallback } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { usePaginatedQuery } from '@/hooks/usePaginatedQuery';
import { useDateRangeValidation } from '@/hooks/useDateRangeValidation';
import { cleanObject } from '@/lib/utils';

import { GET_PRODUCTS } from '../../../operations';
import { columns } from '../columns';
import { DEFAULT_PRODUCT_PAGE_SIZE, PRODUCT_SEARCH_DEBOUNCE_MS } from '../config';
import { useProductFilterOptions, type IProductFilters } from './use-product-filter-options';
import { useProductMetrics } from './use-product-metrics';
import type { IProduct } from '../../../types';

type ProductPageQueryFilters = IProductFilters & { search: string };

export function useProductsPage() {
    const [globalFilter, setGlobalFilter] = useState('');
    const debouncedSearch = useDebounce(globalFilter, PRODUCT_SEARCH_DEBOUNCE_MS);

    const [filters, setFilters] = useState<IProductFilters>({
        status: '',
        orderBy: '',
        orderDirection: '',
        dateFrom: '',
        dateTo: '',
        minPrice: '',
        maxPrice: '',
    });

    const debouncedMinPrice = useDebounce(filters.minPrice, PRODUCT_SEARCH_DEBOUNCE_MS);
    const debouncedMaxPrice = useDebounce(filters.maxPrice, PRODUCT_SEARCH_DEBOUNCE_MS);

    const {
        dateError,
        dateFrom: validatedDateFrom,
        dateTo: validatedDateTo,
    } = useDateRangeValidation(filters.dateFrom, filters.dateTo);

    const priceError =
        debouncedMinPrice &&
        debouncedMaxPrice &&
        Number(debouncedMinPrice) > Number(debouncedMaxPrice)
            ? 'Min price must be less than or equal to max price'
            : null;

    const { cardMetrics, isLoading: isMetricsLoading } = useProductMetrics();
    const filterOptions = useProductFilterOptions(filters, setFilters);

    const buildProductQueryFilter = useCallback(
        (
            activeFilters: ProductPageQueryFilters,
            queryParams: { page?: number; limit?: number; orderBy?: string; orderDirection?: string }
        ) => {
            return cleanObject({
                search: activeFilters.search,
                status: activeFilters.status || undefined,
                minPrice:
                    priceError || !debouncedMinPrice ? undefined : Number(debouncedMinPrice),
                maxPrice:
                    priceError || !debouncedMaxPrice ? undefined : Number(debouncedMaxPrice),
                dateFrom: dateError ? undefined : validatedDateFrom,
                dateTo: dateError ? undefined : validatedDateTo,
                orderBy: activeFilters.orderBy || queryParams.orderBy || 'createdAt',
                orderDirection:
                    activeFilters.orderDirection || queryParams.orderDirection || 'desc',
            });
        },
        [validatedDateFrom, validatedDateTo, dateError, priceError, debouncedMinPrice, debouncedMaxPrice]
    );

    const activeFiltersWithSearch: ProductPageQueryFilters = {
        search: debouncedSearch,
        ...filters,
    };

    const {
        table,
        loading,
        error,
        refetch,
        isEmpty,
    } = usePaginatedQuery<IProduct, any, ProductPageQueryFilters>({
        query: GET_PRODUCTS,
        columns,
        initialPageSize: DEFAULT_PRODUCT_PAGE_SIZE,
        fetchPolicy: 'cache-and-network',
        filters: activeFiltersWithSearch,
        buildVariables: useCallback(
            ({ queryParams, filters: activeFilters }) => ({
                args: {
                    page: queryParams.page,
                    limit: queryParams.limit,
                    filter: buildProductQueryFilter(activeFilters, queryParams),
                },
            }),
            [buildProductQueryFilter]
        ),
    });

    const refresh = useCallback(() => {
        refetch();
        setGlobalFilter('');
    }, [refetch]);

    const resetFilters = useCallback(() => {
        setFilters({
            status: '',
            orderBy: '',
            orderDirection: '',
            dateFrom: '',
            dateTo: '',
            minPrice: '',
            maxPrice: '',
        });
        setGlobalFilter('');
    }, []);

    const hasActiveFilters = !!(
        filters.status ||
        filters.dateFrom ||
        filters.dateTo ||
        filters.minPrice ||
        filters.maxPrice ||
        filters.orderBy ||
        filters.orderDirection ||
        globalFilter
    );

    return {
        // Filters & Search
        globalFilter,
        setGlobalFilter,
        ...filterOptions,
        dateError,
        priceError,
        hasActiveFilters,

        // Actions
        refresh,
        resetFilters,

        // Table & Query Data
        table,
        loading,
        error,
        isEmpty,

        // Metrics
        cardMetrics,
        metricsLoading: isMetricsLoading,
    };
}
