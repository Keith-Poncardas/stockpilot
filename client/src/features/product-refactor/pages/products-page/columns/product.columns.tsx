import type { ColumnDef } from '@tanstack/react-table';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import type { IProduct } from '../../../types';
import { getProductStatusColor } from '../../../utils';
import {
    StatusCell,
    ActionsCell,
    ProductCell,
    DescriptionCell,
    SellingPriceCell,
    CostMarginCell,
    CreatedAtCell,
} from '../cells';

export const columns: ColumnDef<IProduct>[] = [
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
        size: 44,
    },
    {
        accessorKey: 'name',
        header: 'Product',
        cell: ({ row }) => <ProductCell row={row} />,
        size: 270,
    },
    {
        accessorKey: 'description',
        header: 'Description',
        cell: ({ row }) => <DescriptionCell row={row} />,
        size: 280,
    },
    {
        accessorKey: 'unitPrice',
        header: () => <div className="text-left">Selling Price</div>,
        cell: ({ row }) => <SellingPriceCell row={row} />,
        size: 130,
    },
    {
        accessorKey: 'costPrice',
        header: () => <div className="text-left">Cost & Margin</div>,
        cell: ({ row }) => <CostMarginCell row={row} />,
        size: 140,
    },
    {
        accessorKey: 'status',
        header: () => <div className="text-center">Status</div>,
        meta: {
            cellClassName: (row: IProduct) =>
                cn(
                    'p-0 text-center text-xs font-semibold tracking-wide h-[1px]',
                    getProductStatusColor(row.status)
                ),
        },
        cell: ({ row }) => <StatusCell row={row} />,
        size: 130,
    },
    {
        accessorKey: 'createdAt',
        header: 'Created',
        cell: ({ row }) => <CreatedAtCell row={row} />,
        size: 130,
    },
    {
        id: 'actions',
        header: () => <div className="text-center">Actions</div>,
        cell: ({ row }) => <ActionsCell row={row} />,
        size: 80,
    },
];
