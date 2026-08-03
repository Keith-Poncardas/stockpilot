import type { Row } from "@tanstack/react-table"
import {
    OrderDirection,
    UserApprovalStatus,
    UserOrderBy,
    UserRole,
    UserStatus,
    ApprovalStatus,
} from "./user.constants"

export {
    OrderDirection,
    UserApprovalStatus,
    UserOrderBy,
    UserRole,
    UserStatus,
    ApprovalStatus,
}

/**
 * ============================================
 * Types
 * ============================================
 */

export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;

    role: UserRole;
    status: UserStatus;
    approvalStatus: UserApprovalStatus;

    createdAt: string;
    updatedAt: string;

    salesProcessedCount: number | null;
    stockMovementsProcessedCount: number | null;
}

export interface UserMetrics {
    total: number;
    active: number;
    pendingApproval: number;
}

export interface Pagination {
    page: number;
    limit: number;

    firstItem: number;
    lastItem: number;

    totalItems: number;
    totalPages: number;

    hasPreviousPage: boolean;
    hasNextPage: boolean;
}

export interface PaginatedUser {
    data: User[];
    meta: Pagination;
}

/**
 * ============================================
 * Inputs
 * ============================================
 */

export interface GetUsersFilterInput {
    search?: string;
    role?: UserRole;
    status?: UserStatus;
    approvalStatus?: UserApprovalStatus;

    dateFrom?: string;
    dateTo?: string;

    orderBy?: UserOrderBy;
    orderDirection?: OrderDirection;
}

export interface GetUsersInput {
    limit?: number;
    page?: number;
    filter: GetUsersFilterInput;
}

export interface UpdateUserStatusInput {
    userId: string;
    status: UserStatus;
}

export interface ApproveRejectUserInput {
    userId: string;
    approvalStatus: UserApprovalStatus;
}

export interface AssignRoleInput {
    userId: string;
    role: UserRole;
}

/**
 * ============================================
 * Client Helper Types
 * ============================================
 */

export interface IUser extends User {
    isCurrentUser?: boolean;
}

export interface IUserDetail extends Omit<IUser, 'isCurrentUser'> {
    salesProcessed?: number;
    stockMovementProcessed?: number;
}

export type IUserIdentify = Pick<
    IUser,
    'id' | 'firstName' | 'lastName' | 'email' | 'role' | 'status'
>;

export interface UserRowInfoCellProps {
    row: Row<IUser>;
}