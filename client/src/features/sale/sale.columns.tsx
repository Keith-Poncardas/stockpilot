import type { ColumnDef } from "@tanstack/react-table";
import { formatDate, formatCurrency } from "@/lib/utils";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import type { ISale } from "./sale.types";
import { SaleIdCell } from "./components";
import { formatCashierName, formatCustomerDisplayName } from "./sale.utils";

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
            formatCashierName(row.user.firstName, row.user.lastName),
        cell: ({ row }) => (
            <span className="text-sm text-gray-600 truncate block max-w-36">
                {formatCashierName(row.original.user.firstName, row.original.user.lastName)}
            </span>
        ),
        size: 140,
    },
    {
        accessorKey: "itemCount",
        header: () => <div className="text-center">Items</div>,
        cell: ({ row }) => (
            <div
                className="text-center text-sm font-medium text-gray-700"
                style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}
            >
                {row.original.itemCount}
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
        header: () => <div className="text-right">Total</div>,
        cell: ({ row }) => (
            <div
                className="text-right text-sm font-semibold text-gray-900"
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
        cell: ({ row }) => (
            <div className="flex justify-center">
                <StatusBadge value={row.original.status} size="sm" />
            </div>
        ),
        size: 120,
    },
    {
        id: "actions",
        header: () => <div className="text-center">Actions</div>,
        cell: () => (
            <div className="flex justify-center">
                {/* Placeholder — View Sale detail page not yet implemented */}
                <Button
                    variant="outline"
                    size="sm"
                    disabled
                    className="h-7 px-2 text-xs gap-1 text-gray-400 border-gray-200"
                >
                    <Eye className="w-3 h-3" />
                    View
                </Button>
            </div>
        ),
        size: 80,
    },
];
