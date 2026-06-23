import { excludeEnumValue } from "@/utils";
import { UserApprovalStatus, UserRole, UserStatus } from "@prisma/client";
import z from "zod";
import { dateRangeRefine, dateRangeRefineMessage, dateRangeSchema, orderDirectionLowerSchema, paginationSchema, searchSchema, userIdSchema } from "@/schemas";
import { OrderDirectionLower, UserOrderBy } from "@/enums";

/** ROLE SCHEMA (SUPER ADMIN EXCLUDED) */
const assignableUserRoleSchema = z.enum(
    excludeEnumValue(UserRole, UserRole.SUPER_ADMIN),
    { error: "Invalid user role" }
);

/** USER STATUS SCHEMA */
const userStatusSchema = z.enum(
    UserStatus,
    {
        error: "Invalid user status"
    }
);

/** USER APPROVAL STATUS SCHEMA */
const userApprovalStatusSchema = z.enum(
    UserApprovalStatus,
    {
        error: "Invalid user approval status"
    }
);

/** ORDER BY USER SCHEMA */
const userOrderBySchema = z.enum(UserOrderBy);

/** FILTER USER SCHEMA */
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

/** PAGINATED USERS SCHEMA */
export const paginatedUsersSchema = paginationSchema.extend({
    filter: filterUserSchema
});

/** BASE USER SCHEMA */
const baseUserSchema = z.object({
    firstName: z
        .string()
        .trim()
        .min(1, "First name is required")
        .max(100, "First name must be at most 100 characters")
    ,
    lastName: z
        .string()
        .trim()
        .min(1, "Last name is required")
        .max(100, "Last name must be at most 100 characters")
    ,
    email: z
        .email("Invalid email address")
        .trim()
});

/** ADMIN CREATE USER SCHEMA */
export const adminCreateUserSchema = baseUserSchema.extend({
    role: assignableUserRoleSchema
        .optional()
        .default(UserRole.CASHIER)
});

/** ADMIN UPDATE USER SCHEMA */
const adminUserUpdateSchema = baseUserSchema.extend({
    role: assignableUserRoleSchema,
    status: userStatusSchema
}).partial();

/** EDIT USER SCHEMA */
export const editUserSchema = z.object({
    userId: userIdSchema,
    data: adminUserUpdateSchema
}).refine(
    ({ data }) =>
        Object.values(data).some((value) => value !== undefined),
    {
        message: "At least one field must be provided to update",
        path: ["data"],
    }
);

/** UPDATE USER STATUS SCHEMA */
export const updateUserStatusSchema = z.object({
    userId: userIdSchema,
    status: userStatusSchema
});

/** INFERED TYPES */
export type UserIdInput = z.infer<typeof userIdSchema>;
export type PaginatedUsersInput = z.infer<typeof paginatedUsersSchema>;
export type CreateUserInput = z.infer<typeof adminCreateUserSchema>;
export type EditUserInput = z.infer<typeof editUserSchema>;
export type UpdateUserStatusInput = z.infer<typeof updateUserStatusSchema>;