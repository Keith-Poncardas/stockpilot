import { gql } from "@apollo/client";

/**
 * Fetches all dashboard data in a single combined query since the backend
 * broke them out into separate queries on the root Query type.
 */
export const GET_DASHBOARD_DATA = gql`
    query GetDashboardData(
        $period: SalesOverviewPeriod!
        $locationInput: GetSalesByLocationInput!
        $productSort: SortOrder!
    ) {
        dashboardMetrics {
            totalSales
            totalProducts
            totalCustomers
            totalUnitsInStock
        }
        getSalesOverview(period: $period) {
            label
            date
            sales
            isActive
        }
        getSalesByLocation(input: $locationInput) {
            cityCode
            name
            revenue
            percentage
            rank
        }
        getTopSellingProducts(sort: $productSort) {
            id
            name
            quantitySold
            percentage
            rank
        }
        recentSales {
            data {
                id
                saleDate
                totalAmount
                paymentMethod
                status
                customer {
                    firstName
                    lastName
                }
            }
        }
        lowStockAlerts {
            data {
                id
                productId
                quantityOnHand
                reorderLevel
                stockStatus
                product {
                    name
                    sku
                }
            }
        }
    }
`;
