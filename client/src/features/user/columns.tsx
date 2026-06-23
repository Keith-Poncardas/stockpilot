import type { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Check, Eye, Lock, X, Pause, Ban } from "lucide-react"
import { useAuthStore } from "@/store"
import { Link, useNavigate } from "react-router-dom"
import UserAvatar from "@/components/UserAvatar"
import { formatDate } from "@/lib/utils"
import Badge from "@/components/Badge"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export type User = {
  id: string
  firstName: string
  lastName: string
  email: string
  role: 'SUPER_ADMIN' | 'ADMIN' | 'MANAGER' | 'CASHIER'
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'SUSPENDED'
  approvalStatus: 'PENDING' | 'APPROVED' | 'REJECTED'
  createdAt: string
  isCurrentUser?: boolean
}

export const columns: ColumnDef<User>[] = [
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
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const { user } = useAuthStore();

      const firstName = row.original.firstName
      const lastName = row.original.lastName
      const name = `${firstName} ${lastName}`
      const isCurrentUser = user?.id === row.original.id
      return (
        <Link to={`/users/${row.original.id}/view`} className="flex items-center gap-2  ">
          <UserAvatar fallback={row.original} role={row.original.role} size="sm" className="w-7 h-7" />
          <div className="flex flex-inline items-center gap-1.5 ">
            <span className="font-semibold text-sm text-gray-900 hover:underline">{name}</span>
            {isCurrentUser && (
              <span className="text-[10px] text-gray-400 font-medium leading-none mt-0.5">(You)</span>
            )}
          </div>
        </Link>
      )
    },
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
    header: "Role",
    cell: ({ row }) => {
      const role = row.original.role
      const isSuperAdmin = role === "SUPER_ADMIN";

      if (isSuperAdmin) return <Badge status={role} type="ROLE" Icon={Lock} />

      return <Badge status={role} type="ROLE" />
    },
    size: 130,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const isSuperAdmin = row.original.role === 'SUPER_ADMIN'
      const status = row.original.status

      if (isSuperAdmin) return <Badge status={status} type="STATUS" Icon={Lock} />

      if (row.original.approvalStatus === "PENDING") {
        return <Badge status={row.original.status} type="STATUS" Icon={Lock} />
      }

      return (
        <Popover>
          <PopoverTrigger asChild>
            <button className="focus:outline-hidden cursor-pointer rounded-sm hover:ring-2 hover:ring-gray-200 transition-all">
              <Badge status={status} type="STATUS" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-36 p-1.5" align="start">
            <div className="flex flex-col gap-1">
              <div className="px-2 py-1 text-xs font-semibold text-gray-500">Update Status</div>
              {['ACTIVE', 'SUSPENDED', 'TERMINATED']
                .filter((s) => s !== status)
                .map((s) => {
                  let label = s;
                  if (s === 'ACTIVE') {
                    label = status === 'PENDING' || status === 'INACTIVE' ? 'Activate' : 'Reactivate';
                  } else if (s === 'SUSPENDED') {
                    label = 'Suspend';
                  } else if (s === 'TERMINATED') {
                    label = 'Terminate';
                  }

                  return (
                    <Button
                      key={s}
                      variant="ghost"
                      className="w-full justify-start px-2 py-1.5 text-sm rounded-sm hover:bg-gray-100 transition-colors"
                      onClick={() => {
                        // Placeholder for future update logic
                        console.log(`Update to ${s}`)
                      }}
                    >
                      {s === 'ACTIVE' && <Check className="mr-2 h-4 w-4 text-green-600" />}
                      {s === 'SUSPENDED' && <Pause className="mr-2 h-4 w-4 text-orange-600" />}
                      {s === 'TERMINATED' && <Ban className="mr-2 h-4 w-4 text-red-600" />}
                      {label}
                    </Button>
                  )
                })}
            </div>
          </PopoverContent>
        </Popover>
      )
    },
    size: 130,
  },
  {
    accessorKey: "approval-status",
    header: "Approval Status",
    cell: ({ row }) => {
      const { user } = useAuthStore();

      const approvalStatus = row.original.approvalStatus
      const isCurrentUserAndSuperAdmin = user?.id === row.original.id && user?.role === 'SUPER_ADMIN' || approvalStatus === 'APPROVED'

      if (isCurrentUserAndSuperAdmin) {
        return <Badge status={approvalStatus} type="APPROVAL_STATUS" Icon={Lock} />
      }

      return (
        <Popover>
          <PopoverTrigger asChild>
            <button className="focus:outline-hidden cursor-pointer rounded-sm hover:ring-2 hover:ring-gray-200 transition-all">
              <Badge status={approvalStatus} type="APPROVAL_STATUS" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-36 p-1.5" align="start">
            <div className="flex flex-col gap-1">
              <div className="px-2 py-1 text-xs font-semibold text-gray-500">Update Approval Status</div>
              {['APPROVE', 'REJECT'].map((status) => (
                <Button
                  key={status}
                  variant="ghost"
                  className="w-full justify-start px-2 py-1.5 text-sm rounded-sm hover:bg-gray-100 transition-colors"
                  onClick={() => {
                    // Placeholder for future update logic
                    console.log(`Update to ${status}`)
                  }}
                >
                  {status === 'APPROVE' && <Check className="mr-2 h-4 w-4 text-green-600" />}
                  {status === 'REJECT' && <X className="mr-2 h-4 w-4 text-red-600" />}
                  {status}
                </Button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      )
    },
    size: 130,
  },
  {
    accessorKey: "createdAt",
    header: "Joined",
    cell: ({ row }) => {
      return <span className="text-sm text-gray-400 dark:text-zinc-500">{formatDate(row.original.createdAt)}</span>
    },
    size: 140,
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {

      const navigate = useNavigate()

      return (
        <div className="flex gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/users/${row.original.id}/view`)}
            title="View User"
          >
            <Eye size={16} strokeWidth={2} className="text-muted-foreground" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            title="Approved User"
          >
            <Check size={16} strokeWidth={2} className="text-muted-foreground" />
          </Button>
        </div>
      )
    },
    size: 100,
  },
]
