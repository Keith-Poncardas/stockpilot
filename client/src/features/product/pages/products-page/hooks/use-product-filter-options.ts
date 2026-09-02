import { useCallback } from 'react';
import type { ProductOrderBy, ProductStatus, ProductType } from '../../../types';

export interface IProductFilters {
    status: ProductStatus | '';
    productType: ProductType | '';
    orderBy: ProductOrderBy | '';
    orderDirection: 'asc' | 'desc' | '';
    dateFrom: string;
    dateTo: string;
    minPrice: string;
    maxPrice: string;
}

export function useProductFilterOptions(
    filters: IProductFilters,
    setFilters: React.Dispatch<React.SetStateAction<IProductFilters>>
) {
    const setStatusFilter = useCallback(
        (status: string) => {
            setFilters((prev) => ({
                ...prev,
                status: (status === 'all' ? '' : status) as ProductStatus | '',
            }));
        },
        [setFilters]
    );

    const setProductTypeFilter = useCallback(
        (productType: string) => {
            setFilters((prev) => ({
                ...prev,
                productType: (productType === 'all' ? '' : productType) as ProductType | '',
            }));
        },
        [setFilters]
    );

    const setOrderByFilter = useCallback(
        (orderBy: string) => {
            setFilters((prev) => ({
                ...prev,
                orderBy: orderBy as ProductOrderBy | '',
            }));
        },
        [setFilters]
    );

    const setOrderDirectionFilter = useCallback(
        (orderDirection: string) => {
            setFilters((prev) => ({
                ...prev,
                orderDirection: orderDirection as 'asc' | 'desc' | '',
            }));
        },
        [setFilters]
    );

    const setDateFrom = useCallback(
        (dateFrom: string) => {
            setFilters((prev) => ({ ...prev, dateFrom }));
        },
        [setFilters]
    );

    const setDateTo = useCallback(
        (dateTo: string) => {
            setFilters((prev) => ({ ...prev, dateTo }));
        },
        [setFilters]
    );

    const setMinPrice = useCallback(
        (minPrice: string) => {
            setFilters((prev) => ({ ...prev, minPrice }));
        },
        [setFilters]
    );

    const setMaxPrice = useCallback(
        (maxPrice: string) => {
            setFilters((prev) => ({ ...prev, maxPrice }));
        },
        [setFilters]
    );

    return {
        statusFilter: filters.status,
        setStatusFilter,
        productTypeFilter: filters.productType,
        setProductTypeFilter,
        orderByFilter: filters.orderBy,
        setOrderByFilter,
        orderDirectionFilter: filters.orderDirection,
        setOrderDirectionFilter,
        dateFrom: filters.dateFrom,
        setDateFrom,
        dateTo: filters.dateTo,
        setDateTo,
        minPrice: filters.minPrice,
        setMinPrice,
        maxPrice: filters.maxPrice,
        setMaxPrice,
    };
}
