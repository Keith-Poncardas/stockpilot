export const saleTypeDefs = `#graphql

    # ─── Types ──────────────────────────────────────────────────────────────────

    # Embedded customer name for sale list view
    type SaleCustomerName {
        firstName: String
        lastName: String
    }

    # Embedded cashier name for sale list view
    type SaleCashierName {
        firstName: String!
        lastName: String!
    }

    # Count of sale items (for "Items" column)
    type SaleItemCount {
        saleItems: Int!
    }

    # Sale row returned by the paginated list query.
    # Only contains what the index table needs — full details live on a detail page.
    type SaleListItem {
        id: ID!
        saleDate: String!
        totalAmount: Float!
        paymentMethod: String
        status: SaleStatus!

        # Embedded relations (name-only)
        customer: SaleCustomerName
        user: SaleCashierName!

        # Computed item count
        itemCount: Int!
    }

    # Paginated sales response
    type PaginatedSales {
        data: [SaleListItem!]!
        meta: Pagination!
    }

    # KPI metrics for the Sales index page
    type SaleMetrics {
        # SUM(totalAmount) WHERE status = COMPLETED
        totalRevenue: Float!
        # COUNT of all sales (optionally filtered by date)
        totalTransactions: Int!
        # totalRevenue / completed sales count
        averageOrderValue: Float!
        # COUNT WHERE status IN (REFUNDED, VOIDED)
        refundedOrVoidedCount: Int!
    }

    # ─── Enums ──────────────────────────────────────────────────────────────────

    enum SaleStatus {
        PENDING
        COMPLETED
        REFUNDED
        VOIDED
    }

    enum SaleOrderBy {
        saleDate
        totalAmount
    }

    # ─── Inputs ─────────────────────────────────────────────────────────────────

    # Filter input for the paginated sales list
    input GetSalesFilter {
        # Full-text search across customer and cashier names
        search: String
        status: SaleStatus
        paymentMethod: String
        dateFrom: String
        dateTo: String
        orderBy: SaleOrderBy
        orderDirection: OrderDirectionLower
    }

    input PaginatedSalesInput {
        page: Int!
        limit: Int!
        filter: GetSalesFilter!
    }

    # Date-range filter applied to KPI metrics so they respect the selected period
    input GetSalesMetricsFilter {
        dateFrom: String
        dateTo: String
    }

    # ─── Queries ────────────────────────────────────────────────────────────────

    type Query {
        getSales(args: PaginatedSalesInput!): PaginatedSales!
        getSalesMetrics(filter: GetSalesMetricsFilter): SaleMetrics!
    }

`;
