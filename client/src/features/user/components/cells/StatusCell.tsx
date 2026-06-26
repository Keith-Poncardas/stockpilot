import { ApprovalStatus, AVAILABLE_STATUSES, UserRole, UserStatus } from "@/features/user/user.constants";
import type { UserRowInfoCellProps } from "../../user.types";
import { useOptimisticMutation } from "@/hooks/useOptimisticMutation";
import { CHANGE_USER_STATUS } from "../../operations";
import { getOptions } from "../../user.utils";
import { getStatusColor } from "@/lib/utils";
import ActionPopover from "@/components/ActionPopover";
import { ActionCellContent } from "./ActionCellContent";

export function StatusCell({ row }: UserRowInfoCellProps) {
    const { mutate } = useOptimisticMutation();
    const { role, status, approvalStatus, id } = row.original;
    const isStatusDisabled =
        status === UserStatus.TERMINATED.a ||
        role === UserRole.SUPER_ADMIN ||
        approvalStatus === ApprovalStatus.PENDING.a ||
        approvalStatus === ApprovalStatus.REJECTED.a;

    const handleUpdate = async (newStatus: UserStatus) => {
        await mutate({
            mutation: CHANGE_USER_STATUS,
            typename: 'User',
            entityId: id,
            optimisticFields: {
                status: newStatus,
                ...(newStatus === UserStatus.TERMINATED.a && { role: UserRole.UNASSIGNED })
            },
            buildVariables: ({ status }) => ({
                input: { userId: id, status }
            }),
        });
    }

    const statusOptions = getOptions({
        items: AVAILABLE_STATUSES,
        currentValue: status,
        getValue: status => status.a,
        getLabel: status => status.b,
        getColor: status => getStatusColor(status.a),
        onUpdate: handleUpdate,
    });

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