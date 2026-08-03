import { excludeEnumValue } from "@/utils";
import { UserApprovalStatus, UserRole, UserStatus } from "@prisma/client";
import z from "zod";
import { dateRangeRefine, dateRangeRefineMessage, dateRangeSchema, orderDirectionLowerSchema, paginationSchema, searchSchema, uuidSchema } from "@/schemas";
import { OrderDirectionLower, UserOrderBy } from "@/enums";

/**
 * Zod schema for roles that can be assigned to a user.
 *
 * This schema accepts every `UserRole` except `SUPER_ADMIN`.
 * It is used to prevent assigning the Super Admin role through
 * user-facing operations.
 */
const assignableUserRoleSchema = z.enum(
    excludeEnumValue(UserRole, UserRole.SUPER_ADMIN),
    { error: "Invalid user role" }
);

/**
 * Zod schema for validating user status values.
 *
 * This schema accepts only valid values from the `UserStatus`
 * enum and rejects any invalid status.
 */
const userStatusSchema = z.enum(
    UserStatus,
    {
        error: "Invalid user status"
    }
);

/**
 * Zod schema for approval statuses that can be assigned to a user.
 *
 * This schema accepts every `UserApprovalStatus` except `PENDING`.
 * It is used when approving or rejecting a user, since a user
 * cannot be changed back to the pending state.
 */
const assignableUserApprovalStatusSchema = z.enum(
    excludeEnumValue(UserApprovalStatus, UserApprovalStatus.PENDING),
    {
        error: "Invalid user approval status",
    }
);

/**
 * Zod schema for validating user approval status values.
 *
 * This schema accepts only valid values from the `UserApprovalStatus`
 * enum and rejects any invalid status.
 */
const userApprovalStatusSchema = z.enum(
    UserApprovalStatus,
    {
        error: "Invalid user approval status"
    }
);

/**
 * Zod schema for validating user ordering values.
 *
 * This schema accepts only valid values from the `UserOrderBy`
 * enum and rejects any invalid ordering.
 */
const userOrderBySchema = z.enum(UserOrderBy);

/**
 * Zod schema for filtering users.
 *
 * This schema combines date range filtering, search functionality,
 * and optional filters for role, status, and approval status.
 * It also includes default ordering and sort direction.
 */
const filterUserSchema = dateRangeSchema.extend({
    search: searchSchema,
    role: z
        .enum(UserRole)
        .optional(),
    status: userStatusSchema
        .optional(),
    approvalStatus: userApprovalStatusSchema
        .optional(),
    orderBy: userOrderBySchema
        .default(UserOrderBy.CREATED_AT),
    orderDirection: orderDirectionLowerSchema
        .default(OrderDirectionLower.DESC)
}).refine(dateRangeRefine, dateRangeRefineMessage);

/**
 * Zod schema for validating paginated user queries.
 *
 * This schema combines the common pagination fields with
 * user-specific filter options, ensuring that pagination,
 * searching, filtering, and sorting inputs are valid.
 */
export const paginatedUsersSchema = paginationSchema.extend({
    filter: filterUserSchema
});

/**
 * Zod schema for validating user approval or rejection.
 *
 * This schema ensures that the `userId` is a valid UUID and that
 * the `approvalStatus` is one of the assignable states (ACTIVE or
 * INACTIVE). It prevents changing a user's status back to PENDING,
 * as that would require re-approval.
 */
export const changeUserApprovalStatusSchema = z.object({
    userId: uuidSchema,
    approvalStatus: assignableUserApprovalStatusSchema
});

/**
 * Zod schema for validating user status changes.
 *
 * This schema ensures that the `userId` is a valid UUID and that
 * the `status` is one of the valid user statuses (ACTIVE, INACTIVE,
 * or DELETED). It prevents assigning an invalid status value.
 */
export const updateUserStatusSchema = z.object({
    userId: uuidSchema,
    status: userStatusSchema
});

/**
 * Zod schema for validating role assignment.
 *
 * This schema ensures that the `userId` is a valid UUID and that the `role`
 * is one of the assignable roles (ADMIN, STOCK_KEEPER, or SALES_REP).
 * It prevents assigning the SUPER_ADMIN role through user-facing operations,
 * as that is reserved for system administrators.
 */
export const assignRoleSchema = z.object({
    userId: uuidSchema,
    role: assignableUserRoleSchema
});