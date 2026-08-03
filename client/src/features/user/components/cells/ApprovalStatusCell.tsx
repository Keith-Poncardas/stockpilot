import { ApprovalStatus, AVAILABLE_APPROVAL_STATUSES, UserStatus, APPROVAL_STATUS_ACTION_LABELS } from "@/features/user/user.constants";
import type { UserRowInfoCellProps } from "../../user.types";
import { useOptimisticMutation } from "@/hooks/useOptimisticMutation";
import { APPROVE_REJECT_USER, GET_USER_METRICS } from "../../operations";
import { getOptions } from "../../user.utils";
import { getApprovalStatusColor } from "@/lib/utils";
import ActionPopover from "@/components/ActionPopover";
import { ActionCellContent } from "./ActionCellContent";
import { useAuthStore } from "@/store";

export function ApprovalStatusCell({ row }: UserRowInfoCellProps) {
    const { user } = useAuthStore();
    const { mutate } = useOptimisticMutation();
    const { approvalStatus, id } = row.original;

    const isCurrentUser = user?.id === id;
    const isFinalDecision = approvalStatus === ApprovalStatus.APPROVED || approvalStatus === ApprovalStatus.REJECTED;
    const isTerminated = row.original.status === UserStatus.TERMINATED;
    const isLocked = isCurrentUser || isFinalDecision || isTerminated;

    const handleUpdate = async (newStatus: ApprovalStatus) => {
        await mutate({
            mutation: APPROVE_REJECT_USER,
            typename: 'User',
            entityId: id,
            optimisticFields: {
                approvalStatus: newStatus,
                status: newStatus === ApprovalStatus.APPROVED ? UserStatus.ACTIVE : UserStatus.TERMINATED
            },
            buildVariables: ({ approvalStatus }) => ({
                input: { userId: id, approvalStatus }
            }),
            refetchQueries: [GET_USER_METRICS]
        });
    }

    const statusOptions = getOptions({
        items: AVAILABLE_APPROVAL_STATUSES,
        currentValue: approvalStatus,
        getValue: status => status,
        getLabel: status => APPROVAL_STATUS_ACTION_LABELS[status] || status,
        getColor: status => getApprovalStatusColor(status),
        onUpdate: (val) => handleUpdate(val as ApprovalStatus),
    });

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