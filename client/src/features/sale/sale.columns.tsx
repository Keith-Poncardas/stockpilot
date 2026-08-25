import type { ColumnDef } from "@tanstack/react-table";
import { cn, formatDate, formatTime, formatCurrency } from "@/lib/utils";
import type { ISale } from "./sale.types";
import { ActionsCell, SaleIdCell, StatusCell } from "./components";
import { formatCashierName, formatCustomerDisplayName, getSaleStatusColor } from "./sale.utils";
import { UserInfoCell } from "@/components";

export const columns: ColumnDef<ISale>[] = [
    {
        id: "saleId",
        header: "Sale ID",
        cell: ({ row }) => <SaleIdCell row={row} />,
        size: 110,
    },
    {
        accessorKey: "saleDate",
        header: "Date & Time",
        cell: ({ row }) => {
            const dateVal = row.original.saleDate;
            if (!dateVal) return <span className="text-sm text-slate-400">—</span>;
            try {
                return (
                    <div className="flex flex-col text-left">
                        <span className="text-sm font-medium text-slate-700">{formatDate(dateVal)}</span>
                        <span className="text-xs text-slate-400 font-mono mt-0.5">{formatTime(dateVal)}</span>
                    </div>
                );
            } catch {
                return <span className="text-sm text-slate-400">—</span>;
            }
        },
        size: 130,
    },
    {
        id: "customer",
        header: "Customer",
        accessorFn: (row) =>
            formatCustomerDisplayName(
                row.customer?.firstName,
                row.customer?.lastName
            ),
        cell: ({ row }) => (
            <UserInfoCell
                user={row.original.customer}
                type="customer"
                isLink={false}
            />
        ),
        size: 160,
    },
    {
        id: "itemCount",
        header: () => <div className="text-center">Items</div>,
        cell: ({ row }) => {
            const count = row.original.saleItems?.length ?? 0;
            return (
                <div className="flex justify-center">
                    <span className={cn(
                        "inline-flex items-center justify-center min-w-6 h-6 px-1.5 rounded-full text-xs font-semibold font-mono",
                        count > 0 ? "bg-slate-100 text-slate-700" : "bg-slate-50 text-slate-400"
                    )}>
                        {count}
                    </span>
                </div>
            );
        },
        size: 70,
    },
    {
        accessorKey: "totalAmount",
        header: () => <div className="text-right">Total</div>,
        cell: ({ row }) => (
            <div className="text-right text-sm font-bold text-slate-900">
                {formatCurrency(row.original.totalAmount)}
            </div>
        ),
        size: 120,
    },
    {
        accessorKey: "paymentMethod",
        header: "Payment",
        cell: ({ row }) => {
            const method = row.original.paymentMethod;
            if (!method) return <span className="text-sm text-slate-400">—</span>;
            const isCash = method.toUpperCase() === 'CASH';
            return (
                <span className={cn(
                    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border select-none",
                    isCash
                        ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                        : "bg-blue-50 text-blue-700 border-blue-100"
                )}>
                    {method}
                </span>
            );
        },
        size: 110,
    },
    {
        accessorKey: "status",
        header: () => <div className="text-center">Status</div>,
        meta: {
            cellClassName: (row: ISale) => cn(
                "p-0 text-center text-xs font-semibold tracking-wide h-[1px]",
                getSaleStatusColor(row.status)
            ),
        },
        cell: ({ row }) => <StatusCell row={row} />,
        size: 130,
    },
    {
        id: "cashier",
        header: "Cashier",
        accessorFn: (row) =>
            formatCashierName(row.author.firstName, row.author.lastName),
        cell: ({ row }) => <UserInfoCell user={row.original.author} />,
        size: 140,
    },
    {
        id: "actions",
        header: () => <div className="text-center">Actions</div>,
        cell: ({ row }) => <ActionsCell row={row} />,
        size: 80,
    },
];
