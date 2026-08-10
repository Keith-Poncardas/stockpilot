/**
 * Shared sort direction enum.
 * Used across all features that support ASC / DESC ordering.
 */
export enum OrderDirection {
    ASC = "ASC",
    DESC = "DESC"
}

/**
 * Lowercase variant — used where Prisma / DB expects "asc" | "desc"
 */
export enum OrderDirectionLower {
    ASC = "asc",
    DESC = "desc"
}

/**
 * Enum for sort order.
 */
export enum SortOrder {
    HIGH = "HIGH",
    LOW = "LOW"
}
