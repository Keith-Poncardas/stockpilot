import { useQuery } from '@apollo/client';
import { useCallback } from 'react';
import { GET_SELLABLE_PRODUCTS } from '../../../operations/op.queries';
import type { IInventory } from '@/features/inventory';


interface GetSellableProductsData {
    getSellableProducts: {
        data: IInventory[];
        meta: {
            page: number;
            limit: number;
            totalItems: number;
            totalPages: number;
            hasNextPage: boolean;
            hasPreviousPage: boolean;
        };
    };
}

interface GetSellableProductsVars {
    input: {
        page?: number;
        limit?: number;
        filter?: {
            search?: string;
        };
    };
}

export function usePaginatedInventories(search?: string, initialLimit = 20) {
    const { data, loading, error, fetchMore, refetch } = useQuery<
        GetSellableProductsData,
        GetSellableProductsVars
    >(GET_SELLABLE_PRODUCTS, {
        variables: {
            input: {
                page: 1,
                limit: initialLimit,
                filter: {
                    search: search || undefined,
                },
            },
        },
        notifyOnNetworkStatusChange: true,
    });

    const inventories = data?.getSellableProducts?.data ?? [];
    const meta = data?.getSellableProducts?.meta;
    const hasMore = meta?.hasNextPage ?? false;

    const loadMore = useCallback(async () => {
        if (!hasMore || loading || !meta?.page) return;

        await fetchMore({
            variables: {
                input: {
                    page: meta.page + 1,
                    limit: initialLimit,
                    filter: {
                        search: search || undefined,
                    },
                },
            },
            updateQuery: (previousQueryResult, { fetchMoreResult }) => {
                if (!fetchMoreResult) return previousQueryResult;

                return {
                    getSellableProducts: {
                        ...fetchMoreResult.getSellableProducts,
                        data: [
                            ...previousQueryResult.getSellableProducts.data,
                            ...fetchMoreResult.getSellableProducts.data,
                        ],
                    },
                };
            },
        });
    }, [hasMore, loading, meta?.page, fetchMore, initialLimit, search]);

    return {
        inventories,
        loading,
        error,
        hasMore,
        loadMore,
        refetch,
        meta,
    };
}
