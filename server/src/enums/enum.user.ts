/**
 * Sortable columns for user list queries.
 * Values map to Prisma field names (camelCase).
 */
export enum UserOrderBy {
    FIRST_NAME = "firstName",
    LAST_NAME = "lastName",
    EMAIL = "email",
    CREATED_AT = "createdAt"
}

/**
 * Sort direction for user queries.
 * Lowercase to match Prisma's expected "asc" | "desc" values.
 */
export enum UserOrderDirection {
    ASC = "asc",
    DESC = "desc"
}
