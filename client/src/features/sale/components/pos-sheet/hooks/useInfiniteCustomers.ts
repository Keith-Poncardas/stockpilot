import { useQuery } from '@apollo/client';
import { useCallback } from 'react';
import { SEARCH_CUSTOMERS } from '@/features/customer-refactor';
import type { ICustomer } from '@/features/customer-refactor';

export type CustomerSearchResult = ICustomer;

interface SearchPosCustomersData {
    searchCustomers: {
        data: ICustomer[];
        meta: {
            nextCursor: string | null;
            hasNextPage: boolean;
        };
    };
}

interface SearchPosCustomersVars {
    args: {
        search?: string;
        cursor?: string | null;
        limit?: number;
    };
}

export function useInfiniteCustomers(search?: string, limit: number = 20) {
    const { data, loading, error, fetchMore, refetch, networkStatus } = useQuery<
        SearchPosCustomersData,
        SearchPosCustomersVars
    >(SEARCH_CUSTOMERS, {
        variables: {
            args: {
                search,
                limit,
            },
        },
        notifyOnNetworkStatusChange: true,
    });

    const customers = data?.searchCustomers.data || [];
    const meta = data?.searchCustomers.meta;
    const hasMore = meta?.hasNextPage ?? false;
    const nextCursor = meta?.nextCursor;
    const isFetchingMore = networkStatus === 3;
    const isInitialLoading = networkStatus === 1 || networkStatus === 2; // loading or setVariables

    const loadMore = useCallback(async () => {
        if (!hasMore || loading || !nextCursor) return;

        await fetchMore({
            variables: {
                args: {
                    search,
                    limit,
                    cursor: nextCursor,
                },
            },
            updateQuery: (previousQueryResult, { fetchMoreResult }) => {
                if (!fetchMoreResult) return previousQueryResult;

                return {
                    searchCustomers: {
                        ...fetchMoreResult.searchCustomers,
                        data: [
                            ...previousQueryResult.searchCustomers.data,
                            ...fetchMoreResult.searchCustomers.data,
                        ],
                    },
                };
            },
        });
    }, [hasMore, loading, nextCursor, fetchMore, search, limit]);

    return {
        customers,
        loading: isInitialLoading, // Only true for initial load, not for fetchMore
        isFetchingMore,
        error,
        hasMore,
        loadMore,
        refetch,
    };
}
