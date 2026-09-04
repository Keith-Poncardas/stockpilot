import { useCallback } from 'react';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { SEARCH_PRODUCTS_INFINITE } from '../operations';
import type { IProduct, UseInfiniteProductSearchOptions } from '../types';

interface SearchProductsInfiniteData {
    searchProductsInfinite: {
        data: IProduct[];
        meta: { nextCursor: string | null; hasNextPage: boolean };
    };
}

const getResult = (data: SearchProductsInfiniteData) => data.searchProductsInfinite;

export function useInfiniteProductSearch(
    search: string,
    options?: UseInfiniteProductSearchOptions
) {
    const hasInventory = options?.hasInventory;
    const buildVariables = useCallback(
        (search: string, cursor: string | null, limit: number) => ({
            input: {
                search,
                cursor,
                limit,
                ...(hasInventory !== undefined && { hasInventory }),
            },
        }),
        [hasInventory]
    );

    return useInfiniteScroll<SearchProductsInfiniteData, IProduct>({
        query: SEARCH_PRODUCTS_INFINITE,
        search,
        getResult,
        buildVariables,
    });
}
