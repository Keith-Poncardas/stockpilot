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

    # Reason for a stock adjustment — mirrors StockMovementReason in client/src/constants/enums.ts
    enum StockMovementReason {
        SALE
        PURCHASE
        ADJUSTMENT
        RETURN
        DAMAGE
        EXPIRED
        TRANSFER
        INITIAL_STOCK
    }

    # ─── Types ────────────────────────────────────────────────────────────────

    # Lightweight product for inventory search popup
    type ProductSearchRecord {
        id: ID!
        sku: String!
        name: String!
        description: String
        unitPrice: Float!
        costPrice: Float
        status: ProductStatus!
        isAddedInventory: Boolean!
    }

    # Infinite-scroll metadata — mirrors InfiniteScrollMeta in utils.infiniteScroll.ts
    type InfiniteScrollMeta {
        # Cursor to pass on the next request to load the following page. Null when no more pages.
        nextCursor: String
        # True when there are more items beyond this batch.
        hasNextPage: Boolean!
    }

    # Infinite-scroll result wrapping ProductSearchRecord items
    type InfiniteProductSearchResult {
        data: [ProductSearchRecord!]!
        meta: InfiniteScrollMeta!
    }

    # Lightweight product summary embedded inside an Inventory record
    type InventoryProduct {
        id: ID!
        sku: String!
        name: String!
        description: String
        unitPrice: Float!
        costPrice: Float
        status: ProductStatus!
    }

    # Author (user) who last touched this inventory record
    type InventoryAuthor {
        id: ID!
        firstName: String!
        lastName: String!
        email: String!
        role: UserRole!
    }

    # Core inventory record (single item)
    type Inventory {
        id: ID!
        productId: ID!
        quantityOnHand: Int!
        reorderLevel: Int!
        maxStock: Int!
        updatedAt: String!
        createdAt: String!
        product: InventoryProduct!
        author: InventoryAuthor!
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
        # Reason code saved to the audit log — validated against StockMovementReason enum
        reason: StockMovementReason
        notes: String
    }

    # Create a new inventory record for a product (initial stock-in)
    input CreateInventoryInput {
        productId: ID!
        quantityOnHand: Int!
        reorderLevel: Int!
        maxStock: Int!
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

        # Search products for inventory addition — cursor-based infinite scroll.
        # Omit cursor to load the first page; pass meta.nextCursor to load subsequent pages.
        searchInventoryProducts(search: String, cursor: String, limit: Int): InfiniteProductSearchResult!
    }

    type Mutation {
        # Adjust stock quantity (creates a StockMovement record automatically).
        adjustStock(input: AdjustStockInput!): Inventory!

        # Create an initial inventory record for a product.
        createInventory(input: CreateInventoryInput!): Inventory!
    }

`;
