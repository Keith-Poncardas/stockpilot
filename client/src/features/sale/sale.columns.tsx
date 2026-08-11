import type { ColumnDef } from "@tanstack/react-table";
import { cn, formatDate, formatCurrency } from "@/lib/utils";
import type { ISale } from "./sale.types";
import { ActionsCell, SaleIdCell, StatusCell } from "./components";
import { formatCashierName, formatCustomerDisplayName, getSaleStatusColor } from "./sale.utils";
import { UserInfoCell } from "@/components";

export const columns: ColumnDef<ISale>[] = [
    {
        id: "saleId",
        header: "Sale ID",
        cell: ({ row }) => <SaleIdCell row={row} />,
        size: 110,
    },
    {
        accessorKey: "saleDate",
        header: "Date & Time",
        cell: ({ row }) => (
            <span
                className="text-sm text-gray-500"
                style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}
            >
                {formatDate(row.original.saleDate)}
            </span>
        ),
        size: 130,
    },
    {
        id: "customer",
        header: "Customer",
        accessorFn: (row) =>
            formatCustomerDisplayName(row.customer?.firstName, row.customer?.lastName),
        cell: ({ row }) => (
            <span className="text-sm font-medium text-gray-800 truncate block max-w-40">
                {formatCustomerDisplayName(
                    row.original.customer?.firstName,
                    row.original.customer?.lastName
                )}
            </span>
        ),
        size: 160,
    },
    {
        id: "cashier",
        header: "Cashier",
        accessorFn: (row) =>
            formatCashierName(row.author.firstName, row.author.lastName),
        cell: ({ row }) => <UserInfoCell user={row.original.author} />,
        size: 140,
    },
    {
        id: "itemCount",
        header: () => <div className="text-center">Items</div>,
        cell: ({ row }) => (
            <div
                className="text-center text-sm font-medium text-gray-700"
                style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}
            >
                {row.original.saleItems?.length ?? '—'}
            </div>
        ),
        size: 70,
    },
    {
        accessorKey: "paymentMethod",
        header: "Payment",
        cell: ({ row }) => (
            <span className="text-sm text-gray-600">
                {row.original.paymentMethod || '—'}
            </span>
        ),
        size: 110,
    },
    {
        accessorKey: "totalAmount",
        header: () => <div className="text-left">Total</div>,
        cell: ({ row }) => (
            <div
                className="text-left text-sm font-semibold text-gray-900"
                style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}
            >
                {formatCurrency(row.original.totalAmount)}
            </div>
        ),
        size: 120,
    },
    {
        accessorKey: "status",
        header: () => <div className="text-center">Status</div>,
        meta: {
            cellClassName: (row: ISale) => cn(
                "p-0 text-center text-xs font-semibold tracking-wide h-[1px]",
                getSaleStatusColor(row.status)
            ),
        },
        cell: ({ row }) => <StatusCell row={row} />,
        size: 130,
    },
    {
        id: "actions",
        header: () => <div className="text-center">Actions</div>,
        cell: ({ row }) => <ActionsCell row={row} />,
        size: 80,
    },
];
