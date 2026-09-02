import * as React from 'react';
import { useQuery } from '@apollo/client';
import { useDebounce } from '@/hooks/useDebounce';
import { useDataTable } from '@/hooks/useDataTable';
import { GET_INVENTORIES, GET_INVENTORY_STATUSES } from '@/features/inventory-refactor/operations';
import type { IInventory, InventoryOrderBy } from '@/features/inventory-refactor/types';
import { columns } from '../columns';

export function useInventoryTable() {
    const [globalFilter, setGlobalFilter] = React.useState('');
    const debouncedSearch = useDebounce(globalFilter, 500);

    const [stockStatusFilter, setStockStatusFilter] = React.useState('');
    const [orderByFilter, setOrderByFilter] = React.useState<InventoryOrderBy | ''>('');
    const [orderDirectionFilter, setOrderDirectionFilter] = React.useState('');
    const [minQty, setMinQty] = React.useState('');
    const [maxQty, setMaxQty] = React.useState('');

    const debouncedMinQty = useDebounce(minQty, 500);
    const debouncedMaxQty = useDebounce(maxQty, 500);

    const qtyError =
        debouncedMinQty && debouncedMaxQty && Number(debouncedMinQty) > Number(debouncedMaxQty)
            ? 'Min qty must be less than or equal to max qty'
            : null;

    const { table, queryParams, setQueryData, setPagination } = useDataTable<IInventory, unknown>({
        columns,
        initialPageSize: 10,
    });

    React.useEffect(() => {
        setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    }, [
        debouncedSearch,
        stockStatusFilter,
        debouncedMinQty,
        debouncedMaxQty,
        orderByFilter,
        orderDirectionFilter,
        setPagination,
    ]);

    const { loading, error, refetch, data } = useQuery(GET_INVENTORIES, {
        variables: {
            input: {
                page: queryParams.page,
                limit: queryParams.limit,
                filter: {
                    search: debouncedSearch || undefined,
                    stockStatus: stockStatusFilter && stockStatusFilter !== 'ALL' ? stockStatusFilter : undefined,
                    minQty: qtyError ? undefined : debouncedMinQty ? Number(debouncedMinQty) : undefined,
                    maxQty: qtyError ? undefined : debouncedMaxQty ? Number(debouncedMaxQty) : undefined,
                    orderBy: orderByFilter || 'updatedAt',
                    orderDirection: orderDirectionFilter || 'desc',
                },
            },
        },
        fetchPolicy: 'cache-and-network',
        notifyOnNetworkStatusChange: true,
    });

    const { data: statusData } = useQuery(GET_INVENTORY_STATUSES, {
        fetchPolicy: 'cache-and-network',
        notifyOnNetworkStatusChange: true,
    });

    const statuses = statusData?.getInventoryStatuses;

    React.useEffect(() => {
        if (data?.getInventories) {
            setQueryData({
                data: data.getInventories.data,
                meta: data.getInventories.meta,
            });
        }
    }, [data, setQueryData]);

    const isEmpty = !loading && !error && table.getRowModel().rows?.length === 0;

    const hasActiveFilters = Boolean(
        (stockStatusFilter && stockStatusFilter !== 'ALL') ||
            minQty ||
            maxQty ||
            orderByFilter ||
            orderDirectionFilter ||
            globalFilter
    );

    function refresh() {
        refetch();
        setGlobalFilter('');
    }

    function resetFilters() {
        setStockStatusFilter('');
        setOrderByFilter('');
        setOrderDirectionFilter('');
        setMinQty('');
        setMaxQty('');
        setGlobalFilter('');
    }

    return {
        table,
        loading,
        error,
        isEmpty,
        refresh,
        hasActiveFilters,
        resetFilters,
        globalFilter,
        setGlobalFilter,
        stockStatusFilter,
        setStockStatusFilter,
        orderByFilter,
        setOrderByFilter,
        orderDirectionFilter,
        setOrderDirectionFilter,
        minQty,
        setMinQty,
        maxQty,
        setMaxQty,
        qtyError,
        statuses,
    };
}
