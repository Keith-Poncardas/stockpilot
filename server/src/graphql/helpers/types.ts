import { GraphQLContext } from "@/types";

export type Resolver<TArgs = any, TResult = any, TParent = any> = (
    parent: TParent,
    args: TArgs,
    context: GraphQLContext,
    info: unknown
) => Promise<TResult> | TResult;