import { GraphQLContext } from "@/types";

/**
 * Represents a GraphQL resolver function.
 *
 * A resolver receives the parent object, the resolver arguments,
 * the GraphQL context, and information about the current query.
 * It can return either a value directly or a Promise for
 * asynchronous operations.
 *
 * @template TArgs The type of the resolver arguments.
 * @template TResult The type of the value returned by the resolver.
 * @template TParent The type of the parent object.
 */
export type Resolver<TArgs = any, TResult = any, TParent = any> = (
    parent: TParent,
    args: TArgs,
    context: GraphQLContext,
    info: unknown
) => Promise<TResult> | TResult;