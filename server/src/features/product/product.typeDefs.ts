export const productTypeDefs = `#graphql

    # Product Type
    type Product {
        id: ID!
        sku: String!
        name: String!
        description: String
        unitPrice: Float!
        costPrice: Float
        status: ProductStatus!
        createdAt: String!
        updatedAt: String!
    }

    # Product Info Type
    type ProductInfo {
        id: ID!
        sku: String!
        name: String!
        description: String
        unitPrice: Float!
        costPrice: Float
        grossMargin: Float
        status: ProductStatus!
        createdAt: String!
        updatedAt: String!
    }

    # Inventory Status Type
    type InventoryStatus {
        id: ID!
        quantityOnHand: Int!
        reorderLevel: Int!
        maxStock: Int!
        lastRestockDate: String
        estimatedDaysOfStock: Int!
    }

    # Sales Summary Type
    type SalesSummary {
        unitsSoldMonth: Int!
        revenueMonth: Float!
        avgSalePerDay: Float!
        transactions: Int!
        avgPerSale: Float!
        sellThroughRate: Float!
    }

    # Sales Trend Point Type
    type SalesTrendPoint {
        date: String!
        label: String!
        unitsSold: Int!
        isToday: Boolean!
    }

    # A single row in the stock movement ledger for a product
    type StockMovementLedgerItem {
        id: ID!
        # IN | OUT | ADJUSTMENT
        type: MovementType!
        # Human-readable description (reason code + notes, or type label fallback)
        description: String!
        # Optional PO / reference number
        reference: String
        # ISO-8601 timestamp
        date: String!
        # Signed quantity: negative for OUT movements
        quantity: Int!
    }

    # Product Details Type
    type ProductDetails {
        productInfo: ProductInfo!
        inventoryStatus: InventoryStatus
        salesSummary: SalesSummary!
        salesTrend: [SalesTrendPoint!]!
        stockMovementLedger: [StockMovementLedgerItem!]!
    }

    # Pagination metadata
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

    # Product Metrics Type
    type ProductMetrics {
        total: Int!
        active: Int!
        draft: Int!
    }

    # Paginated Products Type
    type PaginatedProducts {
        data: [Product!]
        meta: Pagination!
    }

    # Pagination input
    input PaginationInput {
        page: Int!
        limit: Int!
    }

    enum ProductStatus {
        ACTIVE
        INACTIVE
        DISCONTINUED
        DRAFT
        ARCHIVED
    }

    enum ProductOrderBy {
        createdAt
        name
        unitPrice
    }

    enum OrderDirectionLower {
        asc
        desc
    }

    # Get Products Input Type
    input GetProductsInput {
        search: String
        status: ProductStatus
        minPrice: Float
        maxPrice: Float
        dateFrom: String
        dateTo: String
        orderBy: ProductOrderBy
        orderDirection: OrderDirectionLower
    }

    # Paginated Products Input Type
    input PaginatedProductsInput {
        page: Int!
        limit: Int!
        filter: GetProductsInput!
    }

    # Add To Inventory Input Type
    input AddToInventoryInput {
        quantity: Int!
        reorderLevel: Int!
        maxStock: Int!
    }

    # Create Product Input Type
    input CreateProductInput {
        name: String!
        description: String
        sku: String
        unitPrice: Float!
        costPrice: Float
        status: ProductStatus!
        addToInventory: AddToInventoryInput
    }

    # Edit Product Input Type
    input EditProductInput {
        productId: ID!
        name: String!
        description: String
        sku: String
        status: ProductStatus!
        unitPrice: Float!
        costPrice: Float
        addToInventory: AddToInventoryInput
    }

    # Soft Delete Product Input Type
    input SoftDeleteProductInput {
        id: ID!
    }

    # Restore Product Input Type
    input RestoreProductInput {
        id: ID!
    }

    # Change Product Status Input Type
    input ChangeProductStatusInput {
        productId: ID!
        status: ProductStatus!
    }

    # Get Product By ID Input Type
    input GetProductByIdInput {
        id: ID!
    }

    # Query Type
    type Query {
        getProduct(productId: ID!): ProductDetails!
        getProducts(args: PaginatedProductsInput!): PaginatedProducts!
        getTotalProductsCount: Int!
        getProductMetrics: ProductMetrics!
    }

    # Mutation Type
    type Mutation {
        createProduct(input: CreateProductInput!): Product!
        editProduct(input: EditProductInput!): Product!
        changeProductStatus(input: ChangeProductStatusInput!): Product!
        softDeleteProduct(input: SoftDeleteProductInput!): Product!
        restoreProduct(input: RestoreProductInput!): Product!
    }

`;