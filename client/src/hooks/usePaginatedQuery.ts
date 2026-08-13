import { useEffect, useMemo } from 'react';
import { useQuery, type DocumentNode, type OperationVariables, type WatchQueryFetchPolicy } from '@apollo/client';
import type { ColumnDef } from '@tanstack/react-table';
import { useDataTable } from './useDataTable';
import { useTableEmptyState } from './useTableEmptyState';

interface UsePaginatedQueryProps<TData, TValue, TFilters extends Record<string, any>> {
    query: DocumentNode;
    columns: ColumnDef<TData, TValue>[];
    initialPageSize?: number;
    filters?: TFilters;
    buildVariables: (args: { queryParams: any; filters: TFilters }) => OperationVariables;
    dataKey?: string;
    fetchPolicy?: WatchQueryFetchPolicy;
    notifyOnNetworkStatusChange?: boolean;
}

export function usePaginatedQuery<TData, TValue, TFilters extends Record<string, any>>({
    query,
    columns,
    initialPageSize = 10,
    filters = {} as TFilters,
    buildVariables,
    dataKey,
    fetchPolicy = 'network-only',
    notifyOnNetworkStatusChange = true,
}: UsePaginatedQueryProps<TData, TValue, TFilters>) {
    const { table, queryParams, setQueryData, setPagination } = useDataTable({
        columns,
        initialPageSize,
    });

    // Reset pagination to page 0 when filters change.
    const filtersString = JSON.stringify(filters);
    useEffect(() => {
        setPagination(prev => ({ ...prev, pageIndex: 0 }));
    }, [filtersString, setPagination]);

    const variables = useMemo(() => {
        return buildVariables({ queryParams, filters });
    }, [queryParams, filtersString, buildVariables]);

    const { loading, error, refetch, data } = useQuery(query, {
        variables,
        fetchPolicy,
        notifyOnNetworkStatusChange,
    });

    const isEmpty = useTableEmptyState(table, loading, error);

    useEffect(() => {
        if (data) {
            const key = dataKey || Object.keys(data).find(k => k !== '__typename');
            if (key && data[key]) {
                setQueryData({
                    data: data[key].data,
                    meta: data[key].meta,
                });
            }
        }
    }, [data, setQueryData, dataKey]);

    return {
        table,
        loading,
        error,
        refetch,
        data,
        isEmpty,
    };
}
