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

