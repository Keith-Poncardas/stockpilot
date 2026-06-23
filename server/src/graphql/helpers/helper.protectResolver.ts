import { GraphQLContext } from "@/types";
import { throwUnauthorized } from "@/utils";

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

            /** Check if user is authorized */
            if (!ctx.user) throwUnauthorized();

            return resolver(parent, args, ctx, info);
        }) as T[typeof key];
    }

    return protectedResolvers;
}