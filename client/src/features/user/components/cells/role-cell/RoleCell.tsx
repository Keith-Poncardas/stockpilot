import * as React from 'react';
import { useOptimisticMutation } from "@/hooks/useOptimisticMutation";
import ActionPopover from "@/components/ActionPopover";
import { ActionCellContent } from "../../../../../components/common/action-cell-content/ActionCellContent";
import { getOptions } from "../../../user.utils";
import { useAuthStore } from "@/store";
import type {
  UserRowInfoCellProps,
  UserRoleType
} from "../../../types";
import {
  getRoleMutationConfig,
  getRoleOptionsConfig,
  isRoleLocked
} from './utils';

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
  const { role, approvalStatus, id } = row.original;

  const isRoleDisabled = isRoleLocked(user, row.original);

  const handleUpdate = React.useCallback(async (newRole: UserRoleType) => {
    await mutate(getRoleMutationConfig(id, newRole));
  }, [mutate, id]);

  const roleOptions = React.useMemo(
    () => getOptions(getRoleOptionsConfig(role, handleUpdate)),
    [role, handleUpdate]
  );

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