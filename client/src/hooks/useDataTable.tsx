import { useState, useCallback } from 'react';
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
} from '@tanstack/react-table';
import type {
    PaginationState,
    SortingState,
    ColumnFiltersState,
    ColumnDef,
} from '@tanstack/react-table';

interface UseDataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    initialPageSize?: number;
}

export function useDataTable<TData, TValue>({
    columns,
    initialPageSize = 5,
}: UseDataTableProps<TData, TValue>) {
    const [tableData, setTableData] = useState<TData[]>([]);
    const [metaPageCount, setMetaPageCount] = useState<number>(-1);
    const [metaRowCount, setMetaRowCount] = useState<number>(0);

    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [rowSelection, setRowSelection] = useState({});
    
    // Pagination state
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: initialPageSize,
    });

    const table = useReactTable({
        data: tableData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        
        // Server-side pagination
        manualPagination: true,
        pageCount: metaPageCount,
        rowCount: metaRowCount,
        onPaginationChange: setPagination,
        
        // Sorting and filtering states
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            rowSelection,
            pagination,
        },
    });

    // Extract query parameters for the API
    const orderBy = sorting.length > 0 ? sorting[0].id : undefined;
    const orderDirection = sorting.length > 0 ? (sorting[0].desc ? 'desc' : 'asc') : undefined;

    const queryParams = {
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        orderBy,
        orderDirection,
    };

    const setQueryData = useCallback((data: any) => {
        if (data?.data) setTableData(data.data);
        if (data?.meta?.totalPages !== undefined) setMetaPageCount(data.meta.totalPages);
        if (data?.meta?.totalItems !== undefined) setMetaRowCount(data.meta.totalItems);
    }, []);

    return {
        table,
        queryParams,
        pagination,
        sorting,
        setQueryData,
        setPagination,
        setSorting,
        setColumnFilters,
        setRowSelection,
    };
}
