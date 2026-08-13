import type { Table } from '@tanstack/react-table';

export function useTableEmptyState<TData>(table: Table<TData>, loading: boolean, error: any) {
    return !loading && !error && table.getRowModel().rows?.length === 0;
}
