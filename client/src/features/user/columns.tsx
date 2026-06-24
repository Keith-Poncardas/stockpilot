import type { ColumnDef, Row } from "@tanstack/react-table"
import { Lock } from "lucide-react"
import { useAuthStore } from "@/store"
import { Link } from "react-router-dom"
import UserAvatar from "@/components/UserAvatar"
import { getRoleColor, getStatusColor, getApprovalStatusColor, cn, formatDate } from "@/lib/utils"
import ActionPopover from "@/components/ActionPopover"
import { useApolloClient } from '@apollo/client'
import { APPROVAL_BORDER_COLORS } from "@/config/colors"
import { Role, Status, ApprovalStatus } from "@/constants/enums"
import { APPROVE_REJECT_USER, CHANGE_USER_STATUS, ASSIGN_ROLE } from "./user.queries"
import { Checkbox } from "@/components/ui/checkbox"

export type User = {
  id: string
  firstName: string
  lastName: string
  email: string
  role: Role
  status: Status
  approvalStatus: ApprovalStatus
  createdAt: string
  isCurrentUser?: boolean
}

// --- Reusable Sub-components & Helpers ---

const ActionCellContent = ({
  label,
  approvalStatus,
  isLocked,
  withBorder = true
}: {
  label: string;
  approvalStatus: string;
  isLocked: boolean;
  withBorder?: boolean;
}) => {
  const borderLeftColor = APPROVAL_BORDER_COLORS[approvalStatus] || APPROVAL_BORDER_COLORS.DEFAULT;

  return (
    <div className={cn(
      "flex items-center justify-center gap-1.5 px-4 py-3 h-full",
      withBorder && "relative w-full before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-1/2 before:rounded-r-[3px] " + borderLeftColor,
      isLocked && "opacity-50"
    )}>
      {isLocked && <Lock size={16} strokeWidth={2.1} />}
      <span>{label.replace(/_/g, ' ')}</span>
    </div>
  );
};

const AVAILABLE_STATUSES = [Status.ACTIVE, Status.SUSPENDED, Status.TERMINATED, Status.INACTIVE];

const getStatusOptions = (currentStatus: string, onUpdate: (s: string) => void) => {
  return AVAILABLE_STATUSES
    .filter((s) => s !== currentStatus)
    .map((s) => {
      let label: string = s;

      if (s === Status.ACTIVE) label = 'ACTIVATE';
      else if (s === Status.SUSPENDED) label = 'SUSPEND';
      else if (s === Status.TERMINATED) label = 'TERMINATE';
      else if (s === Status.INACTIVE) label = 'DEACTIVATE';
      else label = label.toUpperCase();

      return {
        id: s,
        label,
        colorClassName: getStatusColor(s),
        onClick: () => onUpdate(s)
      };
    });
};

const getApprovalOptions = (onUpdate: (s: string) => void) => {
  return [ApprovalStatus.APPROVED, ApprovalStatus.REJECTED].map((status) => ({
    id: status,
    label: status === ApprovalStatus.APPROVED ? 'APPROVE' : 'REJECT',
    colorClassName: getApprovalStatusColor(status),
    onClick: () => onUpdate(status)
  }));
};

const AVAILABLE_ROLES = [Role.ADMIN, Role.MANAGER, Role.CASHIER];

const getRoleOptions = (currentRole: string, onUpdate: (s: string) => void) => {
  return AVAILABLE_ROLES
    .filter((r) => r !== currentRole)
    .map((r) => ({
      id: r,
      label: r.replace(/_/g, ' '),
      colorClassName: getRoleColor(r),
      onClick: () => onUpdate(r)
    }));
};

const UserInfoCell = ({ row }: { row: Row<User> }) => {
  const { user } = useAuthStore();
  const { id, firstName, lastName, role } = row.original;
  const name = `${firstName} ${lastName}`;
  const isCurrentUser = user?.id === id;

  return (
    <Link to={`/users/${id}/view`} className="flex items-center gap-2">
      <UserAvatar fallback={row.original} role={role} size="sm" className="w-7 h-7" />
      <div className="flex flex-inline items-center gap-1.5">
        <span className="font-semibold text-sm text-gray-900 hover:underline">{name}</span>
        {isCurrentUser && (
          <span className="text-[10px] text-gray-400 font-medium leading-none mt-0.5">(You)</span>
        )}
      </div>
    </Link>
  );
};

