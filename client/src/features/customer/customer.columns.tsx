import type { ColumnDef } from "@tanstack/react-table";
import { formatDate, formatCurrency } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import type { ICustomer } from "./customer.types";
import { ActionsCell } from "./components";
import { formatLocation, formatCustomerName } from "./customer.utils";

export const columns: ColumnDef<ICustomer>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                className="rounded-none border-gray-400"
                checked={
                    table.getIsAllPageRowsSelected()
                        ? true
                        : table.getIsSomePageRowsSelected()
                            ? "indeterminate"
                            : false
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                className="rounded-none border-gray-400"
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
        size: 48,
    },
    {
        id: "name",
        header: "Customer Name",
        accessorFn: (row) => formatCustomerName(row.firstName, row.lastName),
        cell: ({ row }) => (
            <span className="text-sm font-bold text-gray-900 truncate block max-w-48">
                {formatCustomerName(row.original.firstName, row.original.lastName)}
            </span>
        ),
        size: 200,
    },
    {
        accessorKey: "phone",
        header: "Phone",
        cell: ({ row }) => (
            <span
                className="text-sm text-gray-600 truncate block max-w-36"
                style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}
            >
                {row.original.phone || '—'}
            </span>
        ),
        size: 140,
    },
    {
        accessorKey: "email",
        header: "Email",
        cell: ({ row }) => (
            <span className="text-sm text-gray-500 truncate block max-w-48" title={row.original.email ?? undefined}>
                {row.original.email || '—'}
            </span>
        ),
        size: 200,
    },
    {
        id: "location",
        header: "Location",
        accessorFn: (row) => formatLocation(row.cityCode, row.provinceCode),
        cell: ({ row }) => (
            <span className="text-sm text-gray-600">
                {formatLocation(row.original.cityCode, row.original.provinceCode)}
            </span>
        ),
        size: 160,
    },
    {
        id: "totalOrders",
        accessorFn: (row) => row.purchaseSummary.totalOrders,
        header: () => <div className="text-left">Total Orders</div>,
        cell: ({ row }) => (
            <div
                className="text-left text-sm font-medium text-gray-800"
                style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}
            >
                {row.original.purchaseSummary.totalOrders.toLocaleString()}
            </div>
        ),
        size: 110,
    },
    {
        id: "totalSpent",
        accessorFn: (row) => row.purchaseSummary.totalSpent,
        header: () => <div className="text-left">Total Spent</div>,
        cell: ({ row }) => (
            <div
                className="text-left text-sm font-medium text-gray-800"
                style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}
            >
                {formatCurrency(row.original.purchaseSummary.totalSpent)}
            </div>
        ),
        size: 130,
    },
    {
        id: "lastPurchase",
        accessorFn: (row) => row.purchaseSummary.lastPurchase,
        header: "Last Purchase",
        cell: ({ row }) => (
            <span
                className="text-sm text-gray-400"
                style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}
            >
                {row.original.purchaseSummary.lastPurchase ? formatDate(row.original.purchaseSummary.lastPurchase) : '—'}
            </span>
        ),
        size: 130,
    },
    {
        accessorKey: "createdAt",
        header: "Customer Since",
        cell: ({ row }) => (
            <span
                className="text-sm text-gray-400"
                style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}
            >
                {formatDate(row.original.createdAt)}
            </span>
        ),
        size: 130,
    },
    {
        id: "actions",
        header: () => <div className="text-center">Actions</div>,
        cell: ({ row }) => <ActionsCell row={row} />,
        size: 80,
    },
];
