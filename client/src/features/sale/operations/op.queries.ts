import { gql } from '@apollo/client';

/**
 * Paginated sales list for the Sales Index table.
 * Returns only what the table renders — no product/inventory data.
 */
export const GET_SALES = gql`
  query GetSales($args: PaginatedSalesInput!) {
    getSales(args: $args) {
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

        user {
          firstName
          lastName
        }

        itemCount
      }
      meta {
        page
        limit
        firstItem
        lastItem
        totalItems
        totalPages
        hasPreviousPage
        hasNextPage
      }
    }
  }
`;

/**
 * KPI metrics for the Sales Index page.
 * Loaded independently from the table so they never block pagination.
 * Accepts an optional date range so KPIs respect the user's active filter.
 */
export const GET_SALE_METRICS = gql`
  query GetSaleMetrics($filter: GetSalesMetricsFilter) {
    getSalesMetrics(filter: $filter) {
      totalRevenue
      totalTransactions
      averageOrderValue
      refundedOrVoidedCount
    }
  }
`;
