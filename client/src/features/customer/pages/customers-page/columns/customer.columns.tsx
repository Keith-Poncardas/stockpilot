import type { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import type { ICustomer } from '../../../types';
import {
    Actions,
    LocationCell,
    CustomerInfoCell,
    PhoneCell,
    EmailCell,
    TotalOrdersCell,
    TotalSpentCell,
    LastPurchaseCell,
    CustomerSinceCell,
} from '../cells';
import { formatCustomerName, formatLocation } from '@/features/customer/utils';

export const columns: ColumnDef<ICustomer>[] = [
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
        id: 'name',
        header: 'Customer',
        accessorFn: (row) => formatCustomerName(row.firstName, row.lastName),
        cell: ({ row }) => <CustomerInfoCell row={row} />,
        size: 240,
    },
    {
        accessorKey: 'phone',
        header: 'Phone Number',
        cell: ({ row }) => <PhoneCell row={row} />,
        size: 160,
    },
    {
        accessorKey: 'email',
        header: 'Email Address',
        cell: ({ row }) => <EmailCell row={row} />,
        size: 200,
    },
    {
        id: 'location',
        header: 'Location',
        accessorFn: (row) => formatLocation(row.cityCode, row.provinceCode),
        cell: ({ row }) => <LocationCell row={row} />,
        size: 170,
    },
    {
        id: 'totalOrders',
        accessorFn: (row) => row.purchaseSummary?.totalOrders ?? 0,
        header: () => <div className="text-center">Orders</div>,
        cell: ({ row }) => <TotalOrdersCell row={row} />,
        size: 100,
    },
    {
        id: 'totalSpent',
        accessorFn: (row) => row.purchaseSummary?.totalSpent ?? 0,
        header: () => <div className="text-right">Total Spent</div>,
        cell: ({ row }) => <TotalSpentCell row={row} />,
        size: 140,
    },
    {
        id: 'lastPurchase',
        accessorFn: (row) => row.purchaseSummary?.lastPurchase,
        header: 'Last Purchase',
        cell: ({ row }) => <LastPurchaseCell row={row} />,
        size: 140,
    },
    {
        accessorKey: 'createdAt',
        header: 'Customer Since',
        cell: ({ row }) => <CustomerSinceCell row={row} />,
        size: 130,
    },
    {
        id: 'actions',
        header: () => <div className="text-center">Actions</div>,
        cell: ({ row }) => <Actions row={row} />,
        size: 80,
    },
];
