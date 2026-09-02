import * as React from 'react';
import { useOptimisticMutation } from "@/hooks/useOptimisticMutation";
import { getOptions } from "../../../user.utils";
import ActionPopover from "@/components/ActionPopover";
import { ActionCellContent } from "../../../../../components/common/action-cell-content/ActionCellContent";
import { useAuthStore } from "@/store";
import type {
    UserRowInfoCellProps,
    UserApprovalStatusType
} from "../../../types";
import {
    getApprovalStatusMutationConfig,
    getApprovalStatusOptionsConfig,
    isStatusLocked
} from './utils';

/**
 * Renders a data table cell for managing a user's approval status.
 * Provides an interactive popover menu for administrators to approve or reject pending users.
 * The cell is disabled (locked) if the row represents the current user, if a final decision (APPROVED/REJECTED) has already been made, or if the user's account is TERMINATED.
 *
 * @param props - The component props.
 * @param props.row - The table row containing the user's data.
 * @returns The rendered cell component.
 */
export function ApprovalStatusCell({ row }: UserRowInfoCellProps) {
    const { user } = useAuthStore();
    const { mutate } = useOptimisticMutation();
    const { approvalStatus, id } = row.original;

    const isLocked = isStatusLocked(user?.id ?? '', row.original);

    const handleUpdate = React.useCallback(
        async (newStatus: UserApprovalStatusType) => {
            await mutate(getApprovalStatusMutationConfig(id, newStatus));
        },
        [mutate, id]
    );

    const statusOptions = React.useMemo(
        () => getOptions(getApprovalStatusOptionsConfig(
            approvalStatus,
            handleUpdate
        )),
        [approvalStatus, handleUpdate]
    );

    return (
        <ActionPopover
            title="Update Status"
            options={statusOptions}
            disabled={isLocked}
        >
            <ActionCellContent
                label={approvalStatus}
                approvalStatus={approvalStatus}
                isLocked={isLocked}
            />
        </ActionPopover>
    )
};