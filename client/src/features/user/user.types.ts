import type { Row } from "@tanstack/react-table"
import type { ApprovalStatus, UserRole, UserStatus } from "./user.constants"

export interface IUser {
    id: string
    firstName: string
    lastName: string
    email: string
    role: UserRole
    status: UserStatus
    approvalStatus: ApprovalStatus
    createdAt: string
    isCurrentUser?: boolean
}

export interface IUserDetail extends Omit<IUser, 'isCurrentUser'> {
    salesProcessed: number;
    stockMovementProcessed: number;
}

export type IUserIdentify = Pick<IUser, 'firstName' | 'lastName' | 'email' | 'role'>;

export interface UserRowInfoCellProps {
    row: Row<IUser>
}