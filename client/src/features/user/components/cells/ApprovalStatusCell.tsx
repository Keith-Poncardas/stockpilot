import * as React from 'react';
import { useOptimisticMutation } from "@/hooks/useOptimisticMutation";
import { APPROVE_REJECT_USER, GET_USER_METRICS } from "../../operations";
import { getOptions } from "../../user.utils";
import { getApprovalStatusColor } from "@/lib/utils";
import ActionPopover from "@/components/ActionPopover";
import { ActionCellContent } from "./ActionCellContent";
import { useAuthStore } from "@/store";
import type {
    UserRowInfoCellProps,
    UserApprovalStatusType
} from "../../types";
import {
    UserApprovalStatus,
    UserStatus,
    AVAILABLE_APPROVAL_STATUSES,
    APPROVAL_STATUS_ACTION_LABELS
} from "../../contants";

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
    const { approvalStatus, id, status } = row.original;

    const isCurrentUser = user?.id === id;
    const isFinalDecision = approvalStatus === UserApprovalStatus.APPROVED || approvalStatus === UserApprovalStatus.REJECTED;
    const isTerminated = status === UserStatus.TERMINATED;
    const isLocked = isCurrentUser || isFinalDecision || isTerminated;

    const handleUpdate = React.useCallback(async (newStatus: UserApprovalStatusType) => {
        await mutate({
            mutation: APPROVE_REJECT_USER,
            typename: 'User',
            entityId: id,
            optimisticFields: {
                approvalStatus: newStatus,
                status: newStatus === UserApprovalStatus.APPROVED ? UserStatus.ACTIVE : UserStatus.TERMINATED
            },
            buildVariables: ({ approvalStatus }) => ({
                input: { userId: id, approvalStatus }
            }),
            refetchQueries: [GET_USER_METRICS]
        });
    }, [mutate, id]);

    const statusOptions = React.useMemo(() => getOptions({
        items: AVAILABLE_APPROVAL_STATUSES,
        currentValue: approvalStatus,
        getValue: status => status,
        getLabel: status => APPROVAL_STATUS_ACTION_LABELS[status] || status,
        getColor: status => getApprovalStatusColor(status),
        onUpdate: (val) => handleUpdate(val as UserApprovalStatusType),
    }), [approvalStatus, handleUpdate]);

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