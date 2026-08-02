import { UUIDInput, uuidSchema } from "@/schemas";
import { userService } from "./user.service";
import {
    AssignRoleInput,
    assignRoleSchema,
    ChangeUserApprovalStatusInput,
    changeUserApprovalStatusSchema,
    PaginatedUsersInput,
    paginatedUsersSchema,
    UpdateUserStatusInput,
    updateUserStatusSchema,
} from "./user.validation";
import { protectResolvers, resolver, validate } from "@/graphql/helpers";
import { GraphQLContext } from "@/types";
import { User } from "@prisma/client";
import { stockMovementsService } from "../stockMovements";
import { saleService } from "../sale";

export const userResolver = {

    Query: protectResolvers(resolver({

        /**
         * Get user by id
         */
        getUser: validate(
            uuidSchema,
            (args) => args.userId
        )(async (_: unknown, { userId }: { userId: UUIDInput }) => {
            return userService.getUser(userId);
        }),

        /**
         * Get all users (pagination, filter)
         */
        getUsers: validate(
            paginatedUsersSchema,
            (args) => args.args
        )(async (_: unknown, { args }: { args: PaginatedUsersInput }) => {
            return userService.getUsers(args);
        }),

        /**
         * Get user metrics (Total, Active, Pending Approval)
         */
        getUserMetrics: async () => {
            return userService.getUserMetrics();
        },

    })),

    User: resolver({

        /**
         * Get sales processed count for a user
         */
        salesProcessedCount: async (user: User) => {
            return stockMovementsService.stockMovementCount({
                userId: user.id
            });
        },

        /**
         * Get sales processed count for a user
         */
        stockMovementsProcessedCount: async (user: User) => {
            return saleService.saleCount({ userId: user.id });
        },

    }),

    Mutation: protectResolvers(resolver({

        /**
         * Change user status
         */
        changeUserStatus: validate(updateUserStatusSchema)(async (
            _: unknown,
            { input }: { input: UpdateUserStatusInput },
            ctx: GraphQLContext
        ) => {
            return userService.changeUserStatus(ctx.user!.id, input);
        }),

        /**
         * Approve or reject user
         */
        approveRejectUser: validate(changeUserApprovalStatusSchema)(async (
            _: unknown,
            { input }: { input: ChangeUserApprovalStatusInput }
        ) => {
            return userService.approveRejectUser(input);
        }),

        /**
         * Assign user role
         */
        assignRole: validate(assignRoleSchema)(async (
            _: unknown,
            { input }: { input: AssignRoleInput },
            ctx: GraphQLContext
        ) => {
            return userService.assignRole(ctx.user!.id, input);
        })

    }))

};