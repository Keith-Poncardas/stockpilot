import { UUIDInput } from "@/schemas";
import { userService } from "./user.service";
import { AssignRoleInput, ChangeUserApprovalStatusInput, EditUserInput, PaginatedUsersInput, UpdateUserStatusInput, UserIdInput } from "./user.validation";
import { protectResolvers } from "@/graphql/helpers";
import { GraphQLContext } from "@/types";

export const userResolver = {

    Query: protectResolvers({

        /**
         * Get user by id
         */
        getUser: async (_: unknown, { userId }: { userId: UUIDInput }) => {
            return userService.getUser(userId);
        },

        /**
         * Get all users (pagination, filter)
         */
        getUsers: async (_: unknown, { args }: { args: PaginatedUsersInput }) => {
            return userService.getUsers(args);
        },

        /**
         * Get user metrics (Total, Active, Pending Approval)
         */
        getUserMetrics: async () => {
            return userService.getUserMetrics();
        },

    }),

    Mutation: protectResolvers({

        /**
         * Reset user password
         */
        resetPassword: async (_: unknown, { userId }: { userId: UUIDInput }) => {
            return userService.resetPassword(userId);
        },

        /**
         * Modify user (role, approve, etc)
         */
        modifyUser: async (_: unknown, { input }: { input: EditUserInput }) => {
            return userService.modifyUser(input);
        },

        /**
         * Change user status
         */
        changeUserStatus: async (
            _: unknown,
            { input }: { input: UpdateUserStatusInput },
            ctx: GraphQLContext
        ) => {
            return userService.changeUserStatus(ctx.user!.id, input);
        },

        /**
         * Approve or reject user
         */
        approveRejectUser: async (
            _: unknown,
            { input }: { input: ChangeUserApprovalStatusInput }
        ) => {
            return userService.approveRejectUser(input);
        },

        /**
         * Assign user role
         */
        assignRole: async (
            _: unknown,
            { input }: { input: AssignRoleInput },
            ctx: GraphQLContext
        ) => {
            return userService.assignRole(ctx.user!.id, input);
        },

        /**
         * Delete user
         */
        deleteUser: async (_: unknown, { userId }: { userId: UserIdInput }) => {
            return userService.deleteUser(userId);
        }

    })

}