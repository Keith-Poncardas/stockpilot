import z, { ZodType } from "zod";
import { throwBadInput } from "@/utils";
import { Resolver } from "./types";

/**
 * Creates a GraphQL validation middleware using a Zod schema.
 *
 * This middleware validates the resolver arguments before the
 * resolver is executed. If validation fails, a GraphQL error
 * is thrown and the resolver is not called.
 *
 * By default, the middleware automatically detects the value
 * to validate (`input`, `args`, or the resolver arguments).
 * A custom selector can be provided when validation should
 * target a different value.
 *
 * @template T
 * @param {ZodType<T>} schema - The Zod schema used to validate the input.
 * @param {(args: any) => unknown} [selector] - Optional function that selects the value to validate.
 * @returns {(resolver: Resolver) => Resolver} A resolver middleware that validates the input before execution.
 */
export function validate<T>(
    schema: ZodType<T>,
    selector?: (args: any) => unknown
) {
    return (resolver: Resolver): Resolver => {
        return async (parent, args, context, info) => {
            const target = selector
                ? selector(args)
                : (args?.input ??
                    args?.args ??
                    (args && typeof args === "object" && Object.keys(args).length === 1
                        ? Object.values(args)[0]
                        : args));

            const result = schema.safeParse(target);

            if (!result.success) {
                throwBadInput("Validation failed", {
                    validation: z.flattenError(result.error),
                });
            }

            return resolver(parent, args, context, info);
        };
    };
}
