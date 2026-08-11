import { UserApprovalStatus, UserRole, UserStatus } from "@prisma/client";
import { throwGraphQLError, throwUnauthorized } from "./utils.errors";
import { SafeUser } from "@/types";

const validators = [

    (user: SafeUser) => {
        if (user.approvalStatus === UserApprovalStatus.REJECTED) {
            return "Your request to access this system has been rejected. Please contact the administrator to appeal or correct any issues.";
        }
    },

    (user: SafeUser) => {
        if (user.status === UserStatus.TERMINATED) {
            return "Your account has been terminated. You can no longer access this system.";
        }
    },

    (user: SafeUser) => {
        if (user.status === UserStatus.SUSPENDED) {
            return "Your account is currently suspended. Please contact an administrator.";
        }
    },

    (user: SafeUser) => {
        if (user.status !== UserStatus.ACTIVE) {
            return `Your account is ${user.status.toLowerCase()}. Please contact an administrator.`;
        }
    },

    (user: SafeUser) => {
        if (user.role === UserRole.UNASSIGNED) {
            return "Your account has not been assigned a role yet. Please contact an administrator.";
        }
    }
];

export function requireValidUserAccess(
    user: SafeUser,
    options?: { allowInactiveOrUnassigned?: boolean }
) {

    if (!user) {
        throwUnauthorized("You must be logged in to access this resource.");
    }

    for (const validate of validators) {

        if (options?.allowInactiveOrUnassigned) {
            const errorStr = validate(user);

            if (errorStr && (
                errorStr.includes("account is inactive") ||
                errorStr.includes("assigned a role")
            )) {
                continue;
            }
        }

        const error = validate(user);

        if (error) {
            throwGraphQLError(error, "ACCOUNT_RESTRICTED");
        }
    }
}