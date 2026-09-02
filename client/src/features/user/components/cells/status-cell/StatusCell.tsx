import * as React from 'react';
import { useOptimisticMutation } from "@/hooks/useOptimisticMutation";
import ActionPopover from "@/components/ActionPopover";
import { ActionCellContent } from "../../../../../components/common/action-cell-content/ActionCellContent";
import { getOptions } from "../../../user.utils";
import { useAuthStore } from "@/store";
import type {
  UserRowInfoCellProps,
  UserStatusType
} from "../../../types";
import {
  getUserStatusMutationConfig,
  getUserStatusOptionsConfig,
  isUserStatusLocked
} from './utils';

/**
 * Renders a data table cell for managing a user's status.
 * Provides an interactive popover menu for administrators to change a user's status.
 *
 * @param props - The component props.
 * @param props.row - The table row containing the user's data.
 * @returns The rendered cell component.
 */
export function StatusCell({ row }: UserRowInfoCellProps) {
  const { user } = useAuthStore();
  const { mutate } = useOptimisticMutation();
  const { status, approvalStatus, id } = row.original;

  const isLocked = isUserStatusLocked(user?.id ?? '', row.original);

  const handleUpdate = React.useCallback(async (newStatus: UserStatusType) => {
    await mutate(getUserStatusMutationConfig(id, newStatus));
  }, [mutate, id]);

  const statusOptions = React.useMemo(
    () => getOptions(getUserStatusOptionsConfig(status, handleUpdate)),
    [status, handleUpdate]
  );

  return (
    <ActionPopover
      title="Update Status"
      options={statusOptions}
      disabled={isLocked}
    >
      <ActionCellContent
        label={status}
        approvalStatus={approvalStatus}
        isLocked={isLocked}
      />
    </ActionPopover>
  )
}
