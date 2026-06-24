import type { ColumnDef, Row } from "@tanstack/react-table"
import { Eye, Lock, Trash2, AlertTriangle, CheckCircle } from "lucide-react"
import { useAuthStore } from "@/store"
import { Link } from "react-router-dom"
import UserAvatar from "@/components/UserAvatar"
import { getRoleColor, getStatusColor, getApprovalStatusColor, cn, formatDate } from "@/lib/utils"
import ActionPopover from "@/components/ActionPopover"
import { useApolloClient } from '@apollo/client'
import { APPROVAL_BORDER_COLORS } from "@/config/colors"
import { Role, Status, ApprovalStatus } from "@/constants/enums"
import { APPROVE_REJECT_USER, CHANGE_USER_STATUS, ASSIGN_ROLE, DELETE_USER } from "./user.queries"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

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
  const { approvalStatus, id, email, firstName, lastName } = row.original;

  const [isOpen, setIsOpen] = useState(false);
  const [targetStatus, setTargetStatus] = useState<string | null>(null);
  const [confirmEmail, setConfirmEmail] = useState("");

  const isCurrentUser = user?.id === id;
  const isFinalDecision = approvalStatus === ApprovalStatus.APPROVED || approvalStatus === ApprovalStatus.REJECTED;
  const isLocked = isCurrentUser || isFinalDecision;

  const initiateUpdate = (status: string) => {
    setTargetStatus(status);
    setConfirmEmail("");
    setIsOpen(true);
  };

  const executeUpdate = async () => {
    if (!targetStatus) return;
    setIsOpen(false);
    const newApprovalStatus = targetStatus;
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

  const isMatch = confirmEmail === email;
  const isApproved = targetStatus === ApprovalStatus.APPROVED;
  const actionText = isApproved ? "Approve" : "Reject";
  const actionColor = isApproved ? "bg-emerald-600 hover:bg-emerald-700 text-white" : "bg-red-600 hover:bg-red-700 text-white";
  const ActionIcon = isApproved ? CheckCircle : AlertTriangle;

  return (
    <>
      <ActionPopover title="Update Approval Status" options={getApprovalOptions(initiateUpdate)} disabled={isLocked}>
        <ActionCellContent
          label={approvalStatus}
          approvalStatus={approvalStatus}
          isLocked={isLocked}
          withBorder={false}
        />
      </ActionPopover>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-100 p-0 overflow-hidden rounded-[20px] border-0 shadow-lg">

          {/* Header */}
          <div className="px-7 pt-7 pb-5 text-center">
            <div className={cn(
              "w-12 h-12 rounded-[14px] flex items-center justify-center mx-auto mb-4.5",
              "bg-red-50 dark:bg-red-950/40"
            )}>
              <ActionIcon className="w-5.5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <DialogTitle className="text-base font-medium">
              {actionText} user?
            </DialogTitle>
            <DialogDescription className="text-[13px] text-muted-foreground mt-1.5 leading-relaxed">
              This user will become an active and valid account in the system.
            </DialogDescription>
          </div>

          {/* User card */}
          <div className="px-6 pb-5">
            <div className="flex items-center gap-2.5 px-3.5 py-3 bg-muted/50 rounded-xl">
              <UserAvatar fallback={row.original} role={row.original.role} className="w-9 h-9 shrink-0" />
              <div className="overflow-hidden">
                <p className="text-[13px] font-medium text-foreground truncate">{firstName} {lastName}</p>
                <p className="text-xs text-muted-foreground truncate">{email}</p>
              </div>
            </div>
          </div>

          {/* Email confirmation */}
          <div className="px-6 pb-6">
            <Label className="block text-[11px] font-bold tracking-widest uppercase text-muted-foreground mb-2">
              Type their email to confirm
            </Label>
            <Input
              value={confirmEmail}
              onChange={(e) => setConfirmEmail(e.target.value)}
              placeholder={email}
              autoComplete="off"
              autoFocus
              className="text-[13px] rounded-[10px] h-9"
            />
          </div>

          {/* Footer */}
          <div className="flex gap-2 px-6 py-4 border-t border-border/50 bg-muted/30">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 rounded-[10px] font-medium text-[13px]"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              className={cn(
                "flex-1 rounded-[10px] font-medium text-[13px]",
                actionColor
              )}
              disabled={!isMatch}
              onClick={executeUpdate}
            >
              {actionText}
            </Button>
          </div>

        </DialogContent>
      </Dialog>
    </>
  );
};

const ActionCell = ({ row }: { row: Row<User> }) => {
  const { user } = useAuthStore();
  const client = useApolloClient();
  const { id } = row.original;
  const isCurrentUser = user?.id === id;
  const isRejected = row.original.approvalStatus === ApprovalStatus.REJECTED;

  const handleDelete = async () => {
    try {
      await client.mutate({
        mutation: DELETE_USER,
        variables: { userId: id },
        update(cache) {
          cache.evict({ id: cache.identify({ __typename: 'User', id }) });
          cache.gc();
        }
      });
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };

  return (
    <div className="flex gap-1">
      <Button
        size="sm"
        variant="outline"
        onClick={handleDelete}
        disabled
      >
        <Eye className="h-4 w-4 text-muted-foreground cursor-pointer " />
      </Button>
      {
        isRejected && (
          <Button
            size="sm"
            variant="outline"
            onClick={handleDelete}
            disabled={isCurrentUser}
          >
            <Trash2 className="h-4 w-4 text-muted-foreground cursor-pointer " />
          </Button>
        )
      }
    </div>
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
    cell: ({ row }) => <ActionCell row={row} />,
    size: 100,
  },
];
