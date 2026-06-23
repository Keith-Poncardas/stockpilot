import { UUIDInput } from "@/schemas";
import { userService } from "./user.service";
import { CreateUserInput, EditUserInput, PaginatedUsersInput, UpdateUserStatusInput } from "./user.validation";
import { protectResolvers } from "@/graphql/helpers";

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

    }),

    Mutation: protectResolvers({

        /**
         * Create new user
         */
        createUser: async (_: unknown, { input }: { input: CreateUserInput }) => {
            return userService.createUser(input);
        },

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
            { input }: { input: UpdateUserStatusInput }
        ) => {
            return userService.changeUserStatus(input);
        },

        /**
         * Delete user
         */
        deleteUser: async (_: unknown, { userId }: { userId: UUIDInput }) => {
            return userService.deleteUser(userId);
        }

    })

}