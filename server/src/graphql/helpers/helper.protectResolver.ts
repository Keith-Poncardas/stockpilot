import { GraphQLContext } from "@/types";
import { requireValidUserAccess } from "@/utils";

/**
 * Wraps all resolvers in an object with authentication and authorization checks.
 *
 * This helper iterates over all provided resolvers and wraps each one in an
 * authentication middleware. The middleware ensures that the request has a valid,
 * active, and approved user before executing the original resolver.
 *
 * This approach centralizes security logic and ensures that all resolvers
 * are protected by default without modifying each resolver individually.
 *
 * @template T - The type of the resolvers object.
 * @param {T} resolvers - An object containing the GraphQL resolvers to protect.
 * @returns {T} A new object with all resolvers wrapped in authentication middleware.
 */
export function protectResolvers<T extends Record<string, any>>(
    resolvers: T
): T {
    const protectedResolvers = {} as T;

    for (const key in resolvers) {
        const resolver = resolvers[key];

        protectedResolvers[key] = (async (
            parent: unknown,
            args: unknown,
            ctx: GraphQLContext,
            info: unknown
        ) => {

            /** Use reusable logic to check role and status */
            requireValidUserAccess(ctx.user!);

            return resolver(parent, args, ctx, info);
        }) as T[typeof key];
    }

    return protectedResolvers;
}