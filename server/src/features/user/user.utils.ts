import { UUIDInput } from "@/schemas";
import { throwConflict } from "@/utils";
import { UserApprovalStatus, UserRole, UserStatus } from "@prisma/client";
import { UserTransitionInput, UserTransitionResult } from "./types";

/**
 * Validates that a user is not attempting to perform a restricted action on their own user account.
 * 
 * @param currentUserId - The UUID of the user initiating the request.
 * @param targetUserId - The UUID of the target user account being acted upon.
 * @param message - Optional custom error message. Defaults to `"You cannot perform this action on yourself"`.
 * 
 * @throws {HttpError} Throws a conflict error (HTTP 409) via `throwConflict` if `currentUserId` matches `targetUserId`.
 */
export function ensureNotSelfAction(
    currentUserId: UUIDInput,
    targetUserId: UUIDInput,
    message = "You cannot perform this action on yourself"
) {
    if (currentUserId === targetUserId) {
        throwConflict(message);
    }
}

/**
 * Validates that the target user's approval status is set to APPROVED before assigning them a role.
 * 
 * This function is crucial for maintaining data integrity and business logic that prevents
 * unapproved or rejected users from being assigned roles.
 * 
 * @param approvalStatus - The current UserApprovalStatus of the user to be validated.
 * 
 * @throws {HttpError} Throws a conflict error (HTTP 409) via `throwConflict` if `approvalStatus`
 * is not equal to UserApprovalStatus.APPROVED.
 */
export function ensureApprovedUser(
    approvalStatus: UserApprovalStatus
) {
    if (approvalStatus !== UserApprovalStatus.APPROVED) {
        throwConflict("Cannot assign role to an unapproved user");
    }
}

/**
 * Validates that the new role is different from the current role.
 * 
 * This check is essential to prevent unnecessary database writes and to enforce the business logic
 * that a user update should only occur if there is a genuine change in role assignment.
 * 
 * @param currentRole - The user's current UserRole.
 * @param newRole - The new UserRole attempting to be assigned.
 * 
 * @throws {HttpError} Throws a conflict error (HTTP 409) via `throwConflict` if `currentRole`
 * is identical to `newRole`.
 */
export function ensureRoleChanged(
    currentRole: UserRole,
    newRole: UserRole
) {
    if (currentRole === newRole) {
        throwConflict(`User already has the role ${newRole}`);
    }
}

/**
 * Validates that the user is not attempting to modify the role of a SUPER_ADMIN.
 * 
 * This function enforces a critical business rule that the SUPER_ADMIN user is a protected
 * entity within the system and cannot be demoted or reassigned, ensuring system stability
 * and preventing unauthorized privilege escalations.
 * 
 * @param role - The UserRole of the user whose role is being modified.
 * 
 * @throws {HttpError} Throws a conflict error (HTTP 409) via `throwConflict` if `role`
 * is equal to `UserRole.SUPER_ADMIN`.
 */
export function ensureNotSuperAdmin(
    role: UserRole
) {
    if (role === UserRole.SUPER_ADMIN) {
        throwConflict("Cannot change role of SUPER_ADMIN user");
    }
}

/**
 * Validates that the user's approval status is PENDING before allowing a modification.
 * 
 * This function is a gatekeeper for state transitions, ensuring that users who are already approved
 * or rejected cannot have their approval status changed, thus maintaining the integrity of the user
 * lifecycle management process.
 * 
 * @param approvalStatus - The current UserApprovalStatus of the user to be validated.
 * 
 * @throws {HttpError} Throws a conflict error (HTTP 409) via `throwConflict` if `approvalStatus`
 * is equal to `UserApprovalStatus.APPROVED` or `UserApprovalStatus.REJECTED`.
 */
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

/**
 * Validates that the user is not attempting to modify the status of a TERMINATED user.
 * 
 * This function serves as a safeguard to enforce the immutability of the TERMINATED state, 
 * ensuring that once a user is terminated, they cannot be reinstated or have their status changed.
 * 
 * @param status - The current UserStatus of the user to be validated.
 * 
 * @throws {HttpError} Throws a conflict error (HTTP 409) via `throwConflict` if `status`
 * is equal to `UserStatus.TERMINATED`.
 */
export function ensureNotTerminated(
    status: UserStatus
) {
    if (status === UserStatus.TERMINATED) {
        throwConflict(
            "Cannot change the approval status of a terminated user"
        );
    }
}

/**
 * Calculates the resulting user state transitions based on the input parameters.
 * 
 * This utility function determines the new status and role for a user by evaluating
 * changes in their approval status and active status. It encapsulates the core business logic
 * for user state management.
 * 
 * @param params - An object containing the user's current role, and optional approval status and status values.
 * @param params.currentRole - The user's current UserRole.
 * @param params.approvalStatus - Optional. The new UserApprovalStatus. If provided, status and role may be updated.
 * @param params.status - Optional. The new UserStatus. If provided, role may be updated.
 * 
 * @returns A UserTransitionResult object containing the determined status and role.
 *          - If approvalStatus is provided: status becomes ACTIVE for APPROVED, TERMINATED for REJECTED.
 *            Role becomes UNASSIGNED for REJECTED.
 *          - If status is provided: role becomes UNASSIGNED for TERMINATED.
 */
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