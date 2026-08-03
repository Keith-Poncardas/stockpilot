/**
 * ============================================
 * Enums (const objects for erasableSyntaxOnly)
 * ============================================
 */

export const UserRole = {
    UNASSIGNED: "UNASSIGNED",
    SUPER_ADMIN: "SUPER_ADMIN",
    ADMIN: "ADMIN",
    MANAGER: "MANAGER",
    CASHIER: "CASHIER",
} as const;
export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export const UserStatus = {
    INACTIVE: "INACTIVE",
    ACTIVE: "ACTIVE",
    SUSPENDED: "SUSPENDED",
    TERMINATED: "TERMINATED",
} as const;
export type UserStatus = (typeof UserStatus)[keyof typeof UserStatus];

export const UserApprovalStatus = {
    PENDING: "PENDING",
    APPROVED: "APPROVED",
    REJECTED: "REJECTED",
} as const;
export type UserApprovalStatus =
    (typeof UserApprovalStatus)[keyof typeof UserApprovalStatus];

export const OrderDirection = {
    ASC: "asc",
    DESC: "desc",
} as const;
export type OrderDirection = (typeof OrderDirection)[keyof typeof OrderDirection];

export const UserOrderBy = {
    FIRST_NAME: "firstName",
    LAST_NAME: "lastName",
    EMAIL: "email",
    CREATED_AT: "createdAt",
} as const;
export type UserOrderBy = (typeof UserOrderBy)[keyof typeof UserOrderBy];

/**
 * ============================================
 * Backward Compatibility & Helper Constants
 * ============================================
 */

export type ApprovalStatus = UserApprovalStatus;
export const ApprovalStatus = UserApprovalStatus;

export const AVAILABLE_ROLES = Object.values(UserRole).filter(
    (role) => role !== UserRole.SUPER_ADMIN
) as UserRole[];

export const AVAILABLE_STATUSES = Object.values(UserStatus) as UserStatus[];

export const AVAILABLE_APPROVAL_STATUSES = Object.values(
    UserApprovalStatus
).filter((status) => status !== UserApprovalStatus.PENDING) as UserApprovalStatus[];

export const USER_STATUS_ACTION_LABELS: Record<UserStatus, string> = {
    [UserStatus.ACTIVE]: "ACTIVATE",
    [UserStatus.INACTIVE]: "DEACTIVATE",
    [UserStatus.SUSPENDED]: "SUSPEND",
    [UserStatus.TERMINATED]: "TERMINATE",
};

export const APPROVAL_STATUS_ACTION_LABELS: Record<UserApprovalStatus, string> = {
    [UserApprovalStatus.PENDING]: "PENDING",
    [UserApprovalStatus.APPROVED]: "APPROVE",
    [UserApprovalStatus.REJECTED]: "REJECT",
};

