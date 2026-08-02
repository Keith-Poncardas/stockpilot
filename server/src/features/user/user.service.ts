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
import {
    AssignRoleInput,
    ChangeUserApprovalStatusInput,
    PaginatedUsersInput,
    UpdateUserStatusInput
} from "./user.validation";
import { UUIDInput } from "@/schemas";
import { ensureApprovedUser, ensureNotSelfAction, ensureNotSuperAdmin, ensureNotTerminated, ensurePendingApprovalStatus, ensureRoleChanged, getUserTransition } from "./user.utils";

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
    async getUser(userId: UUIDInput) {
        return await prisma.user.findUniqueOrThrow({
            where: { id: userId },
            select: this.select
        })
    }

    /**
     * Get a paginated list of users with optional filters.
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

            /** Full-text search across key fields */
            ...(search && buildSearchQuery(search, ['email', 'firstName', 'lastName'])),

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
     * Get user metrics (Total, Active, Pending Approval)
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
     * Change user status
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
     * Assign user role
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
     * Change user approval status
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
