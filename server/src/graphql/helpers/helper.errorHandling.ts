import { mapPrismaError } from "./helper.prismaError";
import { Resolver } from "./types";

/**
 * Wraps GraphQL resolvers with centralized error handling.
 *
 * This utility automatically catches errors thrown by resolvers
 * and converts supported Prisma errors into application-specific
 * GraphQL errors using `mapPrismaError()`.
 *
 * It can wrap:
 * - A single resolver function.
 * - An object containing multiple resolvers.
 *
 * This keeps resolver implementations clean by removing the need
 * to add `try...catch` blocks to every resolver.
 *
 * @template TArgs
 * @template TResult
 * @template TParent
 * @param {Resolver<TArgs, TResult, TParent>} fn - The resolver function to wrap.
 * @returns {Resolver<TArgs, TResult, TParent>} The wrapped resolver.
 */
export function applyErrorHandling<TArgs = any, TResult = any, TParent = any>(
    fn: Resolver<TArgs, TResult, TParent>
): Resolver<TArgs, TResult, TParent>;

/**
 * Wraps every resolver function in an object with centralized
 * error handling.
 *
 * Non-function properties are returned unchanged.
 *
 * @template T
 * @param {T} resolversObj - An object containing resolver functions.
 * @returns {T} A new object with wrapped resolvers.
 */
export function applyErrorHandling<T extends Record<string, any>>(resolversObj: T): T;

export function applyErrorHandling(input: any): any {
    if (typeof input === "function") {
        return async (parent: any, args: any, context: any, info: any) => {
            try {
                return await input(parent, args, context, info);
            } catch (error) {
                throw mapPrismaError(error);
            }
        };
    }

    if (input && typeof input === "object") {
        const wrapped = {} as any;

        for (const key in input) {
            const val = input[key];

            if (typeof val === "function") {
                wrapped[key] = applyErrorHandling(val);
            } else {
                wrapped[key] = val;
            }
        }

        return wrapped;
    }

    return input;
}
