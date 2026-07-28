import * as React from 'react'
import { DataTable } from '@/components/ui/data-table'
import { DataTablePagination } from '@/components/ui/data-table-pagination'
import { EmptyState } from '@/components/ui/empty-state'
import { ServerCrash } from 'lucide-react'
import type { Table } from '@tanstack/react-table'
import { cn } from '@/lib/utils'

interface DataTableLayoutProps<TData> {
    table: Table<TData>
    isLoading?: boolean
    error?: Error | boolean | null
    isEmpty?: boolean
    emptyState?: React.ReactNode
    errorState?: React.ReactNode
    className?: string
}

export function DataTableLayout<TData>({
    table,
    isLoading,
    error,
    isEmpty,
    emptyState = <EmptyState />,
    errorState = <EmptyState title='Something went wrong' description="Failed to load data" icon={ServerCrash} />,
    className,
}: DataTableLayoutProps<TData>) {
    return (
        <div className={cn('bg-white rounded-2xl border border-[#E3E1DC] overflow-hidden', className)}>
            {!error && !isEmpty && <DataTable table={table} isLoading={isLoading} />}

            {isEmpty && emptyState}

            {error && errorState}

            {!error && !isEmpty && <DataTablePagination table={table} />}
        </div>
    )
}