const RoleCell = ({ row }: { row: Row<User> }) => {
  const client = useApolloClient();
  const { role, approvalStatus, id } = row.original;
  const isRoleDisabled = role === Role.SUPER_ADMIN || approvalStatus !== ApprovalStatus.APPROVED;

  const handleUpdate = async (newRole: string) => {
    const prevRole = role;

    // Optimistic update
    client.cache.modify({
      id: client.cache.identify({ __typename: 'User', id }),
      fields: {
        role() { return newRole; }
      }
    });

    try {
      await client.mutate({
        mutation: ASSIGN_ROLE,
        variables: {
          input: {
            userId: id,
            role: newRole
          }
        }
      });
    } catch (error) {
      console.error('Failed to update role:', error);
      // Revert cache on error
      client.cache.modify({
        id: client.cache.identify({ __typename: 'User', id }),
        fields: {
          role() { return prevRole; }
        }
      });
    }
  };

  return (
    <ActionPopover title="Update Role" options={getRoleOptions(role, handleUpdate)} disabled={isRoleDisabled}>
      <ActionCellContent
        label={role}
        approvalStatus={approvalStatus}
        isLocked={isRoleDisabled}
      />
    </ActionPopover>
  );
};

const StatusCell = ({ row }: { row: Row<User> }) => {
  const client = useApolloClient();
  const { role, status, approvalStatus, id } = row.original;
  const isStatusDisabled = role === Role.SUPER_ADMIN || approvalStatus === ApprovalStatus.PENDING || approvalStatus === ApprovalStatus.REJECTED;

  const handleUpdate = async (newStatus: string) => {
    const prevStatus = status;

    // Optimistic cache update
    client.cache.modify({
      id: client.cache.identify({ __typename: 'User', id }),
      fields: {
        status() { return newStatus; }
      }
    });

    try {
      await client.mutate({
        mutation: CHANGE_USER_STATUS,
        variables: {
          input: {
            userId: id,
            status: newStatus
          }
        }
      });
    } catch (error) {
      console.error('Failed to update status:', error);
      // Revert cache on error
      client.cache.modify({
        id: client.cache.identify({ __typename: 'User', id }),
        fields: {
          status() { return prevStatus; }
        }
      });
    }
  };

  return (
    <ActionPopover title="Update Status" options={getStatusOptions(status, handleUpdate)} disabled={isStatusDisabled}>
      <ActionCellContent
        label={status}
        approvalStatus={approvalStatus}
        isLocked={isStatusDisabled}
      />
    </ActionPopover>
  );
};

const ApprovalStatusCell = ({ row }: { row: Row<User> }) => {
  const { user } = useAuthStore();
  const client = useApolloClient();
  const { approvalStatus, id } = row.original;

  const isCurrentUser = user?.id === id;
  const isFinalDecision = approvalStatus === ApprovalStatus.APPROVED || approvalStatus === ApprovalStatus.REJECTED;
  const isLocked = isCurrentUser || isFinalDecision;

  const handleUpdate = async (newApprovalStatus: string) => {
    const prevApprovalStatus = approvalStatus;
    const prevStatus = row.original.status;

    // Optimistic cache update
    client.cache.modify({
      id: client.cache.identify({ __typename: 'User', id }),
      fields: {
        approvalStatus() { return newApprovalStatus; },
        status(currentStatus) {
          // Auto-update status when approval changes
          return newApprovalStatus === ApprovalStatus.APPROVED ? Status.ACTIVE :
            newApprovalStatus === ApprovalStatus.REJECTED ? Status.TERMINATED : currentStatus;
        }
      }
    });

    try {
      await client.mutate({
        mutation: APPROVE_REJECT_USER,
        variables: {
          input: {
            userId: id,
            approvalStatus: newApprovalStatus
          }
        }
      });
    } catch (error) {
      console.error('Failed to update approval status:', error);
      // Revert cache on error
      client.cache.modify({
        id: client.cache.identify({ __typename: 'User', id }),
        fields: {
          approvalStatus() { return prevApprovalStatus; },
          status() { return prevStatus; }
        }
      });
    }
  };

  return (
    <ActionPopover title="Update Approval Status" options={getApprovalOptions(handleUpdate)} disabled={isLocked}>
      <ActionCellContent
        label={approvalStatus}
        approvalStatus={approvalStatus}
        isLocked={isLocked}
        withBorder={false}
      />
    </ActionPopover>
  );
};

// --- Columns Definition ---

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
      cellClassName: (row: User) => cn(
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
      cellClassName: (row: User) => cn(
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
      cellClassName: (row: User) => cn("p-0 text-center text-xs font-semibold tracking-wide h-[1px]", getApprovalStatusColor(row.approvalStatus)),
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
    cell: () => {
      return (
        <div className="flex gap-1">
          -
        </div>
      );
    },
    size: 100,
  },
];
