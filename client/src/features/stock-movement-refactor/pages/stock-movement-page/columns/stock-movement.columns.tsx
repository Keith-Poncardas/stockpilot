import type { ColumnDef } from "@tanstack/react-table";
import { cn, getConfigColor } from "@/lib/utils";
import { ActionCellContent, DateTimeCell } from "@/components";
import {
    ActionsCell,
    MovementProductCell,
    QuantityCell,
    ReferenceCell,
    NotesCell,
    RecordedByCell,
} from "../cells";
import { MOVEMENT_REASON_COLORS, MOVEMENT_TYPE_COLORS } from "@/features/stock-movement-refactor/constants";
import type { IStockMovement, IStockMovementWithRelations } from "@/features/stock-movement-refactor/types";

const baseCellStyle = "p-0 text-center text-xs font-semibold tracking-wide h-[1px]";

export const columns: ColumnDef<IStockMovementWithRelations>[] = [
    {
        accessorKey: "product.name",
        id: "productName",
        header: () => <div className="text-left font-semibold">Product & SKU</div>,
        cell: ({ row }) => (
            <MovementProductCell
                type={row.original.type}
                product={row.original.product}
                enableViewSheet
            />
        ),
        size: 280,
    },
    {
        accessorKey: "type",
        header: () => <div className="text-center font-semibold">Type</div>,
        meta: {
            cellClassName: (row: IStockMovement) => cn(
                baseCellStyle,
                getConfigColor(MOVEMENT_TYPE_COLORS, row.type)
            ),
        },
        cell: ({ row }) => (
            <ActionCellContent
                label={row.original.type}
                isLocked={false}
                withBorder={false}
            />
        ),
        size: 130,
    },
    {
        accessorKey: "quantity",
        header: () => <div className="text-center font-semibold">Quantity</div>,
        cell: ({ row }) => <QuantityCell row={row} />,
        size: 130,
    },
    {
        accessorKey: "reference",
        header: () => <div className="text-left font-semibold">Reference</div>,
        cell: ({ row }) => <ReferenceCell row={row} />,
        size: 140,
    },
    {
        accessorKey: "notes",
        header: () => <div className="text-left font-semibold">Notes</div>,
        cell: ({ row }) => <NotesCell row={row} />,
        size: 220,
    },
    {
        accessorKey: "reason",
        header: () => <div className="text-center font-semibold">Reason</div>,
        meta: {
            cellClassName: (row: IStockMovement) => cn(
                baseCellStyle,
                getConfigColor(MOVEMENT_REASON_COLORS, row.reason)
            ),
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
        header: () => <div className="text-left font-semibold">Recorded By</div>,
        cell: ({ row }) => <RecordedByCell row={row} />,
        size: 180,
    },
    {
        accessorKey: "createdAt",
        header: () => <div className="text-left font-semibold">Date & Time</div>,
        cell: ({ row }) => <DateTimeCell date={row.original.createdAt} />,
        size: 150,
    },
    {
        accessorKey: "actions",
        header: () => <div className="text-center font-semibold">Actions</div>,
        cell: ({ row }) => <ActionsCell row={row} />,
        size: 80,
    },
];

