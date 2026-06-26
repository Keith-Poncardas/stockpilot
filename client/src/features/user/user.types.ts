import type { ApprovalStatus, Role, Status } from "@/constants/enums"
import type { Row } from "@tanstack/react-table"

export interface IUser {
    id: string
    firstName: string
    lastName: string
    email: string
    role: Role
    status: Status
    approvalStatus: ApprovalStatus
    createdAt: string
    isCurrentUser?: boolean
}

export interface UserRowInfoCellProps {
    row: Row<IUser>
}