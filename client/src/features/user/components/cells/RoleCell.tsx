import * as React from 'react';
import { useOptimisticMutation } from "@/hooks/useOptimisticMutation";
import { ASSIGN_ROLE } from "../../operations";
import ActionPopover from "@/components/ActionPopover";
import { ActionCellContent } from "./ActionCellContent";
import { getOptions } from "../../user.utils";
import { getRoleColor } from "@/lib/utils";
import { useAuthStore } from "@/store";
import type {
  UserRowInfoCellProps,
  UserRoleType
} from "../../types";
import {
  UserRole,
  UserStatus,
  UserApprovalStatus,
  AVAILABLE_ROLES
} from "../../contants";

/**
 * Renders a data table cell for managing a user's role.
 * Provides an interactive popover menu for administrators to change a user's role.
 * The cell is disabled (locked) if the row represents the current user, if the user's account is TERMINATED, or if the user's account is not yet APPROVED.
 *
 * @param props - The component props.
 * @param props.row - The table row containing the user's data.
 * @returns The rendered cell component.
 */
export function RoleCell({ row }: UserRowInfoCellProps) {
  const { user } = useAuthStore();
  const { mutate } = useOptimisticMutation();
  const { role, approvalStatus, status, id } = row.original;

  const isCurrentUser = user?.id === id;
  const isRoleDisabled =
    isCurrentUser ||
    status === UserStatus.TERMINATED ||
    role === UserRole.SUPER_ADMIN ||
    approvalStatus !== UserApprovalStatus.APPROVED;

  const handleUpdate = React.useCallback(async (newRole: UserRoleType) => {
    await mutate({
      mutation: ASSIGN_ROLE,
      typename: 'User',
      entityId: id,
      optimisticFields: { role: newRole },
      buildVariables: ({ role }) => ({
        input: { userId: id, role }
      }),
    });
  }, [mutate, id]);

  const roleOptions = React.useMemo(() => getOptions({
    items: AVAILABLE_ROLES,
    currentValue: role,
    getValue: role => role,
    getLabel: role => role.replace(/_/g, " "),
    getColor: role => getRoleColor(role),
    onUpdate: (val) => handleUpdate(val as UserRoleType),
  }), [role, handleUpdate]);

  return (
    <ActionPopover
      title="Update Role"
      options={roleOptions}
      disabled={isRoleDisabled}
    >
      <ActionCellContent
        label={role}
        approvalStatus={approvalStatus}
        isLocked={isRoleDisabled}
      />
    </ActionPopover>
  )
}