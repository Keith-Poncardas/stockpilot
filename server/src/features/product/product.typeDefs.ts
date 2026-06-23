export const productTypeDefs = `#graphql

    # Product Type
    type Product {
        id: ID!
        sku: String!
        name: String!
        description: String!
        unitPrice: Float!
        costPrice: Float!
        isActive: Boolean!
        createdAt: String!
        updatedAt: String!
        deletedAt: String
    }

    # Product Info Type
    type ProductInfo {
        id: ID!
        sku: String!
        name: String!
        description: String!
        unitPrice: Float!
        costPrice: Float
        grossMargin: Float
        createdAt: String!
        updatedAt: String!
    }

    # Inventory Status Type
    type InventoryStatus {
        quantityOnHand: Int!
        reorderLevel: Int!
    }

    # Sales Summary Type
    type SalesSummary {
        unitsSoldMonth: Int!
        revenueMonth: Float!
        avgSalePerDay: Float!
    }

    # Product Details Type
    type ProductDetails {
        productInfo: ProductInfo!
        inventoryStatus: InventoryStatus!
        salesSummary: SalesSummary!
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

    # Get Products Input Type
    input GetProductsInput {
        search: String
        status: String
        stockStatus: String
        minPrice: Float
        maxPrice: Float
        dateFrom: String
        dateTo: String
        withDeleted: Boolean
        orderBy: String
        orderDirection: String
    }

    # Add To Inventory Input Type
    input AddToInventoryInput {
        isAdded: Boolean!
        quantity: Int!
        reorderLevel: Int!
    }

    # Create Product Input Type
    input CreateProductInput {
        name: String!
        description: String
        sku: String!
        unitPrice: Float!
        costPrice: Float
        addToInventory: AddToInventoryInput
    }

    # Edit Product Input Type
    input EditProductInput {
        id: ID!
        name: String!
        description: String
        sku: String!
        unitPrice: Float!
        costPrice: Float
    }

    # Soft Delete Product Input Type
    input SoftDeleteProductInput {
        id: ID!
    }

    # Restore Product Input Type
    input RestoreProductInput {
        id: ID!
    }

    # Get Product By ID Input Type
    input GetProductByIdInput {
        id: ID!
    }

    # Total Products Input Type
    input TotalProductsInput {
        withDeleted: Boolean
    }

    # Query Type
    type Query {
        getProduct(productId: GetProductByIdInput!): ProductDetails!
        getProducts(pagination: PaginationInput, filter: GetProductsInput): PaginatedProducts!
        totalProducts(filter: TotalProductsInput): Int!
    }

    # Mutation Type
    type Mutation {
        createProduct(input: CreateProductInput!): Product!
        editProduct(input: EditProductInput!): Product!
        softDeleteProduct(input: SoftDeleteProductInput!): Product!
        restoreProduct(input: RestoreProductInput!): Product!
    }

`;