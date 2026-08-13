import * as React from 'react';
import { useOptimisticMutation } from "@/hooks/useOptimisticMutation";
import { CHANGE_USER_STATUS, GET_USER_METRICS } from "../../operations";
import { getOptions } from "../../user.utils";
import { getStatusColor } from "@/lib/utils";
import ActionPopover from "@/components/ActionPopover";
import { ActionCellContent } from "./ActionCellContent";
import { useAuthStore } from "@/store";
import type {
    UserRowInfoCellProps,
    UserStatusType
} from "../../types";
import {
    UserStatus,
    UserRole,
    UserApprovalStatus,
    AVAILABLE_STATUSES,
    USER_STATUS_ACTION_LABELS
} from "../../contants";

/**
 * Renders a data table cell for managing a user's status.
 * Provides an interactive popover menu for administrators to change a user's account status.
 * The cell is disabled (locked) if the row represents the current user, if the user's account is TERMINATED, if the user's account is not yet APPROVED, or if the user has the SUPER_ADMIN role.
 *
 * @param props - The component props.
 * @param props.row - The table row containing the user's data.
 * @returns The rendered cell component.
 */
export function StatusCell({ row }: UserRowInfoCellProps) {
    const { user } = useAuthStore();
    const { mutate } = useOptimisticMutation();
    const { role, status, approvalStatus, id } = row.original;

    const isCurrentUser = user?.id === id;
    const isStatusDisabled =
        isCurrentUser ||
        status === UserStatus.TERMINATED ||
        role === UserRole.SUPER_ADMIN ||
        approvalStatus === UserApprovalStatus.PENDING ||
        approvalStatus === UserApprovalStatus.REJECTED;

    const handleUpdate = React.useCallback(async (newStatus: UserStatusType) => {
        await mutate({
            mutation: CHANGE_USER_STATUS,
            typename: 'User',
            entityId: id,
            optimisticFields: {
                status: newStatus,
                ...(newStatus === UserStatus.TERMINATED && { role: UserRole.UNASSIGNED })
            },
            buildVariables: ({ status }) => ({
                input: { userId: id, status }
            }),
            refetchQueries: [GET_USER_METRICS]
        });
    }, [mutate, id]);

    const statusOptions = React.useMemo(() => getOptions({
        items: AVAILABLE_STATUSES,
        currentValue: status,
        getValue: status => status,
        getLabel: status => USER_STATUS_ACTION_LABELS[status] || status,
        getColor: status => getStatusColor(status),
        onUpdate: (val) => handleUpdate(val as UserStatusType),
    }), [status, handleUpdate]);

    return (
        <ActionPopover
            title="Update Status"
            options={statusOptions}
            disabled={isStatusDisabled}
        >
            <ActionCellContent
                label={status}
                approvalStatus={approvalStatus}
                isLocked={isStatusDisabled}
            />
        </ActionPopover>
    )
};