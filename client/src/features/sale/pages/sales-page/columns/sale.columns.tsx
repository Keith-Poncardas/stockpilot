import type { ColumnDef } from "@tanstack/react-table";
import { cn, getConfigColor } from "@/lib/utils";
import { SALE_STATUS_COLORS, SALE_PAYMENT_METHOD_COLORS } from "../../../constants";
import { UserInfoCell } from "@/components";
import {
    ActionsCell,
    SaleIdCell,
    StatusCell,
    PaymentMethodCell,
    SaleDateCell,
    TotalAmountCell,
    CustomerCell
} from "../cells";
import { ItemCount } from "@/features/sale/components/common";
import type { ISale, ISaleDetails } from "@/features/sale/types";
import { formatCashierName, formatCustomerDisplayName } from "./sale.utils";

export const columns: ColumnDef<ISaleDetails>[] = [
    {
        id: "saleId",
        header: "Sale ID",
        cell: ({ row }) => <SaleIdCell row={row} />,
        size: 110,
    },
    {
        accessorKey: "saleDate",
        header: "Date & Time",
        cell: ({ row }) => <SaleDateCell row={row} />,
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
        cell: ({ row }) => <CustomerCell row={row} />,
        size: 160,
    },
    {
        id: "itemCount",
        header: () => <div className="text-center">Items</div>,
        cell: ({ row }) => <ItemCount count={row.original.itemsCount} />,
        size: 70,
    },
    {
        accessorKey: "totalAmount",
        header: () => <div className="text-right">Total</div>,
        cell: ({ row }) => <TotalAmountCell row={row} />,
        size: 120,
    },
    {
        accessorKey: "paymentMethod",
        header: "Payment",
        meta: {
            cellClassName: (row: ISaleDetails) => cn(
                "p-0 text-center text-xs font-semibold tracking-wide h-[1px]",
                getConfigColor(SALE_PAYMENT_METHOD_COLORS, row.paymentMethod)
            ),
        },
        cell: ({ row }) => <PaymentMethodCell row={row} />,
        size: 110,
    },
    {
        accessorKey: "status",
        header: () => <div className="text-center" > Status </div>,
        meta: {
            cellClassName: (row: ISale) => cn(
                "p-0 text-center text-xs font-semibold tracking-wide h-[1px]",
                getConfigColor(SALE_STATUS_COLORS, row.status)
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
        header: () => <div className="text-center" > Actions </div>,
        cell: ({ row }) => <ActionsCell row={row} />,
        size: 80,
    },
];

