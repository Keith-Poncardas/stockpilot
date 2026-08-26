import { useEffect } from "react";
import { useDataTable } from "@/hooks/useDataTable";
import { FormSection } from "@/components/ui/form-section";
import { DataTable } from "@/components/ui/data-table";
import { EmptyState } from "@/components/ui/empty-state";
import { ShoppingBag } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { columns } from "./columns";
import { PurchasedItemsSectionSkeleton } from "./skeleton";
import type { PurchasedItemsSectionProps } from "./types";

export function PurchasedItemsSection({
    items,
    totalAmount,
}: PurchasedItemsSectionProps) {
    const { table, setQueryData } = useDataTable({
        columns,
        initialPageSize: items.length > 0 ? items.length : 10,
    });

    useEffect(() => {
        setQueryData({
            data: items,
            meta: { totalPages: 1, totalItems: items.length },
        });
    }, [items, setQueryData]);

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
PurchasedItemsSection.Skeleton = PurchasedItemsSectionSkeleton;
