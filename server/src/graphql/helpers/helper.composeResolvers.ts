/**
 * Composes multiple resolver wrappers into a single wrapper.
 *
 * Wrappers are applied from right to left, so the last wrapper
 * provided is executed first. This follows the same behavior as
 * function composition.
 *
 * This utility makes it easy to combine reusable resolver
 * middleware, such as validation, authentication, authorization,
 * logging, and error handling.
 *
 * @template T
 * @param {...Array<(input: any) => any>} wrappers - The resolver wrappers to compose.
 * @returns {(input: T) => T} A function that applies all wrappers to the input.
 *
 * @example
 * const wrappedResolver = composeResolvers(
 *   authorize("ADMIN"),
 *   validate(userSchema)
 * )(resolver);
 *
 * // Execution order:
 * // validate -> authorize -> resolver
 */
export function composeResolvers(
    ...wrappers: Array<(input: any) => any>
) {
    return <T>(input: T): T => {
        return wrappers.reduceRight((acc, wrapper) => wrapper(acc), input);
    };
}