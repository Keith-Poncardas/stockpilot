import { gql } from '@apollo/client';

export const GET_CUSTOMERS = gql`
  query GetCustomers($args: PaginatedCustomersInput!) {
    getCustomers(args: $args) {
      data {
        id
        firstName
        lastName
        phone
        email
        city
        province
        totalOrders
        totalSpent
        lastPurchase
        createdAt
        updatedAt
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
      city
      province
      postalCode
      country
      totalOrders
      totalSpent
      averageOrderValue
      firstPurchase
      lastPurchase
      purchaseSummary {
        totalOrders
        totalSpent
        averageOrderValue
        firstPurchase
        lastPurchase
      }
      recentSales {
        id
        totalAmount
        status
        saleDate
        paymentMethod
      }
      sales {
        id
        totalAmount
        status
        saleDate
        paymentMethod
      }
      createdAt
      updatedAt
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
