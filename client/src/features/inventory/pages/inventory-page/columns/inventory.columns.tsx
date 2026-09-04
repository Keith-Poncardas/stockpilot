import type { ColumnDef } from '@tanstack/react-table';
import { cn, getConfigColor } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import type { IInventory } from '@/features/inventory/types';
import { INVENTORY_STOCK_STATUS_COLORS } from '@/features/inventory/constants';
import { getStockStatusLabel } from '@/features/inventory/utils';
import { ActionCellContent } from '@/components/common/action-cell-content/ActionCellContent';
import {
    ProductCell,
    StockQuantityCell,
    StockThresholdsCell,
    StockValueCell,
    LastUpdatedCell,
    InventoryActionsCell,
} from '../cells';

export const inventoryColumns: ColumnDef<IInventory>[] = [
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
                aria-label="Select all rows"
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
        accessorKey: 'product.name',
        id: 'name',
        header: 'Product & SKU',
        cell: ({ row }) => <ProductCell row={row} />,
        size: 270,
    },
    {
        accessorKey: 'quantityOnHand',
        id: 'quantityOnHand',
        header: () => <div className="text-left">Stock Level</div>,
        cell: ({ row }) => <StockQuantityCell row={row} />,
        size: 190,
    },
    {
        id: 'thresholds',
        header: () => <div className="text-left">Thresholds</div>,
        cell: ({ row }) => <StockThresholdsCell row={row} />,
        size: 130,
    },
    {
        id: 'inventoryValue',
        header: () => <div className="text-left">Stock Valuation</div>,
        cell: ({ row }) => <StockValueCell row={row} />,
        size: 140,
    },
    {
        accessorKey: 'stockStatus',
        id: 'stockStatus',
        header: () => <div className="text-center">Status</div>,
        meta: {
            cellClassName: (row: IInventory) =>
                cn(
                    'p-0 text-center text-xs font-semibold tracking-wide h-[1px]',
                    getConfigColor(INVENTORY_STOCK_STATUS_COLORS, row.stockStatus)
                ),
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
        id: 'updatedAt',
        header: 'Updated',
        cell: ({ row }) => <LastUpdatedCell row={row} />,
        size: 120,
    },
    {
        id: 'actions',
        header: () => <div className="text-center">Actions</div>,
        cell: ({ row }) => <InventoryActionsCell row={row} />,
        size: 80,
    },
];

export const columns = inventoryColumns;
