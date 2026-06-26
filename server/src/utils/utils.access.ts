import { UserRole, UserStatus } from "@prisma/client";
import { throwForbidden, throwUnauthorized } from "./utils.errors";
import { SafeUser } from "@/types";

// export function requireValidUserAccess(user: { role: UserRole, status: UserStatus }): void {
//     /** Check if user is terminated */
//     if (user.status === UserStatus.TERMINATED) {
//         throwUnauthorized("Your account has been terminated. You can no longer access this system.");
//     }

//     /** Check if user is suspended */
//     if (user.status === UserStatus.SUSPENDED) {
//         throwUnauthorized("Your account is currently suspended. Please contact an administrator.");
//     }

//     /** Check if user is deactivated or any other non-active status */
//     if (user.status !== UserStatus.ACTIVE) {
//         throwUnauthorized(`Your account is ${user.status.toLowerCase()}. Please contact the administrator.`);
//     }

//     /** Check if user has an assigned role */
//     if (user.role === UserRole.UNASSIGNED) {
//         throwUnauthorized("Your account has not been assigned a role yet. Please contact an administrator.");
//     }
// }

const validators = [

    (user: SafeUser) => {
        if (!user) {
            return "You must be logged in to access this resource.";
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

export function requireValidUserAccess(user: SafeUser) {
    for (const validate of validators) {
        const error = validate(user);

        if (error) {
            throwForbidden(error);
        }
    }
}