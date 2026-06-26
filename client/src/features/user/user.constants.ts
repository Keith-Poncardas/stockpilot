export const UserRole = {
    SUPER_ADMIN: 'SUPER_ADMIN',
    ADMIN: 'ADMIN',
    MANAGER: 'MANAGER',
    CASHIER: 'CASHIER',
    UNASSIGNED: 'UNASSIGNED',
} as const;

export const UserStatus = {
    ACTIVE: {
        a: "ACTIVE",
        b: "ACTIVATE"
    },
    INACTIVE: {
        a: "INACTIVE",
        b: "DEACTIVATE"
    },
    SUSPENDED: {
        a: "SUSPENDED",
        b: "SUSPEND"
    },
    TERMINATED: {
        a: "TERMINATED",
        b: "TERMINATE"
    },
} as const;

export const ApprovalStatus = {
    PENDING: {
        a: 'PENDING',
        b: 'PENDING',
    },
    APPROVED: {
        a: 'APPROVED',
        b: 'APPROVE',
    },
    REJECTED: {
        a: 'REJECTED',
        b: 'REJECT',
    },
} as const;

export const AVAILABLE_ROLES = Object.values(UserRole).filter(
    (role) => role !== UserRole.SUPER_ADMIN
) as Array<(typeof UserRole)[keyof typeof UserRole]>;

export const AVAILABLE_STATUSES = Object.values(UserStatus) as Array<
    (typeof UserStatus)[keyof typeof UserStatus]
>;

export const AVAILABLE_APPROVAL_STATUSES = Object.values(
    ApprovalStatus
).filter((status) => status.a !== ApprovalStatus.PENDING.a) as Array<
    (typeof ApprovalStatus)[keyof typeof ApprovalStatus]
>;

export type ApprovalStatus =
    (typeof ApprovalStatus)[keyof typeof ApprovalStatus]['a'];

export type UserStatus = (typeof UserStatus)[keyof typeof UserStatus]["a"];
export type UserRole = typeof UserRole[keyof typeof UserRole];

