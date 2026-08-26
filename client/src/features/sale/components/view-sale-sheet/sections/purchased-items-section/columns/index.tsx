import { type ColumnDef } from "@tanstack/react-table";
import { formatCurrency } from "@/lib/utils";
import { ItemCount } from "@/features/sale/components/common";
import type { SaleItem } from "@/features/sale/types";

export const columns: ColumnDef<SaleItem>[] = [
    {
        id: "name",
        header: "Item",
        cell: ({ row }) => (
            <div>
                <div className="font-semibold text-gray-900 dark:text-gray-100">
                    {row.original.product.name}
                </div>
                <div className="text-xs text-gray-400 font-mono mt-0.5">
                    {row.original.product.sku}
                </div>
            </div>
        ),
        size: 240,
    },
    {
        accessorKey: "unitPrice",
        header: () => <div className="text-left">Unit Price</div>,
        cell: ({ row }) => (
            <div className="text-left font-mono text-gray-600 dark:text-gray-300">
                {formatCurrency(row.original.unitPrice)}
            </div>
        ),
        size: 120,
    },
    {
        accessorKey: "quantity",
        header: () => <div className="text-center">Qty</div>,
        cell: ({ row }) => <ItemCount count={row.original.quantity} />,
        size: 80,
    },
    {
        id: "totalPrice",
        header: () => <div className="text-left">Total</div>,
        cell: ({ row }) => (
            <div className="text-left font-mono font-semibold text-gray-900 dark:text-gray-100">
                {formatCurrency(row.original.quantity * row.original.unitPrice)}
            </div>
        ),
        size: 130,
    },
];

