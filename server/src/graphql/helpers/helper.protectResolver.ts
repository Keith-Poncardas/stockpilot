import { GraphQLContext } from "@/types";
import { requireValidUserAccess } from "@/utils";

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