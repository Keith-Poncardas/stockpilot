import type { ColumnDef } from "@tanstack/react-table";
import { cn, formatDate, getConfigColor } from "@/lib/utils";
import { UserInfoCell } from "@/components/UserInfoCell";
import { ActionsCell } from "./components/cells/actions-cell/ActionsCell";
import type { IStockMovement, IStockMovementWithRelations } from "./types";
import { MOVEMENT_REASON_COLORS, MOVEMENT_TYPE_COLORS } from "./sm.config";
import { ActionCellContent } from "@/components";
import { QuantityDisplay } from "./components/common";
import { MovementProductCell } from "./components/cells/movement-product-cell";

const baseCellStyle = "p-0 text-center text-xs font-semibold tracking-wide h-[1px]";

export const columns: ColumnDef<IStockMovementWithRelations>[] = [
    {
        accessorKey: "product.name",
        id: "productName",
        header: "Product",
        cell: ({ row }) => (
            <MovementProductCell
                type={row.original.type}
                product={row.original.product}
            />
        ),
        size: 220,
    },
    {
        accessorKey: "type",
        header: () => <div className="text-center">Type</div>,
        meta: {
            cellClassName: (row: IStockMovement) => {
                return cn(
                    baseCellStyle,
                    getConfigColor(MOVEMENT_TYPE_COLORS, row.type)
                );
            },
        },
        cell: ({ row }) => (
            <ActionCellContent
                label={row.original.type}
                isLocked={false}
                withBorder={false}
            />
        ),
        size: 140,
    },
    {
        accessorKey: "quantity",
        header: () => <div className="text-center">Quantity</div>,
        cell: ({ row }) => (
            <QuantityDisplay
                quantity={row.original.quantity}
                type={row.original.type}
            />
        ),
        size: 110,
    },
    {
        accessorKey: "reference",
        header: "Reference",
        cell: ({ row }) => (
            <span className="text-xs text-[#9C9A91] font-mono truncate" title={row.original.reference || "-"}>{row.original.reference || "-"}</span>
        ),
        size: 140,
    },
    {
        accessorKey: "notes",
        header: "Notes",
        cell: ({ row }) => (
            <span className="text-sm text-gray-500 truncate block max-w-100" title={row.original.notes ?? undefined}>
                {row.original.notes || "—"}
            </span>
        ),
        size: 140,
    },
    {
        accessorKey: "reason",
        header: () => <div className="text-center">Reason</div>,
        meta: {
            cellClassName: (row: IStockMovement) => {
                return cn(
                    baseCellStyle,
                    getConfigColor(MOVEMENT_REASON_COLORS, row.reason)
                );
            },
        },
        cell: ({ row }) => (
            <ActionCellContent
                label={row.original.reason?.replace('_', ' ')}
                approvalStatus=""
                isLocked={false}
                withBorder={false}
            />
        ),
        size: 140,
    },
    {
        accessorKey: "user",
        id: "user",
        header: "Recorded By",
        cell: ({ row }) => <UserInfoCell user={row.original.author} />,
        size: 180,
    },
    {
        accessorKey: "createdAt",
        header: "Date Created",
        cell: ({ row }) => (
            <span className="text-sm text-gray-400">
                {formatDate(row.original.createdAt)}
            </span>
        ),
        size: 140,
    },
    {
        accessorKey: "actions",
        header: "Actions",
        cell: ({ row }) => (
            <ActionsCell row={row} />
        ),
        size: 140,
    },
];
