import type {
    UserApprovalStatusType as UserApprovalStatusConst,
    UserRoleType as UserRoleConst,
    UserStatusType as UserStatusConst
} from "./types";

/**
 * Defines the available roles for users in the system.
 * This determines the user's permissions and access level.
 */
export const UserRole = {
    UNASSIGNED: 'UNASSIGNED',
    SUPER_ADMIN: 'SUPER_ADMIN',
    ADMIN: 'ADMIN',
    MANAGER: 'MANAGER',
    CASHIER: 'CASHIER',
} as const;

/**
 * Defines the current account status of a user.
 * Controls whether the user can log in and interact with the system.
 */
export const UserStatus = {
    INACTIVE: 'INACTIVE',
    ACTIVE: 'ACTIVE',
    SUSPENDED: 'SUSPENDED',
    TERMINATED: 'TERMINATED',
} as const;

/**
 * Defines the approval state of a user's account.
 * Used for tracking the lifecycle of newly registered accounts awaiting admin review.
 */
export const UserApprovalStatus = {
    PENDING: 'PENDING',
    APPROVED: 'APPROVED',
    REJECTED: 'REJECTED',
} as const;

/**
 * Array of available user roles, excluding the SUPER_ADMIN role.
 * Used for role selection in user management interfaces where assigning super admin is not allowed.
 */
export const AVAILABLE_ROLES = Object.values(UserRole).filter(
    (role) => role !== UserRole.SUPER_ADMIN
) as UserRoleConst[];

/**
 * Array of all available user statuses.
 * Used for populating status selection dropdowns or filters.
 */
export const AVAILABLE_STATUSES = Object.values(
    UserStatus
) as UserStatusConst[];

/**
 * Array of available approval statuses for admin actions, excluding the PENDING status.
 * Used for admin interfaces where they can approve or reject users, but not set them back to pending.
 */
export const AVAILABLE_APPROVAL_STATUSES = Object.values(
    UserApprovalStatus
).filter(
    (status) => status !== UserApprovalStatus.PENDING
) as UserApprovalStatusConst[];

/**
 * Mapping of user statuses to their corresponding action labels.
 * Used for rendering buttons or menu items that change a user's status.
 */
export const USER_STATUS_ACTION_LABELS:
    Record<UserStatusConst, string> = {
    [UserStatus.ACTIVE]: "ACTIVATE",
    [UserStatus.INACTIVE]: "DEACTIVATE",
    [UserStatus.SUSPENDED]: "SUSPEND",
    [UserStatus.TERMINATED]: "TERMINATE",
};

/**
 * Mapping of approval statuses to their corresponding action labels.
 * Used for rendering action buttons related to user approval workflows.
 */
export const APPROVAL_STATUS_ACTION_LABELS:
    Record<UserApprovalStatusConst, string> = {
    [UserApprovalStatus.PENDING]: "PENDING",
    [UserApprovalStatus.APPROVED]: "APPROVE",
    [UserApprovalStatus.REJECTED]: "REJECT",
};

