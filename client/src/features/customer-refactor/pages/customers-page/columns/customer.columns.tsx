import type { ColumnDef } from "@tanstack/react-table";
import { formatDate, formatCurrency } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { UserInfoCell, NumberBadge } from "@/components";
import type { ICustomer } from "../../../types";
import { Actions, LocationCell } from "../cells";
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
        size: 44,
    },
    {
        id: "name",
        header: "Customer Name",
        accessorFn: (row) => formatCustomerName(row.firstName, row.lastName),
        cell: ({ row }) => (
            <UserInfoCell
                user={{
                    id: row.original.id,
                    firstName: row.original.firstName ?? undefined,
                    lastName: row.original.lastName ?? undefined,
                }}
                type="customer"
                isLink={false}
            />
        ),
        size: 210,
    },
    {
        accessorKey: "phone",
        header: "Phone Number",
        cell: ({ row }) => (
            <span className="text-sm font-mono text-slate-600">
                {row.original.phone || '—'}
            </span>
        ),
        size: 140,
    },
    {
        accessorKey: "email",
        header: "Email Address",
        cell: ({ row }) => (
            <span
                className="text-xs font-mono text-slate-500 truncate block max-w-48"
                title={row.original.email ?? undefined}
            >
                {row.original.email || '—'}
            </span>
        ),
        size: 190,
    },
    {
        id: "location",
        header: "Location",
        accessorFn: (row) => formatLocation(row.cityCode, row.provinceCode),
        cell: ({ row }) => <LocationCell row={row} />,
        size: 160,
    },
    {
        id: "totalOrders",
        accessorFn: (row) => row.purchaseSummary?.totalOrders ?? 0,
        header: () => <div className="text-center">Total Orders</div>,
        cell: ({ row }) => (
            <NumberBadge
                count={row.original.purchaseSummary?.totalOrders ?? 0}
                variant="brand"
            />
        ),
        size: 110,
    },
    {
        id: "totalSpent",
        accessorFn: (row) => row.purchaseSummary?.totalSpent ?? 0,
        header: () => <div className="text-right">Total Spent</div>,
        cell: ({ row }) => (
            <div className="text-right text-sm font-semibold font-mono text-slate-900">
                {formatCurrency(row.original.purchaseSummary?.totalSpent ?? 0)}
            </div>
        ),
        size: 130,
    },
    {
        id: "lastPurchase",
        accessorFn: (row) => row.purchaseSummary?.lastPurchase,
        header: "Last Purchase",
        cell: ({ row }) => (
            <span className="text-sm font-mono text-slate-500">
                {row.original.purchaseSummary?.lastPurchase
                    ? formatDate(row.original.purchaseSummary.lastPurchase)
                    : '—'}
            </span>
        ),
        size: 130,
    },
    {
        accessorKey: "createdAt",
        header: "Customer Since",
        cell: ({ row }) => (
            <span className="text-sm font-mono text-slate-500">
                {formatDate(row.original.createdAt)}
            </span>
        ),
        size: 130,
    },
    {
        id: "actions",
        header: () => <div className="text-center">Actions</div>,
        cell: ({ row }) => <Actions row={row} />,
        size: 80,
    },
];
