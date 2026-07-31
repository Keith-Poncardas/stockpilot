import { gql } from "@apollo/client";

/**
 * Fetches all dashboard data in a single query.
 * `timeRange` controls the Sales Overview chart grouping (daily | weekly | monthly).
 */
export const GET_DASHBOARD_DATA = gql`
    query GetDashboardData($timeRange: DashboardTimeRange) {
        getDashboardData(timeRange: $timeRange) {
            metrics {
                totalSales
                totalProducts
                totalCustomers
                totalUnitsInStock
            }
            salesChart {
                label
                value
            }
            topProducts {
                id
                name
                revenue
                percentage
            }
            topLocations {
                id
                name
                revenue
                percentage
            }
            recentSales {
                id
                customer
                product
                quantity
                amount
                status
            }
            lowStockAlerts {
                id
                productName
                sku
                quantityOnHand
                reorderLevel
                stockStatus
            }
        }
    }
`;
