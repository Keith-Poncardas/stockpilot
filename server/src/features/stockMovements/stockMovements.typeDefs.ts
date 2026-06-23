export const stockMovementsTypeDefs = `#graphql

    # ─── Enums ───────────────────────────────────────────────────────────────

    # Movement type — mirrors the Prisma MovementType enum
    enum MovementType {
        IN
        OUT
        ADJUSTMENT
    }

    # Sortable columns for stock movement list queries
    enum StockMovementOrderBy {
        createdAt
        quantity
    }

    # Sort direction
    enum OrderDirection {
        ASC
        DESC
    }

    # ─── Types ────────────────────────────────────────────────────────────────

    # Lightweight product summary embedded inside a StockMovement record
    type StockMovementProduct {
        id: ID!
        sku: String!
        name: String!
    }

    # Lightweight user summary embedded inside a StockMovement record
    type StockMovementUser {
        id: ID!
        firstName: String!
        lastName: String!
    }

    # Core stock movement record
    type StockMovement {
        id: ID!
        productId: ID!
        userId: ID!
        type: MovementType!
        quantity: Int!
        reference: String
        notes: String
        createdAt: String!
        updatedAt: String!
        deletedAt: String
        product: StockMovementProduct!
        user: StockMovementUser!
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

    # Paginated stock movements list response
    type PaginatedStockMovements {
        data: [StockMovement!]!
        meta: Pagination!
    }

    # ─── Inputs ───────────────────────────────────────────────────────────────

    # Pagination input (shared shape across features)
    input PaginationInput {
        page: Int!
        limit: Int!
    }

    # Get a single stock movement by ID
    input GetMovementDetailsInput {
        id: ID!
    }

    # Filter + sort options for the stock movements list
    input GetAllStockMovementsInput {
        # Full-text search against linked product name or SKU
        search: String

        # Filter by movement type
        movementType: MovementType

        # Filter by a specific product
        productId: ID

        # Filter by the user who performed the movement
        userId: ID

        # Quantity range filters
        minQty: Int
        maxQty: Int

        # Date range filters (ISO 8601 strings)
        dateFrom: String
        dateTo: String

        # Sorting (defaults: createdAt DESC)
        orderBy: StockMovementOrderBy
        orderDirection: OrderDirection
    }

    # Record a new stock movement
    input RecordMovementInput {
        productId: ID!
        userId: ID!
        type: MovementType!
        quantity: Int!
        reference: String
        notes: String
        reorderLevel: Int
    }

    # Soft-delete / restore input
    input StockMovementIdInput {
        id: ID!
    }

    # ─── Queries & Mutations ──────────────────────────────────────────────────

    type Query {
        # Get a single stock movement by ID (includes product & user)
        getMovementDetails(input: GetMovementDetailsInput!): StockMovement!

        # Paginated + filtered stock movements list
        getAllStockMovements(pagination: PaginationInput, filter: GetAllStockMovementsInput): PaginatedStockMovements!
    }

    type Mutation {
        # Record a new stock movement and update the linked inventory
        recordMovement(input: RecordMovementInput!): StockMovement!

        # Soft-delete a stock movement
        softDeleteStockMovement(input: StockMovementIdInput!): StockMovement!

        # Restore a soft-deleted stock movement
        restoreStockMovement(input: StockMovementIdInput!): StockMovement!
    }

`;
