import { UUIDInput } from "@/schemas";
import { throwConflict } from "@/utils";
import { UserApprovalStatus, UserRole, UserStatus } from "@prisma/client";

export function ensureNotSelfAction(
    currentUserId: UUIDInput,
    targetUserId: UUIDInput,
    message = "You cannot perform this action on yourself"
) {
    if (currentUserId === targetUserId) {
        throwConflict(message);
    }
}

export function ensureApprovedUser(
    approvalStatus: UserApprovalStatus
) {
    if (approvalStatus !== UserApprovalStatus.APPROVED) {
        throwConflict("Cannot assign role to an unapproved user");
    }
}

export function ensureRoleChanged(
    currentRole: UserRole,
    newRole: UserRole
) {
    if (currentRole === newRole) {
        throwConflict(`User already has the role ${newRole}`);
    }
}

export function ensureNotSuperAdmin(
    role: UserRole
) {
    if (role === UserRole.SUPER_ADMIN) {
        throwConflict("Cannot change role of SUPER_ADMIN user");
    }
}

export function ensurePendingApprovalStatus(
    approvalStatus: UserApprovalStatus
) {
    const immutableStatuses: readonly UserApprovalStatus[] = [
        UserApprovalStatus.APPROVED,
        UserApprovalStatus.REJECTED,
    ];

    if (immutableStatuses.includes(approvalStatus)) {
        throwConflict(
            `Cannot change the approval status of an ${approvalStatus} user`
        );
    }
}

export function ensureNotTerminated(
    status: UserStatus
) {
    if (status === UserStatus.TERMINATED) {
        throwConflict(
            "Cannot change the approval status of a terminated user"
        );
    }
}

export interface UserTransitionInput {
    currentRole: UserRole;
    approvalStatus?: UserApprovalStatus;
    status?: UserStatus;
}

export interface UserTransitionResult {
    status?: UserStatus;
    role?: UserRole;
}

export function getUserTransition({
    currentRole,
    approvalStatus,
    status,
}: UserTransitionInput): UserTransitionResult {

    if (approvalStatus !== undefined) {
        return {
            status:
                approvalStatus === UserApprovalStatus.APPROVED
                    ? UserStatus.ACTIVE
                    : UserStatus.TERMINATED,

            role:
                approvalStatus === UserApprovalStatus.REJECTED
                    ? UserRole.UNASSIGNED
                    : undefined,
        };
    }

    if (status !== undefined) {
        return {
            status,
            role:
                status === UserStatus.TERMINATED
                    ? UserRole.UNASSIGNED
                    : currentRole,
        };
    }

    return {};
}