import { gql } from '@apollo/client';

/**
 * Fetches the paginated customer list.
 * The Customer type has `provinceCode` and `cityCode` (not `city`/`province`).
 * Fields like `totalOrders`, `totalSpent`, `lastPurchase` do not exist on Customer —
 * purchase data lives in `purchaseSummary` (a resolver field).
 */
export const GET_CUSTOMERS = gql`
  query GetCustomers($args: PaginatedCustomersInput!) {
    getCustomers(args: $args) {
      data {
        id
        firstName
        lastName
        phone
        email
        provinceCode
        cityCode
        createdAt
        updatedAt
        purchaseSummary {
          totalOrders
          totalSpent
          lastPurchase
        }
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
 * Fetches a single customer with full detail.
 * Uses `purchaseSummary` for purchase metrics and
 * `purchaseHistory` (a paginated resolver) for recent transactions.
 * Non-existent fields (`city`, `province`, `totalOrders`, `totalSpent`,
 * `customerType`, `averageOrderValue`, `firstPurchase`, `lastPurchase`,
 * `recentSales`, `sales`) have been removed.
 */
export const GET_CUSTOMER = gql`
  query GetCustomer($id: ID!) {
    getCustomer(id: $id) {
      id
      firstName
      lastName
      phone
      email
      addressLine1
      addressLine2
      provinceCode
      cityCode
      postalCode
      country
      createdAt
      updatedAt
      purchaseSummary {
        totalOrders
        totalSpent
        averageOrderValue
        firstPurchase
        lastPurchase
      }
    }
  }
`;

export const GET_CUSTOMER_METRICS = gql`
  query GetCustomerMetrics {
    getCustomerMetrics {
      totalCustomers
      newCustomers
      totalRevenue
      returningCustomers
    }
  }
`;
