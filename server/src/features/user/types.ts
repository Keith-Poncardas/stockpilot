import { UserApprovalStatus, UserRole, UserStatus } from "@prisma/client";
import { assignRoleSchema, changeUserApprovalStatusSchema, paginatedUsersSchema, updateUserStatusSchema } from "./user.validation";
import z from "zod";

/**
 * Input type for user status and approval transitions.
 *
 * Used to validate and determine the next status and role
 * for a user based on their current role and the desired
 * approval or status change.
 */
export interface UserTransitionInput {
    currentRole: UserRole;
    approvalStatus?: UserApprovalStatus;
    status?: UserStatus;
}

/**
 * Represents the resulting status and role after a user transition.
 *
 * Returned by the user transition function, this type indicates
 * the next status and role that should be applied to the user
 * based on the performed transition.
 */
export interface UserTransitionResult {
    status?: UserStatus;
    role?: UserRole;
}

/**
 * Input type for retrieving a paginated list of users.
 *
 * This type is inferred from `paginatedUsersSchema` to keep
 * the TypeScript type synchronized with the validation schema.
 */
export type PaginatedUsersInput = z.infer<
    typeof paginatedUsersSchema
>;

/**
 * Input type for updating a user's account status.
 *
 * This type is inferred from `updateUserStatusSchema`.
 */
export type UpdateUserStatusInput = z.infer<
    typeof updateUserStatusSchema
>;

/**
 * Input type for approving or rejecting a user.
 *
 * This type is inferred from `changeUserApprovalStatusSchema`.
 */
export type ChangeUserApprovalStatusInput = z.infer<
    typeof changeUserApprovalStatusSchema
>;

/**
 * Input type for assigning a role to a user.
 *
 * This type is inferred from `assignRoleSchema`.
 */
export type AssignRoleInput = z.infer<
    typeof assignRoleSchema
>;