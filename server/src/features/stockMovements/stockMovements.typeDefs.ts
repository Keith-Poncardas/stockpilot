export const stockMovementsTypeDefs = `#graphql

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

    # Sort direction — lowercase to match Prisma's expected values
    enum OrderDirectionLower {
        asc
        desc
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

    # Lightweight product summary embedded inside a StockMovement record
    type StockMovementProduct {
        id: ID!
        sku: String!
        name: String!
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
        deletedAt: String
        product: StockMovementProduct!
        user: User!
    }

    # Paginated stock movements list response
    type PaginatedStockMovements {
        data: [StockMovement!]!
        meta: Pagination!
    }

    # Dashboard-level aggregated metrics for stock movements
    type StockMovementDashboardMetrics {
        # Total quantity from all IN movements
        totalStockIn: Int!
        # Total quantity from all OUT movements
        totalStockOut: Int!
        # Total quantity from all ADJUSTMENT movements
        totalStockAdjustments: Int!
        # Number of inventory records where quantityOnHand <= reorderLevel
        lowStockProducts: Int!
    }

    # Filter + sort options for the stock movements list
    input FilterStockMovementsInput {
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

        # Sorting (defaults: createdAt desc)
        orderBy: StockMovementOrderBy
        orderDirection: OrderDirectionLower
    }

    # Paginated stock movements input — wraps pagination + filter into a single arg
    input PaginatedStockMovementsInput {
        page: Int!
        limit: Int!
        filter: FilterStockMovementsInput!
    }

    type Query {

        # Paginated + filtered stock movements list
        getAllStockMovements(args: PaginatedStockMovementsInput!): PaginatedStockMovements!

        # Aggregated dashboard metrics for the stock movements feature
        getStockMovementDashboardMetrics: StockMovementDashboardMetrics!
    }

`;
