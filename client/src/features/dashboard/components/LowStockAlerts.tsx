import { useMemo } from "react";
import {
    useReactTable,
    getCoreRowModel,
    type ColumnDef,
} from "@tanstack/react-table";
import { FormSection } from "@/components/ui/form-section";
import { DataTable } from "@/components/ui/data-table";
import { EmptyState } from "@/components/ui/empty-state";
import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { PATHS } from "@/routes";
import { ActionCellContent } from "@/components/common/action-cell-content/ActionCellContent";
import {
    getStockStatusColor,
    getStockStatusLabel,
    getQtyClass,
} from "@/features/inventory/inventory.utils";

export type StockAlertStatus = "CRITICAL_OUT" | "LOW_STOCK" | "WELL_STOCKED" | string;

export interface LowStockAlertItem {
    /** Unique product or inventory ID */
    id: string;
    /** Product Name */
    productName: string;
    /** SKU or optional subtitle */
    sku?: string;
    /** Current quantity on hand */
    quantityOnHand: number;
    /** Minimum reorder threshold */
    reorderLevel: number;
    /** Stock alert status */
    stockStatus: StockAlertStatus;
}

export interface LowStockAlertsProps {
    /** List of low stock alert items */
    alerts?: LowStockAlertItem[];
    /** Loading state for API integration */
    loading?: boolean;
    /** Optional custom title */
    title?: string;
    /** Optional custom description */
    description?: string;
    /** Optional callback for clicking Review button */
    onReviewAll?: () => void;
    className?: string;
}

const DUMMY_LOW_STOCK_ALERTS: LowStockAlertItem[] = [
    {
        id: "INV-001",
        productName: "USB-C Hub 7-Port",
        sku: "HUB-USBC-007",
        quantityOnHand: 2,
        reorderLevel: 10,
        stockStatus: "CRITICAL_OUT",
    },
    {
        id: "INV-002",
        productName: "HDMI Cable 2m",
        sku: "CBL-HDMI-2M0",
        quantityOnHand: 5,
        reorderLevel: 10,
        stockStatus: "CRITICAL_OUT",
    },
    {
        id: "INV-003",
        productName: "Laptop Stand Adj.",
        sku: "STD-LPT-ADJ1",
        quantityOnHand: 9,
        reorderLevel: 10,
        stockStatus: "LOW_STOCK",
    },
];

export function LowStockAlerts({
    alerts,
    loading = false,
    title = "Low Stock Alerts",
    description = "Items at or below reorder threshold",
    onReviewAll,
    className,
}: LowStockAlertsProps) {
    const navigate = useNavigate();
    const data = alerts ?? DUMMY_LOW_STOCK_ALERTS;

    const handleReviewAll = () => {
        if (onReviewAll) {
            onReviewAll();
        } else {
            navigate(PATHS.inventory.root);
        }
    };

    const columns = useMemo<ColumnDef<LowStockAlertItem>[]>(
        () => [
            {
                accessorKey: "productName",
                header: "Product",
                cell: ({ row }) => (
                    <div>
                        <div className="font-semibold text-slate-900 dark:text-slate-100 text-xs truncate max-w-44">
                            {row.original.productName}
                        </div>
                        {row.original.sku && (
                            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono truncate max-w-40">
                                {row.original.sku}
                            </div>
                        )}
                    </div>
                ),
                size: 160,
            },
            {
                accessorKey: "quantityOnHand",
                header: () => <div className="text-center">On Hand</div>,
                cell: ({ row }) => (
                    <div
                        className={cn(
                            "text-center font-mono text-xs font-bold",
                            getQtyClass(row.original.quantityOnHand, row.original.reorderLevel)
                        )}
                    >
                        {row.original.quantityOnHand}
                    </div>
                ),
                size: 90,
            },
            {
                accessorKey: "reorderLevel",
                header: () => <div className="text-center">Reorder At</div>,
                cell: ({ row }) => (
                    <div className="text-center font-mono text-xs text-slate-500 dark:text-slate-400">
                        {row.original.reorderLevel}
                    </div>
                ),
                size: 90,
            },
            {
                accessorKey: "stockStatus",
                header: () => <div className="text-center">Status</div>,
                meta: {
                    cellClassName: (row: LowStockAlertItem) =>
                        cn(
                            "p-0 text-center text-xs font-semibold tracking-wide h-[1px]",
                            getStockStatusColor(row.stockStatus)
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
                size: 110,
            },
        ],
        []
    );

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <FormSection
            title={title}
            description={description}
            icon={<AlertTriangle className="w-5 h-5" />}
            iconWrapperClassName="bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400"
            actions={
                <button
                    type="button"
                    onClick={handleReviewAll}
                    className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline inline-flex items-center gap-1"
                >
                    Review →
                </button>
            }
            className={cn("h-full", className)}
        >
            {!loading && data.length === 0 ? (
                <div className="mt-2 flex-1 flex flex-col">
                    <EmptyState
                        icon={AlertTriangle}
                        title="No low stock alerts"
                        description="All inventory items are currently stocked above their reorder levels."
                        className="flex-1 h-full"
                    />
                </div>
            ) : (
                <div className="overflow-hidden rounded-xl border border-gray-100 dark:border-slate-800 mt-2">
                    <DataTable table={table} isLoading={loading} />
                </div>
            )}
        </FormSection>
    );
}

export default LowStockAlerts;
