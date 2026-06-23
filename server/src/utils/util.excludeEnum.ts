/**
 * Excludes a specific enum value from the enum object.
  */
export function excludeEnumValue<
    T extends Record<string, string>,
    V extends T[keyof T]
>(
    enumObj: T,
    excludedValue: V
) {
    return Object.values(enumObj).filter(
        (value) => value !== excludedValue
    ) as [T[keyof T], ...T[keyof T][]];
}
