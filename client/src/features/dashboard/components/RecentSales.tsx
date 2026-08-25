import { useMemo } from "react";
import {
    useReactTable,
    getCoreRowModel,
    type ColumnDef,
} from "@tanstack/react-table";
import { FormSection } from "@/components/ui/form-section";
import { DataTable } from "@/components/ui/data-table";
import { EmptyState } from "@/components/ui/empty-state";
import { Receipt, ShoppingCart } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { PATHS } from "@/routes";
import { ActionCellContent } from "@/components/common/action-cell-content/ActionCellContent";
import { getSaleStatusColor } from "@/features/sale/sale.utils";

export type SaleStatus = "COMPLETED" | "PENDING" | "REFUNDED" | "VOIDED" | string;

export interface RecentSaleItem {
    /** Unique transaction ID (e.g. "#TXN-0284") */
    id: string;
    /** Customer name */
    customer: string;
    /** Optional product or items summary (e.g. "Wireless Mouse Pro") */
    product?: string;
    /** Formatted amount string or raw number */
    amount: number;
    /** Number of units sold */
    quantity: number;
    /** Transaction status */
    status: SaleStatus;
}

export interface RecentSalesProps {
    /** List of recent sales transactions */
    sales?: RecentSaleItem[];
    /** Loading state for API integration */
    loading?: boolean;
    /** Optional custom title */
    title?: string;
    /** Optional custom description */
    description?: string;
    /** Optional callback for clicking View All */
    onViewAll?: () => void;
    className?: string;
}

const DUMMY_RECENT_SALES: RecentSaleItem[] = [
    {
        id: "#TXN-0284",
        customer: "Maria Santos",
        product: "Wireless Mouse Pro",
        quantity: 2,
        amount: 4850,
        status: "COMPLETED",
    },
    {
        id: "#TXN-0283",
        customer: "Jose Reyes",
        product: "USB-C Hub 7-Port (x2)",
        quantity: 5,
        amount: 12300,
        status: "COMPLETED",
    },
    {
        id: "#TXN-0282",
        customer: "Walk-in Customer",
        product: "HDMI Cable 2m",
        quantity: 1,
        amount: 1200,
        status: "COMPLETED",
    },
    {
        id: "#TXN-0281",
        customer: "Ana Gonzales",
        product: "Mechanical Keyboard",
        quantity: 1,
        amount: 8750,
        status: "PENDING",
    },
];

export function RecentSales({
    sales,
    loading = false,
    title = "Recent Sales",
    description = "Latest completed and pending transactions",
    onViewAll,
    className,
}: RecentSalesProps) {
    const navigate = useNavigate();
    const data = sales ?? DUMMY_RECENT_SALES;

    const handleViewAll = () => {
        if (onViewAll) {
            onViewAll();
        } else {
            navigate(PATHS.sales.root);
        }
    };

    const columns = useMemo<ColumnDef<RecentSaleItem>[]>(
        () => [
            {
                accessorKey: "id",
                header: "Sale ID",
                cell: ({ row }) => {
                    const id = row.original.id;
                    const displayId = id.startsWith("#") ? id : `#${id.slice(0, 8).toUpperCase()}`;
                    return (
                        <div
                            className="font-mono text-xs text-slate-500 dark:text-slate-400 font-medium truncate max-w-20"
                            title={id}
                        >
                            {displayId}
                        </div>
                    );
                },
                size: 90,
            },
            {
                accessorKey: "customer",
                header: "Customer & Item",
                cell: ({ row }) => (
                    <div>
                        <div className="font-semibold text-slate-900 dark:text-slate-100 text-xs">
                            {row.original.customer}
                        </div>
                        {row.original.product && (
                            <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-40">
                                {row.original.product}
                            </div>
                        )}
                    </div>
                ),
                size: 160,
            },
            {
                accessorKey: "quantity",
                header: "Qty",
                cell: ({ row }) => (
                    <div className="font-mono text-xs text-slate-500 dark:text-slate-400 font-medium">
                        {row.original.quantity}
                    </div>
                ),
                size: 90,
            },
            {
                accessorKey: "amount",
                header: () => <div className="text-left">Amount</div>,
                cell: ({ row }) => (
                    <div className="font-semibold text-left text-xs text-slate-800 dark:text-slate-200">
                        {formatCurrency(row.original.amount)}
                    </div>
                ),
                size: 100,
            },
            {
                accessorKey: "status",
                header: () => <div className="text-center">Status</div>,
                meta: {
                    cellClassName: (row: RecentSaleItem) =>
                        cn(
                            "p-0 text-center text-xs font-semibold tracking-wide h-[1px]",
                            getSaleStatusColor(row.status)
                        ),
                },
                cell: ({ row }) => (
                    <ActionCellContent
                        label={row.original.status}
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
            icon={<Receipt className="w-5 h-5" />}
            iconWrapperClassName="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400"
            actions={
                <button
                    type="button"
                    onClick={handleViewAll}
                    className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline inline-flex items-center gap-1"
                >
                    View all →
                </button>
            }
            className={cn("h-full", className)}
        >
            {!loading && data.length === 0 ? (
                <div className="mt-2 flex-1 flex flex-col">
                    <EmptyState
                        icon={ShoppingCart}
                        title="No recent sales"
                        description="Your sales transactions will appear here once you start selling."
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

export default RecentSales;
