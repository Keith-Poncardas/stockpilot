/**
 * Excludes one or more enum values from the enum object.
  */
export function excludeEnumValue<
    T extends Record<string, string>,
    V extends T[keyof T]
>(
    enumObj: T,
    excludedValue: V | V[]
) {
    const excludedArray = Array.isArray(excludedValue) ? excludedValue : [excludedValue];
    return Object.values(enumObj).filter(
        (value) => !excludedArray.includes(value as V)
    ) as [T[keyof T], ...T[keyof T][]];
}
