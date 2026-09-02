import { type ColumnDef } from "@tanstack/react-table";
import { formatCurrency } from "@/lib/utils";
import { ItemCount } from "@/features/sale/components/common";
import type { SaleItem } from "@/features/sale/types";
import { ItemCell, FreeItemsCell } from "./cells";

export const columns: ColumnDef<SaleItem>[] = [
    {
        id: "name",
        header: "Item",
        cell: ({ row }) => <ItemCell row={row} />,
        size: 240,
    },
    {
        id: "freeItems",
        header: "Free Items",
        cell: ({ row }) => <FreeItemsCell row={row} />,
        size: 170,
    },
    {
        accessorKey: "unitPrice",
        header: () => <div className="text-left">Unit Price</div>,
        cell: ({ row }) => (
            <div className="text-left font-mono text-gray-600 dark:text-gray-300">
                {formatCurrency(row.original.unitPrice)}
            </div>
        ),
        size: 110,
    },
    {
        accessorKey: "quantity",
        header: () => <div className="text-center">Qty</div>,
        cell: ({ row }) => <ItemCount count={row.original.quantity} />,
        size: 70,
    },
    {
        id: "totalPrice",
        header: () => <div className="text-left">Total</div>,
        cell: ({ row }) => (
            <div className="text-left font-mono font-semibold text-gray-900 dark:text-gray-100">
                {formatCurrency(row.original.quantity * row.original.unitPrice)}
            </div>
        ),
        size: 120,
    },
];

