export const customerTypeDefs = `#graphql

    # ─── Types ─────────────────────────────────────────────────────────────────

    # Customer list item (paginated list view)
    type Customer {
        id: ID!
        firstName: String
        lastName: String
        phone: String
        email: String
        city: String
        province: String

        # Computed from Sales relation
        totalOrders: Int!
        totalSpent: Float!
        lastPurchase: String

        createdAt: String!
        updatedAt: String!
    }

    # Recent sale entry on the customer detail view
    type CustomerRecentSale {
        id: ID!
        totalAmount: Float!
        status: String!
        saleDate: String!
        paymentMethod: String
    }

    # Purchase summary section on the customer detail view
    type CustomerPurchaseSummary {
        totalOrders: Int!
        totalSpent: Float!
        averageOrderValue: Float!
        firstPurchase: String
        lastPurchase: String
    }

    # Full customer details (detail / view page)
    type CustomerDetails {
        id: ID!
        firstName: String
        lastName: String
        phone: String
        email: String

        # Address
        addressLine1: String
        addressLine2: String
        city: String
        province: String
        postalCode: String
        country: String

        # Computed
        totalOrders: Int!
        totalSpent: Float!
        averageOrderValue: Float!
        firstPurchase: String
        lastPurchase: String

        purchaseSummary: CustomerPurchaseSummary!
        recentSales: [CustomerRecentSale!]!
        sales: [CustomerRecentSale!]!

        createdAt: String!
        updatedAt: String!
    }

    # Dashboard metric cards
    type CustomerMetrics {
        totalCustomers: Int!
        newCustomers: Int!
        totalRevenue: Float!
        returningCustomers: Int!
    }

    # Paginated customers response
    type PaginatedCustomers {
        data: [Customer!]!
        meta: Pagination!
    }

    # ─── Enums ─────────────────────────────────────────────────────────────────

    enum CustomerOrderBy {
        createdAt
        firstName
        lastName
    }

    # ─── Inputs ────────────────────────────────────────────────────────────────

    input GetCustomersFilter {
        search: String
        dateFrom: String
        dateTo: String
        orderBy: CustomerOrderBy
        orderDirection: OrderDirectionLower
    }

    input PaginatedCustomersInput {
        page: Int!
        limit: Int!
        filter: GetCustomersFilter!
    }

    input CreateCustomerInput {
        firstName: String!
        lastName: String!
        phone: String
        email: String
        addressLine1: String
        addressLine2: String
        city: String
        province: String
        postalCode: String
        country: String
    }

    # ─── Queries ───────────────────────────────────────────────────────────────

    type Query {
        getCustomers(args: PaginatedCustomersInput!): PaginatedCustomers!
        getCustomer(id: ID!): CustomerDetails!
        getCustomerMetrics: CustomerMetrics!
    }

    # ─── Mutations ─────────────────────────────────────────────────────────────

    type Mutation {
        createCustomer(input: CreateCustomerInput!): Customer!
    }

`;
