import type { ColumnDef } from "@tanstack/react-table"
import { getRoleColor, getStatusColor, getApprovalStatusColor, cn, formatDate } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"
import { StatusCell, UserInfoCell, RoleCell, ApprovalStatusCell, ActionCell } from "./components/cells"
import type { IUser } from "./user.types"

// --- Columns Definition ---

export const columns: ColumnDef<IUser>[] = [
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
        disabled={row.original.status === 'TERMINATED'}
      />
    ),
    enableSorting: false,
    enableHiding: false,
    size: 48,
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <UserInfoCell row={row} />,
    size: 280,
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <span className="text-sm text-gray-500 dark:text-zinc-400">{row.original.email}</span>
    ),
    size: 220,
  },
  {
    accessorKey: "role",
    header: () => <div className="text-center">Role</div>,
    meta: {
      cellClassName: (row: IUser) => cn(
        "p-0 text-center text-xs font-semibold tracking-wide h-[1px]",
        getRoleColor(row.role)
      ),
    },
    cell: ({ row }) => <RoleCell row={row} />,
    size: 130,
  },
  {
    accessorKey: "status",
    header: () => <div className="text-center">Status</div>,
    meta: {
      cellClassName: (row: IUser) => cn(
        "p-0 text-center text-xs font-semibold tracking-wide h-[1px]",
        getStatusColor(row.status)
      ),
    },
    cell: ({ row }) => <StatusCell row={row} />,
    size: 130,
  },
  {
    accessorKey: "approval-status",
    header: () => <div className="text-center">Approval Status</div>,
    meta: {
      cellClassName: (row: IUser) => cn("p-0 text-center text-xs font-semibold tracking-wide h-[1px]", getApprovalStatusColor(row.approvalStatus)),
    },
    cell: ({ row }) => <ApprovalStatusCell row={row} />,
    size: 130,
  },
  {
    accessorKey: "createdAt",
    header: "Joined",
    cell: ({ row }) => <span className="text-sm text-gray-400">{formatDate(row.original.createdAt)}</span>,
    size: 140,
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <ActionCell row={row} />,
    size: 100,
  },
];
