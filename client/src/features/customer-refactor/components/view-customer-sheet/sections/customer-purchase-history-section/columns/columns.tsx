import { useMemo } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { formatDate, formatCurrency, cn, getConfigColor } from '@/lib/utils';
import { SALE_STATUS_COLORS, SALE_PAYMENT_METHOD_COLORS, PaymentMethodCell, StaticStatusCell, ActionsCell } from '@/features/sale';
import type { ISale } from '@/features/sale/types';
import type { ICustomerSale } from '@/features/customer-refactor';

export function useCustomerPurchaseHistoryColumns() {
    const columns: ColumnDef<ISale | ICustomerSale>[] = useMemo(
        () => [
            {
                id: 'id',
                accessorKey: 'id',
                header: 'Sale ID',
                cell: ({ row }) => {
                    const rawId = row.original.id || '';
                    const shortRef = `#SL-${rawId.slice(0, 8).toUpperCase()}`;
                    return (
                        <span
                            className="font-mono text-xs font-semibold text-slate-800"
                            title={rawId}
                        >
                            {shortRef}
                        </span>
                    );
                },
                size: 130,
            },
            {
                id: 'saleDate',
                accessorKey: 'saleDate',
                header: 'Purchase Date',
                cell: ({ row }) => (
                    <span className="text-sm font-mono text-slate-600">
                        {formatDate(row.original.saleDate)}
                    </span>
                ),
                size: 150,
            },
            {
                id: 'paymentMethod',
                accessorKey: 'paymentMethod',
                header: () => <div className="text-center">Payment</div>,
                meta: {
                    cellClassName: (row: ISale | ICustomerSale) =>
                        cn(
                            "p-0 text-center text-xs font-semibold tracking-wide h-[1px]",
                            getConfigColor(SALE_PAYMENT_METHOD_COLORS, row.paymentMethod as any)
                        ),
                },
                cell: ({ row }) => <PaymentMethodCell row={row as any} />,
                size: 150,
            },
            {
                id: 'status',
                accessorKey: 'status',
                header: () => <div className="text-center">Status</div>,
                meta: {
                    cellClassName: (row: ISale | ICustomerSale) =>
                        cn(
                            "p-0 text-center text-xs font-semibold tracking-wide h-[1px]",
                            getConfigColor(SALE_STATUS_COLORS, row.status as any)
                        ),
                },
                cell: ({ row }) => <StaticStatusCell row={row as any} />,
                size: 130,
            },
            {
                id: 'totalAmount',
                accessorKey: 'totalAmount',
                header: () => <div className="text-right">Total Amount</div>,
                cell: ({ row }) => (
                    <div className="text-right text-sm font-semibold font-mono text-slate-900">
                        {formatCurrency(row.original.totalAmount)}
                    </div>
                ),
                size: 130,
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

    return columns;
}
