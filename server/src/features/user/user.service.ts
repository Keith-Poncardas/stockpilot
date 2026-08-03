import { prisma } from "@/lib";
import {
    buildSearchQuery,
    createPaginator,
} from "@/utils";
import {
    type Prisma,
    UserApprovalStatus,
    UserStatus
} from "@prisma/client";
import { UUIDInput } from "@/schemas";
import { ensureApprovedUser, ensureNotSelfAction, ensureNotSuperAdmin, ensureNotTerminated, ensurePendingApprovalStatus, ensureRoleChanged, getUserTransition } from "./user.utils";
import { AssignRoleInput, ChangeUserApprovalStatusInput, PaginatedUsersInput, UpdateUserStatusInput } from "./types";

export class UserService {

    /**
     * Default fields returned for all user queries.
     *
     * Using a shared select object keeps database queries consistent,
     * avoids returning unnecessary data, and prevents exposing sensitive
     * fields such as passwords.
     *
     * The `satisfies Prisma.UserSelect` check ensures that the selected
     * fields match Prisma's `UserSelect` type at compile time.
     */
    private select = {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        status: true,
        approvalStatus: true,
        createdAt: true,
        updatedAt: true,
    } satisfies Prisma.UserSelect;

    /**
     * Retrieves a single user by their unique ID.
     *
     * This method searches the database for a user that matches the
     * provided ID. If the user exists, it returns the selected user
     * fields defined in `this.select`.
     *
     * If no user is found, Prisma automatically throws an error
     * (`findUniqueOrThrow`), so no manual null check is needed.
     *
     * @async
     * @param {UUIDInput} userId - The unique ID of the user to retrieve.
     * @returns {Promise<User>} The user record with the selected fields.
     * @throws {Prisma.NotFoundError} If the user does not exist.
     */
    async getUser(userId: UUIDInput) {
        return await prisma.user.findUniqueOrThrow({
            where: { id: userId },
            select: this.select
        });
    }

    /**
     * Retrieves a paginated list of users with optional filtering,
     * searching, sorting, and pagination.
     *
     * This method allows clients to:
     * - Search users by email, first name, or last name.
     * - Filter users by role, status, and approval status.
     * - Filter users by a creation date range.
     * - Sort the results by a selected field and direction.
     * - Return paginated data together with pagination metadata.
     *
     * The query and total count are executed at the same time using
     * `Promise.all()` to improve performance.
     *
     * @async
     * @param {PaginatedUsersInput} args - Options for pagination, filtering, searching, and sorting.
     * @returns {Promise<PaginatedUsersResponse>} A paginated list of users and pagination metadata.
     */
    async getUsers(args: PaginatedUsersInput) {

        const { limit, page, filter } = args;

        const { params, buildMeta } = createPaginator({ limit, page });

        const {
            search,
            role,
            status,
            dateFrom,
            dateTo,
            orderBy,
            orderDirection,
            approvalStatus
        } = filter;

        const where: Prisma.UserWhereInput = {
            /** Filter by role */
            ...(role && { role }),

            /** Filter by status */
            ...(status && { status }),

            /** Filter by approval status */
            ...(approvalStatus && { approvalStatus }),
            ...(search && buildSearchQuery(search, [
                'email',
                'firstName',
                'lastName'
            ])),

            /** Creation date range */
            ...((dateFrom || dateTo) && {
                createdAt: {
                    ...(dateFrom && { gte: dateFrom }),
                    ...(dateTo && { lte: dateTo }),
                },
            }),

        };

        const [users, total] = await Promise.all([

            prisma.user.findMany({
                where,
                skip: params.skip,
                take: params.limit,
                orderBy: {
                    [orderBy]: orderDirection
                },
                select: this.select,
            }),

            prisma.user.count({ where }),

        ]);

        return {
            data: users,
            meta: buildMeta(total),
        };

    }

