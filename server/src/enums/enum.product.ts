/**
 * Product active/inactive status filter.
 */
export enum ProductStatus {
    ALL = "ALL",
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE"
}

/**
 * Sortable columns for product list queries.
 * Values map to Prisma field names (camelCase).
 */
export enum ProductOrderBy {
    CREATED_AT = "createdAt",
    NAME = "name",
    UNIT_PRICE = "unitPrice"
}
