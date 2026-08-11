import type { Row } from "@tanstack/react-table";
import {
    UserRole as UserRoleConst,
    UserStatus as UserStatusConst,
    UserApprovalStatus as UserApprovalStatusConst
} from "./contants";

/**
 * Type representing the possible user roles in the system.
 */
export type UserRole = (
    typeof UserRoleConst
)[keyof typeof UserRoleConst];

/**
 * Type representing the possible account statuses a user can have.
 */
export type UserStatus = (
    typeof UserStatusConst
)[keyof typeof UserStatusConst];

/**
 * Type representing the approval lifecycle status of a user's account.
 */
export type UserApprovalStatus = (
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
    role: UserRole;
    status: UserStatus;
    approvalStatus: UserApprovalStatus;
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

