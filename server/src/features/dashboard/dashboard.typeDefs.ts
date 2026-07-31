export const dashboardTypeDefs = `#graphql

    # ─── Enums ──────────────────────────────────────────────────────────────────

    enum DashboardTimeRange {
        daily
        weekly
        monthly
    }

    # ─── Types ──────────────────────────────────────────────────────────────────

    # Top-line KPI cards
    type DashboardMetrics {
        # SUM(totalAmount) of COMPLETED sales (all time)
        totalSales: Float!
        # Total number of active (non-archived/discontinued) products
        totalProducts: Int!
        # Total number of customers
        totalCustomers: Int!
        # SUM(quantityOnHand) across all inventory records
        totalUnitsInStock: Int!
    }

    # A single bar in the Sales Overview chart
    type SalesChartPoint {
        label: String!
        value: Float!
    }

    # A row in the Top Selling Products list
    type DashboardTopProduct {
        id: ID!
        name: String!
        revenue: Float!
        percentage: Float!
    }

    # A row in the Sales by Location list
    type DashboardTopLocation {
        id: String!
        name: String!
        revenue: Float!
        percentage: Float!
    }

    # A row in the Recent Sales table
    type DashboardRecentSale {
        id: String!
        customer: String!
        product: String
        quantity: Int!
        amount: Float!
        status: String!
    }

    # A row in the Low Stock Alerts table
    type DashboardLowStockAlert {
        id: String!
        productName: String!
        sku: String
        quantityOnHand: Int!
        reorderLevel: Int!
        stockStatus: String!
    }

    # Unified response for the entire dashboard
    type DashboardData {
        metrics: DashboardMetrics!
        salesChart: [SalesChartPoint!]!
        topProducts: [DashboardTopProduct!]!
        topLocations: [DashboardTopLocation!]!
        recentSales: [DashboardRecentSale!]!
        lowStockAlerts: [DashboardLowStockAlert!]!
    }

    # ─── Queries ────────────────────────────────────────────────────────────────

    type Query {
        getDashboardData(timeRange: DashboardTimeRange): DashboardData!
    }

`;
