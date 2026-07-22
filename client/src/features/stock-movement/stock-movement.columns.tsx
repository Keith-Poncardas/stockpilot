import type { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { formatDate } from "@/lib/utils";
import type { IStockMovement } from "./stock-movement.types";
import { MovementIcon } from "@/components/ui/stock-movement-ledger";
import { UserInfoCell } from "@/components/UserInfoCell";

export const columns: ColumnDef<IStockMovement>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                className="rounded-none border-gray-400"
                checked={
                    table.getIsAllPageRowsSelected()
                        ? true
                        : table.getIsSomePageRowsSelected()
                            ? "indeterminate"
                            : false
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                className="rounded-none border-gray-400"
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
        size: 48,
    },
    {
        accessorKey: "product.name",
        id: "productName",
        header: "Product",
        cell: ({ row }) => (

            <div className="flex items-center gap-3 min-w-0">
                <MovementIcon type={row.original.type} />
                <div className="min-w-0">
                    <p className="text-sm font-medium truncate">
                        {row.original.product.name || <span className="italic text-[#9C9A91]">No description</span>}
                    </p>
                    <p className="text-xs text-[#9C9A91] font-mono truncate">
                        {row.original.product.sku || <span className="italic text-[#9C9A91]">No SKU</span>}
                    </p>
                </div>
            </div>
        ),
        size: 220,
    },
    {
        accessorKey: "type",
        header: () => <div className="text-center">Type</div>,
        cell: ({ row }) => (
            <div className="flex justify-center">
                <MovementIcon type={row.original.type} />
            </div>
        ),
        size: 140,
    },
    {
        accessorKey: "quantity",
        header: () => <div className="text-left">Quantity</div>,
        cell: ({ row }) => {
            const { quantity, type } = row.original;
            const isOut = type === "OUT";
            const isIn = type === "IN";

            return (
                <div className="text-left font-mono text-sm font-semibold">
                    <span className={isIn ? "text-emerald-600" : isOut ? "text-rose-600" : "text-amber-600"}>
                        {isIn ? `+${quantity}` : isOut ? `-${quantity}` : quantity}
                    </span>
                </div>
            );
        },
        size: 110,
    },
    {
        accessorKey: "reference",
        header: "Reference",
        cell: ({ row }) => (
            <span className="text-sm text-gray-500 truncate block max-w-100" title={row.original.reference ?? undefined}>
                {row.original.reference || "—"}
            </span>
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
        accessorKey: "user",
        id: "user",
        header: "Recorded By",
        cell: ({ row }) => <UserInfoCell user={row.original.user} />,
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
];
