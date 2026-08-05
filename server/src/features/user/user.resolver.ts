import { UUIDInput, uuidSchema } from "@/schemas";
import { userService } from "./user.service";
import {
    assignRoleSchema,
    changeUserApprovalStatusSchema,
    paginatedUsersSchema,
    updateUserStatusSchema,
} from "./user.validation";
import {
    composeResolvers,
    protectResolvers,
    applyErrorHandling,
    validate
} from "@/graphql/helpers";
import { GraphQLContext } from "@/types";
import { User } from "@prisma/client";
import { stockMovementsService } from "../stockMovements";
import { saleService } from "../sale";
import {
    AssignRoleInput,
    ChangeUserApprovalStatusInput,
    PaginatedUsersInput,
    UpdateUserStatusInput
} from "./types";

export const userResolver = {

    Query: composeResolvers(
        protectResolvers,
        applyErrorHandling
    )({

        /**
         * Retrieves a single user by their unique ID.
         *
         * This resolver validates the user ID before calling the
         * service layer. If the ID is valid, it returns the
         * requested user.
         */
        getUser: composeResolvers(
            validate(uuidSchema)
        )(async (_: unknown, { userId }: { userId: UUIDInput }) => {
            return userService.getUser({ id: userId });
        }),

        /**
         * Retrieves a paginated list of users.
         *
         * This resolver validates the request arguments before
         * calling the service layer. It returns a paginated list
         * of users based on the provided filters, sorting, and
         * pagination options.
         */
        getUsers: composeResolvers(
            validate(paginatedUsersSchema)
        )(async (_: unknown, { args }: { args: PaginatedUsersInput }) => {
            return userService.getUsers(args);
        }),

        /**
         * Retrieves summary statistics for users.
         *
         * This resolver calls the service layer to return
         * user metrics such as the total number of users,
         * active users, and pending approvals.
         */
        getUserMetrics: async () => {
            return userService.getUserMetrics();
        },

    }),

    User: applyErrorHandling({

        /**
         * Retrieves the number of stock movements processed by a user.
         *
         * This field resolver calls the service layer to return
         * the count of stock movements processed by the specific user.
         */
        stockMovementsCount: async (user: User) => {
            return stockMovementsService.stockMovementCount({
                userId: user.id
            });
        },

        /**
         * Retrieves the number of sales processed by a user.
         *
         * This field resolver calls the service layer to return
         * the count of sales processed by the specific user.
         */
        salesCount: async (user: User) => {
            return saleService.saleCount({ userId: user.id });
        },

    }),

    Mutation: composeResolvers(
        protectResolvers,
        applyErrorHandling
    )({

        /**
         * Updates the status of an existing user.
         *
         * This resolver validates the input arguments and then
         * calls the service layer to update the user's status.
         * It ensures that only valid status transitions are allowed.
         */
        changeUserStatus: composeResolvers(
            validate(updateUserStatusSchema)
        )(async (
            _: unknown,
            { input }: { input: UpdateUserStatusInput },
            ctx: GraphQLContext
        ) => {
            return userService.changeUserStatus(ctx.user!.id, input);
        }),

        /**
         * Approves or rejects a user's account.
         *
         * This resolver validates the input arguments and then
         * calls the service layer to update the user's approval status.
         * Only users with PENDING approval status can be processed.
         */
        approveRejectUser: composeResolvers(
            validate(changeUserApprovalStatusSchema)
        )(async (
            _: unknown,
            { input }: { input: ChangeUserApprovalStatusInput }
        ) => {
            return userService.approveRejectUser(input);
        }),

        /**
         * Assigns a new role to a specific user.
         *
         * This resolver validates the input arguments and then
         * calls the service layer to update the user's role.
         * The caller must have SUPER_ADMIN or ADMIN role.
         */
        assignRole: composeResolvers(
            validate(assignRoleSchema)
        )(async (
            _: unknown,
            { input }: { input: AssignRoleInput },
            ctx: GraphQLContext
        ) => {
            return userService.assignRole(ctx.user!.id, input);
        })

    })

};