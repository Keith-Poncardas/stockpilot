import { useState, useMemo } from 'react';
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getPaginationRowModel,
    type ColumnDef,
    type SortingState,
    type PaginationState,
} from '@tanstack/react-table';
import { FormSection } from '@/components/ui/form-section';
import { DataTableLayout } from '@/components/ui/data-table-layout';
import { EmptyState } from '@/components/ui/empty-state';
import { StatusBadge, type BadgeVariant } from '@/components/StatusBadge';
import { Receipt, ShoppingBag } from 'lucide-react';
import { formatDate, formatCurrency } from '@/lib/utils';
import { ActionsCell } from '@/features/sale';
import { useViewSaleSheet } from '@/features/sale/components/view-sale-sheet/hooks';
import type { ICustomerSale } from '../../customer.types';

interface CustomerPurchaseHistorySectionProps {
    sales: ICustomerSale[];
    isLoading?: boolean;
}

export function CustomerPurchaseHistorySection({
    sales,
    isLoading = false,
}: CustomerPurchaseHistorySectionProps) {
    const { onOpen } = useViewSaleSheet();
    const columns: ColumnDef<ICustomerSale>[] = useMemo(
        () => [
            {
                id: 'id',
                accessorKey: 'id',
                header: 'Invoice / Reference',
                cell: ({ row }) => {
                    const rawId = row.original.id || '';
                    const shortRef = `#SL-${rawId.split('-')[0].toUpperCase()}`;
                    return (
                        <span
                            className="font-mono text-sm font-medium text-slate-700"
                            title={rawId}
                        >
                            {shortRef}
                        </span>
                    );
                },
                size: 160,
            },
            {
                id: 'saleDate',
                accessorKey: 'saleDate',
                header: 'Purchase Date',
                cell: ({ row }) => (
                    <span
                        className="text-sm text-slate-600"
                        style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}
                    >
                        {formatDate(row.original.saleDate)}
                    </span>
                ),
                size: 160,
            },
            {
                id: 'paymentMethod',
                accessorKey: 'paymentMethod',
                header: 'Payment Method',
                cell: ({ row }) => (
                    <span className="text-sm text-slate-600">
                        {row.original.paymentMethod || '—'}
                    </span>
                ),
                size: 150,
            },
            {
                id: 'status',
                accessorKey: 'status',
                header: 'Status',
                cell: ({ row }) => (
                    <StatusBadge value={row.original.status as BadgeVariant} />
                ),
                size: 140,
            },
            {
                id: 'totalAmount',
                accessorKey: 'totalAmount',
                header: () => <div className="text-right">Total Amount</div>,
                cell: ({ row }) => (
                    <div
                        className="text-right text-sm font-semibold text-slate-900"
                        style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}
                    >
                        {formatCurrency(row.original.totalAmount)}
                    </div>
                ),
                size: 140,
            },
            {
                id: 'actions',
                header: () => <div className="text-center">Actions</div>,
                cell: ({ row }) => <ActionsCell row={row as any} />,
                size: 80,
            },
        ],
        []
    );

    const [sorting, setSorting] = useState<SortingState>([
        { id: 'saleDate', desc: true },
    ]);
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 5,
    });

    const table = useReactTable({
        data: sales,
        columns,
        state: {
            sorting,
            pagination,
        },
        onSortingChange: setSorting,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    return (
        <FormSection
            title="Purchase History"
            description="Complete transaction history for this customer."
            icon={<Receipt className="w-4.5 h-4.5" strokeWidth={2} />}
            iconWrapperClassName="bg-emerald-50 text-emerald-600"
        >
            <div className="pt-2">
                <DataTableLayout
                    table={table}
                    isLoading={isLoading}
                    isEmpty={!isLoading && sales.length === 0}
                    onRowClick={(row) => onOpen(row.original.id)}
                    className="cursor-pointer"
                    emptyState={
                        <EmptyState
                            title="No purchases yet"
                            description="This customer has not completed any transactions."
                            icon={ShoppingBag}
                        />
                    }
                />
            </div>
        </FormSection>
    );
}

export function CustomerPurchaseHistorySectionSkeleton() {
    return (
        <FormSection
            title="Purchase History"
            description="Complete transaction history for this customer."
            icon={<Receipt className="w-4.5 h-4.5" strokeWidth={2} />}
            iconWrapperClassName="bg-emerald-50 text-emerald-600"
        >
            <div className="pt-2">
                <div className="h-64 w-full bg-[#F0EFEA] animate-pulse rounded-lg" />
            </div>
        </FormSection>
    );
}

CustomerPurchaseHistorySection.skeleton = CustomerPurchaseHistorySectionSkeleton;

