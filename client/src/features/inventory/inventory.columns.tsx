import type { ColumnDef } from '@tanstack/react-table'
import { Checkbox } from '@/components/ui/checkbox'
import { cn, formatDate } from '@/lib/utils'
import type { IInventory } from './inventory.types'
import { getStockStatusColor, getStockStatusLabel, getQtyClass } from './inventory.utils'
import { InventoryActionsCell } from './components'
import { ActionCellContent } from '@/components/common/action-cell-content/ActionCellContent'

export const columns: ColumnDef<IInventory>[] = [
    {
        id: 'select',
        header: ({ table }) => (
            <Checkbox
                className="rounded-none border-gray-400"
                checked={
                    table.getIsAllPageRowsSelected()
                        ? true
                        : table.getIsSomePageRowsSelected()
                            ? 'indeterminate'
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
        accessorKey: 'product.name',
        id: 'name',
        header: 'Product',
        cell: ({ row }) => (
            <span className="text-sm font-bold text-gray-900 truncate block max-w-100">
                {row.original.product.name}
            </span>
        ),
        size: 220,
    },
    {
        accessorKey: 'product.sku',
        id: 'sku',
        header: 'SKU',
        cell: ({ row }) => (
            <span className="text-xs text-gray-400 truncate block max-w-36 font-mono" title={row.original.product.sku}>
                {row.original.product.sku}
            </span>
        ),
        size: 140,
    },
    {
        accessorKey: 'quantityOnHand',
        header: 'Qty on Hand',
        cell: ({ row }) => {
            const { quantityOnHand, reorderLevel } = row.original
            return (
                <span className={cn('font-mono text-sm', getQtyClass(quantityOnHand, reorderLevel))}>
                    {quantityOnHand.toLocaleString()}
                </span>
            )
        },
        size: 120,
    },
    {
        accessorKey: 'reorderLevel',
        header: 'Reorder Level',
        cell: ({ row }) => (
            <span className="font-mono text-sm text-gray-400">
                {row.original.reorderLevel}
            </span>
        ),
        size: 120,
    },
    {
        accessorKey: 'maxStock',
        header: 'Max Stock',
        cell: ({ row }) => (
            <span className="font-mono text-sm text-gray-400">
                {row.original.maxStock}
            </span>
        ),
        size: 120,
    },
    {
        id: 'stockStatus',
        header: () => <div className="text-center">Status</div>,
        meta: {
            cellClassName: (row: IInventory) => {
                return cn(
                    'p-0 text-center text-xs font-semibold tracking-wide h-[1px]',
                    getStockStatusColor(row.stockStatus)
                )
            },
        },
        cell: ({ row }) => (
            <ActionCellContent
                label={getStockStatusLabel(row.original.stockStatus)}
                approvalStatus=""
                isLocked={false}
                withBorder={false}
            />
        ),
        size: 120,
    },
    {
        accessorKey: 'updatedAt',
        header: 'Last Updated',
        cell: ({ row }) => (
            <span className="text-sm text-gray-400">
                {formatDate(row.original.updatedAt)}
            </span>
        ),
        size: 140,
    },
    {
        id: 'actions',
        header: () => <div className="text-center">Actions</div>,
        cell: ({ row }) => <InventoryActionsCell row={row} />,
        size: 80,
    },
]
