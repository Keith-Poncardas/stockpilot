export const baseTypeDefs = `#graphql

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

    # Order Direction Enum
    enum OrderDirection {
        asc
        desc
    }

`