import type { IUser, UserStatusType } from "@/features/user/types";
import {
    UserRole,
    UserStatus,
    UserApprovalStatus,
    AVAILABLE_STATUSES,
    USER_STATUS_ACTION_LABELS
} from "@/features/user/user.constants";
import { CHANGE_USER_STATUS, GET_USER_METRICS } from "@/features/user/operations";
import { STATUS_COLORS } from "@/features/user/user.config";

export function isUserStatusLocked(
    currentUserId: string,
    rowUser: IUser
): boolean {
    const isCurrentUser = currentUserId === rowUser.id;

    return (
        isCurrentUser ||
        rowUser.status === UserStatus.TERMINATED ||
        rowUser.role === UserRole.SUPER_ADMIN ||
        rowUser.approvalStatus !== UserApprovalStatus.APPROVED
    );
}

export function getUserStatusMutationConfig(id: string, newStatus: UserStatusType) {
    return {
        mutation: CHANGE_USER_STATUS,
        typename: 'User' as const,
        entityId: id,
        optimisticFields: { status: newStatus },
        buildVariables: ({ status }: { status: UserStatusType }) => ({
            input: { userId: id, status }
        }),
        refetchQueries: [GET_USER_METRICS]
    };
}

export function getUserStatusOptionsConfig(
    currentValue: UserStatusType,
    onUpdate: (val: UserStatusType) => void
) {
    return {
        items: AVAILABLE_STATUSES,
        currentValue,
        getValue: (status: UserStatusType) => status,
        labelConfig: USER_STATUS_ACTION_LABELS,
        colorConfig: STATUS_COLORS,
        onUpdate: (val: string) => onUpdate(val as UserStatusType)
    };
}
