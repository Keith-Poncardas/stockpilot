/**
 * Creates a new object omitting the specified properties from the original object.
 *
 * This utility function takes an object and an array of keys to exclude.
 * It returns a new copy of the object without mutating the original,
 * excluding the specified properties. Useful for removing sensitive data.
 *
 * @param {T} obj - The original object.
 * @param {K[]} keys - An array of property names to remove.
 * @returns {Omit<T, K>} A new object with the specified properties omitted.
 */
export function omit<T extends Record<string, any>, K extends keyof T>(
    obj: T,
    keys: K[]
): Omit<T, K> {
    const result = { ...obj };
    keys.forEach((key) => {
        delete result[key];
    });
    return result;
}
