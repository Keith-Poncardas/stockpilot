import type { Row } from "@tanstack/react-table";
import {
    UserRole as UserRoleConst,
    UserStatus as UserStatusConst,
    UserApprovalStatus as UserApprovalStatusConst
} from "./contants";

/**
 * Type representing the possible user roles in the system.
 */
export type UserRoleType = (
    typeof UserRoleConst
)[keyof typeof UserRoleConst];

/**
 * Type representing the possible account statuses a user can have.
 */
export type UserStatusType = (
    typeof UserStatusConst
)[keyof typeof UserStatusConst];

/**
 * Type representing the approval lifecycle status of a user's account.
 */
export type UserApprovalStatusType = (
    typeof UserApprovalStatusConst
)[keyof typeof UserApprovalStatusConst];

/**
 * Type representing a user in the system.
 */
export interface IUser {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: UserRoleType;
    status: UserStatusType;
    approvalStatus: UserApprovalStatusType;
    createdAt: string;
    updatedAt: string;
}

/**
 * Type representing a user with additional information.
 */
export interface IUserWithInfo extends IUser {
    salesCount?: number;
    stockMovementsCount?: number;
}

/**
 * Type representing the props for the user about card.
 */
export interface IUserProps {
    user?: IUserWithInfo | null;
    isLoading?: boolean;
}

/**
 * Type representing metrics for users.
 */
export interface UserMetrics {
    total: number;
    active: number;
    pendingApproval: number;
}

/**
 * Type representing the props for the user row info cell.
 */
export interface UserRowInfoCellProps {
    row: Row<IUser>;
}

/**
 * Type representing an option in a dropdown or selection menu.
 */
export type Option = {
    id: string;
    label: string;
    colorClassName?: string;
    onClick: () => void;
};

/**
 * Type representing filters used for building user query filters.
 */
export interface UserQueryFilters extends UserFilters {
    search?: string;
}

/**
 * Type representing the filters for user queries.
 */
export interface UserFilters {
    role: string;
    status: string;
    approvalStatus: string;
    dateFrom: string;
    dateTo: string;
    acsDesc: string;
}

