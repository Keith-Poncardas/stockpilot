import { prisma } from "@/lib";
import { createPaginator, generateReadablePassword, smartDelete, throwConflict, throwNotFound } from "@/utils";
import { Prisma, UserApprovalStatus, UserRole, UserStatus } from "@prisma/client";
import { adminCreateUserSchema, AssignRoleInput, assignRoleSchema, ChangeUserApprovalStatusInput, changeUserApprovalStatusSchema, CreateUserInput, EditUserInput, editUserSchema, PaginatedUsersInput, paginatedUsersSchema, UpdateUserStatusInput, updateUserStatusSchema, UserIdInput } from "./user.validation";
import * as argon2 from "argon2";
import { userIdSchema } from "@/schemas";

export class UserService {

    /**
     * Select user model properties
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
     * Get user by ID
     */
    async getUser(userId: UserIdInput) {

        const id = userIdSchema.parse(userId);

        const [user, salesCount, stockEntriesCount] = await Promise.all([
            prisma.user.findUnique({
                where: { id },
                select: this.select
            }),
            prisma.sale.count({
                where: { userId: id },
            }),
            prisma.stockMovement.count({
                where: { userId: id },
            }),

        ]);

        if (!user) throwNotFound("User not found");

        return {
            ...user,
            salesProcessed: salesCount,
            stockMovementProcessed: stockEntriesCount,
        };

    }

    /**
     * Modify user information
     */
    async modifyUser(input: EditUserInput) {

        const { userId, data } = editUserSchema.parse(input);

        const userToUpdate = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!userToUpdate) throwNotFound('User not found');

        const existingUser = await prisma.user.findUnique({
            where: { email: data.email },
        });

        if (existingUser && existingUser.id !== userId) {
            throwConflict('User with that email already exists');
        }

        /** Update user */
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data,
            select: this.select,
        });

        return updatedUser;

    }

    /**
     * Get a paginated list of users with optional filters.
     */
    async getUsers(args: PaginatedUsersInput) {

        const { limit, page, filter } = paginatedUsersSchema.parse(args);

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

            /** Full-text search across key fields */
            ...(search && {
                AND: search.trim().split(/\s+/).map((word) => ({
                    OR: [
                        { email: { contains: word, mode: "insensitive" } },
                        { firstName: { contains: word, mode: "insensitive" } },
                        { lastName: { contains: word, mode: "insensitive" } },
                    ],
                })),
            }),

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
     * Create a new user
     */
    async createUser(input: CreateUserInput) {

        const { email, ...data } = adminCreateUserSchema.parse(input);

        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) throwConflict("User email already exists");

        const genPass = generateReadablePassword();
        const hashedPassword = await argon2.hash(genPass);

        const user = await prisma.user.create({
            data: {
                email,
                passwordHash: hashedPassword,
                ...data,
            },
            select: this.select,
        });

        return {
            ...user,
            password: genPass,
        };

    }

    /**
     * Reset user password
     */
    async resetPassword(userId: UserIdInput) {

        const id = userIdSchema.parse(userId);

        const user = await prisma.user.findUnique({
            where: { id }
        });

        if (!user) throwNotFound("User not found");

        if (user.status === UserStatus.TERMINATED) {
            throwConflict('Cannot reset password for a terminated user');
        };

        const genPass = generateReadablePassword();

        const hashedPassword = await argon2.hash(genPass);

        const updatedUser = await prisma.user.update({
            where: { id },
            data: { passwordHash: hashedPassword },
            select: this.select,
        });

        return {
            ...updatedUser,
            password: genPass,
        };

    }

    /**
     * Change user status
     */
    async changeUserStatus(input: UpdateUserStatusInput) {

        const { userId, status } = updateUserStatusSchema.parse(input);

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: this.select
        });

        if (!user) throwNotFound("User not found");

        if (user.approvalStatus !== UserApprovalStatus.APPROVED) {
            throwConflict(`Cannot change status of an unapproved user`);
        }

        if (user.status === status) {
            throwConflict(`User is already ${status}`);
        };

        if (user.role === UserRole.SUPER_ADMIN) {
            throwConflict(`Cannot change status of ${UserRole.SUPER_ADMIN} user`);
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { status },
            select: this.select,
        });

        return updatedUser;

    }

    /**
     * Assign user role
     */
    async assignRole(input: AssignRoleInput) {

        const { userId, role } = assignRoleSchema.parse(input);

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: this.select
        });

        if (!user) throwNotFound("User not found");

        if (user.approvalStatus !== UserApprovalStatus.APPROVED) {
            throwConflict(`Cannot assign role to an unapproved user`);
        }

        if (user.role === role) {
            throwConflict(`User already has the role ${role}`);
        };

        if (user.role === UserRole.SUPER_ADMIN) {
            throwConflict(`Cannot change role of ${UserRole.SUPER_ADMIN} user`);
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { role },
            select: this.select,
        });

        return updatedUser;

    }

    /**
     * Change user approval status
     */
    async approveRejectUser(input: ChangeUserApprovalStatusInput) {

        const { userId, approvalStatus } = changeUserApprovalStatusSchema.parse(input);

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: this.select
        });

        if (!user) throwNotFound("User not found");

        if (
            user.approvalStatus === UserApprovalStatus.APPROVED ||
            user.approvalStatus === UserApprovalStatus.REJECTED
        ) {
            throwConflict(`Cannot change the approval status of an ${user.approvalStatus} user`);
        };

        if (user.status === UserStatus.TERMINATED) {
            throwConflict(
                'Cannot change the approval status of a terminated user'
            );
        };

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                approvalStatus: approvalStatus,
                status: approvalStatus === UserApprovalStatus.APPROVED ? UserStatus.ACTIVE : UserStatus.TERMINATED
            },
            select: this.select,
        });

        return updatedUser;

    }

    /**
     * Permanently hard-deletes a user account.
     *
     * This is only safe when the user has NO business history (no sales processed,
     * no stock movements recorded) — i.e. an employee who was created by mistake
     * or never acted on the system (backout scenario).
     *
     * If the user has any history, a CONFLICT error is thrown. The caller should
     * instead use `changeUserStatus` to set the status to TERMINATED.
     */
    async deleteUser(userId: UserIdInput) {

        const id = userIdSchema.parse(userId);

        // Guard: existence check
        const user = await prisma.user.findUnique({
            where: { id },
            select: this.select,
        });

        if (!user) throwNotFound('User not found');

        if (user.role === UserRole.SUPER_ADMIN) {
            throwConflict(`Cannot delete ${UserRole.SUPER_ADMIN} user`);
        }

        return smartDelete({
            id,
            historyChecks: [
                {
                    label: 'sales',
                    count: (id) => prisma.sale.count({ where: { userId: id } }),
                },
                {
                    label: 'stockMovements',
                    count: (id) => prisma.stockMovement.count({ where: { userId: id } }),
                },
            ],
            softDelete: {
                execute: (id) =>
                    prisma.user.update({
                        where: { id },
                        data: { status: UserStatus.TERMINATED },
                    }).then(() => void 0),
            },
            hardDelete: {
                execute: async (tx, id) => {
                    await tx.user.delete({ where: { id } });
                },
            },
        });

    }

}

export const userService = new UserService();
