/**
 * Stock status filter for inventory queries.
 * Maps to the column-to-column SQL comparison logic in InventoryService.getStatuses()
 */
export enum StockStatus {
    ALL = "ALL",
    WELL_STOCKED = "WELL_STOCKED",
    LOW_STOCK = "LOW_STOCK",
    CRITICAL_OUT = "CRITICAL_OUT"
}

/**
 * Sortable columns for inventory list queries.
 * Values map to Prisma field names (camelCase) used in orderBy clauses.
 */
export enum InventoryOrderBy {
    QUANTITY_ON_HAND = "quantityOnHand",
    REORDER_LEVEL = "reorderLevel",
    UPDATED_AT = "updatedAt"
}