    /**
     * Retrieves summary statistics for users.
     *
     * This method returns the total number of users, the number of
     * active users, and the number of users waiting for approval.
     *
     * All database queries are executed at the same time using
     * `Promise.all()` to improve performance.
     *
     * @async
     * @returns {Promise<UserMetrics>} An object containing the user statistics.
     */
    async getUserMetrics() {
        const [total, active, pendingApproval] = await Promise.all([
            prisma.user.count(),
            prisma.user.count({ where: { status: UserStatus.ACTIVE } }),
            prisma.user.count({ where: { approvalStatus: UserApprovalStatus.PENDING } }),
        ]);
        return { total, active, pendingApproval };
    }

    /**
     * Updates the status of an existing user.
     *
     * This method performs several validation checks before updating
     * the user. It prevents users from changing their own status,
     * protects Super Admin accounts, and only allows updates for
     * approved users.
     *
     * The new status and role are determined using the user transition
     * rules to ensure that only valid state changes are applied.
     *
     * @async
     * @param {UUIDInput} ctxUserId - The ID of the authenticated user performing the action.
     * @param {UpdateUserStatusInput} input - The target user ID and the new status.
     * @returns {Promise<User>} The updated user with the selected fields.
     * @throws {GraphQLError} If the requested status change is not allowed.
     */
    async changeUserStatus(ctxUserId: UUIDInput, input: UpdateUserStatusInput) {

        const { userId, status } = input;

        ensureNotSelfAction(ctxUserId, userId);

        const user = await prisma.user.findUniqueOrThrow({
            where: { id: userId },
            select: this.select
        });

        ensureNotSelfAction(ctxUserId, userId);
        ensureNotSuperAdmin(user.role);
        ensureApprovedUser(user.approvalStatus);

        const { status: nextStatus, role } = getUserTransition({
            currentRole: user.role,
            status,
        });

        return await prisma.user.update({
            where: { id: userId },
            data: {
                status: nextStatus,
                role,
            },
            select: this.select,
        });
    }

    /**
     * Assigns a new role to an existing user.
     *
     * This method validates the request before updating the user's role.
     * It prevents users from changing their own role, protects Super
     * Admin accounts, ensures the user has been approved, and verifies
     * that the new role is different from the current one.
     *
     * @async
     * @param {UUIDInput} ctxUserId - The ID of the authenticated user performing the action.
     * @param {AssignRoleInput} input - The target user ID and the role to assign.
     * @returns {Promise<User>} The updated user with the selected fields.
     * @throws {GraphQLError} If the role assignment is not allowed.
     */
    async assignRole(ctxUserId: UUIDInput, input: AssignRoleInput) {

        const { userId, role } = input;

        ensureNotSelfAction(ctxUserId, userId);

        const user = await prisma.user.findUniqueOrThrow({
            where: { id: userId },
            select: this.select
        });

        ensureApprovedUser(user.approvalStatus);
        ensureRoleChanged(user.role, role);
        ensureNotSuperAdmin(user.role);

        return await prisma.user.update({
            where: { id: userId },
            data: { role },
            select: this.select,
        });

    }

    /**
     * Approves or rejects a user's account request.
     *
     * This method validates that the user is still waiting for approval
     * and has not been terminated. Based on the requested approval
     * status, it determines the next user status and role using the
     * user transition rules before saving the changes.
     *
     * @async
     * @param {ChangeUserApprovalStatusInput} input - The target user ID and the new approval status.
     * @returns {Promise<User>} The updated user with the selected fields.
     * @throws {GraphQLError} If the approval status change is not allowed.
     */
    async approveRejectUser(input: ChangeUserApprovalStatusInput) {

        const { userId, approvalStatus } = input;

        const user = await prisma.user.findUniqueOrThrow({
            where: { id: userId },
            select: this.select
        });

        ensurePendingApprovalStatus(user.approvalStatus);
        ensureNotTerminated(user.status);

        const { status, role } = getUserTransition({
            currentRole: user.role,
            approvalStatus,
        });

        return await prisma.user.update({
            where: { id: userId },
            data: {
                approvalStatus,
                status,
                role,
            },
            select: this.select,
        });

    }

}

export const userService = new UserService();
