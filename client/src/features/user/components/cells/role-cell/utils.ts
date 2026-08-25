import type { IUser, UserRoleType } from "@/features/user/types";
import {
    UserRole,
    UserStatus,
    UserApprovalStatus,
    AVAILABLE_ROLES
} from "@/features/user/user.constants";
import { ASSIGN_ROLE } from "@/features/user/operations";
import { ROLE_COLORS } from "@/features/user/user.config";

/**
 * Determines whether the role selection for a user should be locked (disabled).
 * The role is locked if the user is the currently logged-in user, is terminated,
 * is a SUPER_ADMIN, or has not been approved yet.
 *
 * @param currentUserId - The ID of the currently authenticated user.
 * @param rowUser - The user object associated with the current row.
 * @returns True if the role selection should be locked, otherwise false.
 */
export function isRoleLocked(
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

/**
 * Generates the configuration required for the useOptimisticMutation hook
 * to assign a new role to a user.
 *
 * @param id - The ID of the user whose role is being updated.
 * @param newRole - The new role to assign to the user.
 * @returns The mutation configuration object.
 */
export function getRoleMutationConfig(id: string, newRole: UserRoleType) {
    return {
        mutation: ASSIGN_ROLE,
        typename: 'User' as const,
        entityId: id,
        optimisticFields: { role: newRole },
        buildVariables: ({ role }: { role: UserRoleType }) => ({
            input: { userId: id, role }
        }),
    };
}

/**
 * Generates the options configuration required for the ActionPopover component
 * to render the list of available roles for a user.
 *
 * @param currentValue - The current role of the user.
 * @param onUpdate - Callback function triggered when a new role is selected.
 * @returns The options configuration object.
 */
export function getRoleOptionsConfig(
    currentValue: UserRoleType,
    onUpdate: (val: UserRoleType) => void
) {
    return {
        items: AVAILABLE_ROLES,
        currentValue,
        getValue: (role: UserRoleType) => role,
        colorConfig: ROLE_COLORS,
        onUpdate: (val: string) => onUpdate(val as UserRoleType)
    };
}