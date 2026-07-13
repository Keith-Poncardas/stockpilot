export const inventoryTypeDefs = `#graphql

    # ─── Enums ───────────────────────────────────────────────────────────────

    # Stock status filter — maps to the column-to-column comparison logic in getStatuses()
    enum StockStatus {
        ALL
        WELL_STOCKED
        LOW_STOCK
        CRITICAL_OUT
    }

    enum StockStatusCustom {
        WELL_STOCKED
        LOW_STOCK
        CRITICAL_OUT
    }

    # Movement type — mirrors the Prisma MovementType enum
    enum MovementType {
        IN
        OUT
        ADJUSTMENT
    }

    # Sortable columns for inventory list queries
    enum InventoryOrderBy {
        quantityOnHand
        reorderLevel
        updatedAt
    }

    # Sort direction
    enum OrderDirection {
        asc
        desc
    }

    # ─── Types ────────────────────────────────────────────────────────────────

    # Lightweight product summary embedded inside an Inventory record
    type InventoryProduct {
        id: ID!
        sku: String!
        name: String!
        description: String
        unitPrice: Float!
        costPrice: Float
        isActive: Boolean!
    }

    # Core inventory record (single item)
    type Inventory {
        id: ID!
        productId: ID!
        quantityOnHand: Int!
        reorderLevel: Int!
        maxStock: Int!
        updatedAt: String!
        product: InventoryProduct!
        # Computed by the server — reflects WELL_STOCKED / LOW_STOCK / CRITICAL_OUT
        stockStatus: StockStatusCustom!
    }

    # Counts grouped by stock status — returned by getInventoryStatuses
    type InventoryStatuses {
        wellStocked: Int!
        lowStock: Int!
        criticalOut: Int!
        belowReorderLevel: Int!
    }

    # Pagination metadata (shared shape across features)
    type Pagination {
        page: Int!
        limit: Int!
        firstItem: Int!
        lastItem: Int!
        totalItems: Int!
        totalPages: Int!
        hasPreviousPage: Boolean!
        hasNextPage: Boolean!
    }

    # Paginated inventory list response
    type PaginatedInventories {
        data: [Inventory!]!
        meta: Pagination!
    }

    # ─── Inputs ───────────────────────────────────────────────────────────────

    # Filter + sort options for the inventory list
    input InventoryFilterInput {
        # Full-text search against linked product name or SKU
        search: String

        # Stock status bucket (defaults to ALL)
        stockStatus: StockStatus

        # Quantity-on-hand range filters
        minQty: Int
        maxQty: Int

        # Reorder-level range filters
        minReorderLevel: Int
        maxReorderLevel: Int

        # Sorting (defaults: updatedAt DESC)
        orderBy: InventoryOrderBy
        orderDirection: OrderDirection
    }

    # Combined pagination + filter input for the inventory list query
    # Matches the shape expected by paginatedInventoriesSchema: { page, limit, filter }
    input GetInventoriesInput {
        page: Int
        limit: Int
        filter: InventoryFilterInput
    }

    # Adjust stock quantity (IN / OUT / ADJUSTMENT) and optionally update reorder level.
    # Args are passed inline — the resolver receives the full args object as AdjustStockInput.
    input AdjustStockInput {
        inventoryId: ID!
        movementType: MovementType
        quantity: Int!
        # Required — must match the nonnegative() constraint in adjustStockSchema
        reorderLevel: Int!
        maxStock: Int!
        reference: String
        notes: String
    }

    # ─── Queries & Mutations ──────────────────────────────────────────────────

    type Query {
        # Count of inventory items grouped by stock status
        getInventoryStatuses: InventoryStatuses!

        # Single inventory record by ID.
        # Receives a plain ID arg — resolver passes it directly to inventoryIdSchema.parse()
        getInventory(inventoryId: ID!): Inventory!

        # Paginated + filtered inventory list.
        # Uses a single combined input to match paginatedInventoriesSchema shape { page, limit, filter }
        getInventories(input: GetInventoriesInput): PaginatedInventories!
    }

    type Mutation {
        # Adjust stock quantity (creates a StockMovement record automatically).
        adjustStock(input: AdjustStockInput!): Inventory!
    }

`;
