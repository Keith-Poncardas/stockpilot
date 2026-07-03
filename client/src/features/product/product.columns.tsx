import type { ColumnDef } from "@tanstack/react-table"
import { cn, formatDate } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"
import type { IProduct } from "./product.types"
import { getProductStatusColor } from "./product.utils"
import { StatusCell, ActionsCell } from "./components"

function formatCurrency(value: number) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'PHP',
        minimumFractionDigits: 2,
    }).format(value)
}

export const columns: ColumnDef<IProduct>[] = [
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
        accessorKey: "sku",
        header: "SKU",
        cell: ({ row }) => (
            <span className="text-xs text-gray-400" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>{row.original.sku}</span>
        ),
        size: 100,
    },
    {
        accessorKey: "name",
        header: "Product",
        cell: ({ row }) => (
            <span className="text-sm font-bold text-gray-900">{row.original.name}</span>
        ),
        size: 260,
    },
    {
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => (
            <span className="text-sm text-gray-500 line-clamp-1 ">
                {row.original.description || '—'}
            </span>
        ),
        size: 220,
    },
    {
        accessorKey: "unitPrice",
        header: () => <div className="text-left">Unit Price</div>,
        cell: ({ row }) => (
            <div className="text-left text-sm font-medium text-gray-800" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
                {formatCurrency(row.original.unitPrice)}
            </div>
        ),
        size: 120,
    },
    {
        accessorKey: "costPrice",
        header: () => <div className="text-left">Cost Price</div>,
        cell: ({ row }) => (
            <div className="text-left text-sm text-gray-500" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
                {row.original.costPrice != null ? formatCurrency(row.original.costPrice) : '—'}
            </div>
        ),
        size: 120,
    },
    {
        accessorKey: "status",
        header: () => <div className="text-center">Status</div>,
        meta: {
            cellClassName: (row: IProduct) => cn(
                "p-0 text-center text-xs font-semibold tracking-wide h-[1px]",
                getProductStatusColor(row.status)
            ),
        },
        cell: ({ row }) => <StatusCell row={row} />,
        size: 130,
    },
    {
        accessorKey: "createdAt",
        header: "Created",
        cell: ({ row }) => (
            <span className="text-sm text-gray-400" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>{formatDate(row.original.createdAt)}</span>
        ),
        size: 140,
    },
    {
        id: "actions",
        header: () => <div className="text-center">Actions</div>,
        cell: ({ row }) => <ActionsCell row={row} />,
        size: 80,
    },
]
