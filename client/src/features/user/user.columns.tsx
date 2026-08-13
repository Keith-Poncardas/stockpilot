import type { ColumnDef } from "@tanstack/react-table"
import {
  getRoleColor,
  getStatusColor,
  getApprovalStatusColor,
  cn,
  formatDate
} from "@/lib/utils"
import {
  StatusCell,
  UserInfoCell,
  RoleCell,
  ApprovalStatusCell,
  ActionsCell
} from "./components/cells"
import type { IUser } from "./types";

const badgeCellClass = "p-0 text-center text-xs font-semibold tracking-wide h-[1px]";

export const columns: ColumnDef<IUser>[] = [
  {
    id: "name",
    header: "Name",
    cell: ({ row }) => <UserInfoCell row={row} />,
    size: 280,
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <span className="text-sm text-gray-500 dark:text-zinc-400">
        {row.original.email}
      </span>
    ),
    size: 220,
  },
  {
    accessorKey: "role",
    header: () => <div className="text-center">Role</div>,
    meta: {
      cellClassName: (row: IUser) => cn(badgeCellClass, getRoleColor(row.role)),
    },
    cell: ({ row }) => <RoleCell row={row} />,
    size: 130,
  },
  {
    accessorKey: "status",
    header: () => <div className="text-center">Status</div>,
    meta: {
      cellClassName: (row: IUser) => cn(badgeCellClass, getStatusColor(row.status)),
    },
    cell: ({ row }) => <StatusCell row={row} />,
    size: 130,
  },
  {
    accessorKey: "approvalStatus",
    header: () => <div className="text-center">Approval Status</div>,
    meta: {
      cellClassName: (row: IUser) => cn(badgeCellClass, getApprovalStatusColor(row.approvalStatus)),
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
    header: () => <div className="text-center">Actions</div>,
    cell: ({ row }) => <ActionsCell row={row} />,
    size: 80,
  },
];
