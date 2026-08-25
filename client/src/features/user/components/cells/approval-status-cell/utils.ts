import {
    APPROVE_REJECT_USER,
    GET_USER_METRICS
} from "@/features/user/operations";
import {
    APPROVAL_STATUS_ACTION_LABELS,
    AVAILABLE_APPROVAL_STATUSES,
    UserApprovalStatus,
    UserRole,
    UserStatus
} from "@/features/user/user.constants";
import type {
    IUser,
    UserApprovalStatusType
} from "@/features/user/types";
import { APPROVAL_STATUS_COLORS } from "@/features/user/user.config";

/**
 * Determines whether the status cell should be locked (disabled) for the current user.
 * The cell is locked if the row belongs to the current user, the user is terminated,
 * has a SUPER_ADMIN role, or if their approval status is already approved or rejected.
 * 
 * @param {string} currentUserId - The unique identifier of the currently authenticated user.
 * @param {IUser} rowUser - The user data associated with the current table row.
 * @returns {boolean} Returns `true` if the cell should be locked, otherwise `false`.
 */
export function isStatusLocked(currentUserId: string, rowUser: IUser): boolean {
    const isCurrentUser = currentUserId === rowUser.id;

    return (
        isCurrentUser ||
        rowUser.status === UserStatus.TERMINATED ||
        rowUser.role === UserRole.SUPER_ADMIN ||
        rowUser.approvalStatus !== UserApprovalStatus.PENDING
    );
}

/**
 * Generates the configuration object required for optimistic mutation when updating a user's approval status.
 * It also handles side-effects like updating the overall user status based on the approval decision.
 * 
 * @param {string} id - The unique identifier of the user being updated.
 * @param {UserApprovalStatusType} newStatus - The new approval status to be applied.
 * @returns {Object} The mutation configuration object containing the GraphQL mutation, optimistic fields, variables builder, and queries to refetch.
 */
export function getApprovalStatusMutationConfig(
    id: string,
    newStatus: UserApprovalStatusType
) {
    return {
        mutation: APPROVE_REJECT_USER,
        typename: 'User' as const,
        entityId: id,
        optimisticFields: {
            approvalStatus: newStatus,
            status: newStatus === UserApprovalStatus.APPROVED ? UserStatus.ACTIVE : UserStatus.TERMINATED
        },
        buildVariables: ({ approvalStatus }: { approvalStatus: UserApprovalStatusType }) => ({
            input: { userId: id, approvalStatus }
        }),
        refetchQueries: [GET_USER_METRICS]
    };
}

/**
 * Generates the configuration options for the approval status dropdown menu.
 * This includes the available items, their corresponding labels, color styles, and the selection handler.
 * 
 * @param {UserApprovalStatusType} currentValue - The user's current approval status, which will be excluded from the selectable options.
 * @param {(val: UserApprovalStatusType) => void} onUpdate - The callback function triggered when a new approval status is selected.
 * @returns {Object} The configuration object to be passed into the generic `getOptions` utility.
 */
export function getApprovalStatusOptionsConfig(
    currentValue: UserApprovalStatusType,
    onUpdate: (val: UserApprovalStatusType) => void
) {
    return {
        items: AVAILABLE_APPROVAL_STATUSES,
        currentValue,
        getValue: (status: UserApprovalStatusType) => status,
        labelConfig: APPROVAL_STATUS_ACTION_LABELS,
        colorConfig: APPROVAL_STATUS_COLORS,
        onUpdate: (val: string) => onUpdate(val as UserApprovalStatusType)
    };
}