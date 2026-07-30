import { useMemo } from "react";
import {
    useReactTable,
    getCoreRowModel,
    type ColumnDef,
} from "@tanstack/react-table";
import { FormSection } from "@/components/ui/form-section";
import { DataTable } from "@/components/ui/data-table";
import { EmptyState } from "@/components/ui/empty-state";
import { ShoppingBag } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import type { ISaleDetailItem } from "../../sale.types";

interface PurchasedItemsSectionProps {
    items: ISaleDetailItem[];
    totalAmount: number;
}

export function PurchasedItemsSection({
    items,
    totalAmount,
}: PurchasedItemsSectionProps) {
    const columns = useMemo<ColumnDef<ISaleDetailItem>[]>(
        () => [
            {
                accessorKey: "name",
                header: "Item",
                cell: ({ row }) => (
                    <div>
                        <div className="font-semibold text-gray-900 dark:text-gray-100">
                            {row.original.name}
                        </div>
                        <div className="text-xs text-gray-400 font-mono mt-0.5">
                            {row.original.sku}
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
                cell: ({ row }) => (
                    <div className="text-center font-medium text-gray-700 dark:text-gray-300">
                        x{row.original.quantity}
                    </div>
                ),
                size: 80,
            },
            {
                accessorKey: "totalPrice",
                header: () => <div className="text-left">Total</div>,
                cell: ({ row }) => (
                    <div className="text-left font-mono font-semibold text-gray-900 dark:text-gray-100">
                        {formatCurrency(row.original.totalPrice)}
                    </div>
                ),
                size: 130,
            },
        ],
        []
    );

    const table = useReactTable({
        data: items,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <FormSection
            title="Purchased Items"
            description={`${items.length} item(s) in this transaction`}
            icon={<ShoppingBag className="h-4.5 w-4.5" strokeWidth={2} />}
        >
            <div className="overflow-hidden rounded-xl border border-gray-100">
                {items.length > 0 ? (
                    <>
                        <DataTable table={table} />
                        <div className="flex items-center justify-between border-t border-gray-200/80 bg-linear-to-r from-gray-50/90 via-gray-50/50 to-indigo-50/30  px-6 py-4">
                            <div className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                Total ({items.length} {items.length === 1 ? "item" : "items"})
                            </div>

                            <div className="flex items-baseline gap-3">
                                <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                                    Total Amount
                                </span>
                                <span className="text-xl font-bold tabular-nums tracking-tight text-indigo-600 dark:text-indigo-400">
                                    {formatCurrency(totalAmount)}
                                </span>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="p-8">
                        <EmptyState
                            title="No items found"
                            description="There are no items listed in this transaction."
                            icon={ShoppingBag}
                        />
                    </div>
                )}
            </div>
        </FormSection>
    );
}
