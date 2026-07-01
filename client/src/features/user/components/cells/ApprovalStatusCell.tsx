import { ApprovalStatus, AVAILABLE_APPROVAL_STATUSES, UserStatus } from "@/features/user/user.constants";
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
    const isFinalDecision = approvalStatus === ApprovalStatus.APPROVED.a || approvalStatus === ApprovalStatus.REJECTED.a;
    const isTerminated = row.original.status === UserStatus.TERMINATED.a;
    const isLocked = isCurrentUser || isFinalDecision || isTerminated;

    const handleUpdate = async (newStatus: ApprovalStatus) => {
        await mutate({
            mutation: APPROVE_REJECT_USER,
            typename: 'User',
            entityId: id,
            optimisticFields: {
                approvalStatus: newStatus,
                status: newStatus === ApprovalStatus.APPROVED.a ? UserStatus.ACTIVE.a : UserStatus.TERMINATED.a
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
        getValue: status => status.a,
        getLabel: status => status.b,
        getColor: status => getApprovalStatusColor(status.a),
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