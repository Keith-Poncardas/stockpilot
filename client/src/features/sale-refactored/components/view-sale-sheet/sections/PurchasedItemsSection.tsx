import { useMemo } from "react";
import {
    useReactTable,
    getCoreRowModel,
    type ColumnDef,
} from "@tanstack/react-table";
import { FormSection } from "@/components/ui/form-section";
import { DataTable } from "@/components/ui/data-table";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { ShoppingBag } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { ItemCount } from "@/features/sale-refactored/components/common";
import type { SaleItem } from "../../../types";

interface PurchasedItemsSectionProps {
    items: SaleItem[];
    totalAmount: number;
}

export function PurchasedItemsSection({
    items,
    totalAmount,
}: PurchasedItemsSectionProps) {
    const columns = useMemo<ColumnDef<SaleItem>[]>(
        () => [
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
            flushContent
        >
            <div className="flex flex-col">
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

PurchasedItemsSection.Skeleton = function PurchasedItemsSectionSkeleton() {
    return (
        <FormSection
            title="Purchased Items"
            description="Loading items..."
            icon={<ShoppingBag className="h-4.5 w-4.5" strokeWidth={2} />}
            flushContent
        >
            <div className="flex flex-col">
                <div className="flex flex-col border-b border-gray-200/80">
                    <div className="flex items-center px-6 py-3 border-b border-gray-200/80">
                        <Skeleton className="h-4 w-32" />
                    </div>
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center justify-between px-6 py-4 border-b border-gray-100 last:border-0">
                            <div className="flex flex-col gap-2">
                                <Skeleton className="h-4 w-48" />
                                <Skeleton className="h-3 w-24" />
                            </div>
                            <Skeleton className="h-4 w-16" />
                        </div>
                    ))}
                </div>
                <div className="flex items-center justify-between px-6 py-4 bg-gray-50/50">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-6 w-32" />
                </div>
            </div>
        </FormSection>
    );
};
