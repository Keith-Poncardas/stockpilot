import { gql } from '@apollo/client';

/**
 * GraphQL Query to retrieve a paginated list of sales based on filter criteria.
 * Matches the 'getSales(args: PaginatedSalesInput!): PaginatedSales!' query in server/src/features/sale/sale.gql.
 */
export const GET_SALES = gql`
  query GetSales($args: PaginatedSalesInput!) {
    getSales(args: $args) {
      data {
        id
        customerId
        userId
        status
        totalAmount
        paymentMethod
        saleDate
        createdAt
        updatedAt

        itemsCount
        
        customer {
          id
          firstName
          lastName
          email
          phone
        }
        
        author {
          id
          firstName
          lastName
          role
          email
        }
        
        saleItems {
          id
          productId
          quantity
          unitPrice
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
 * GraphQL Query to retrieve sales-related metrics/KPIs.
 * Matches the 'getSalesMetrics: SaleMetrics!' query in server/src/features/sale/sale.gql.
 */
export const GET_SALE_METRICS = gql`
  query GetSaleMetrics {
    getSalesMetrics {
      totalRevenue
      totalTransactions
      completedSales
      refundedOrVoidedCount
    }
  }
`;

/**
 * GraphQL Query to retrieve detailed information for a single sale.
 * Matches the 'getSale(saleId: ID!): Sale!' query in server/src/features/sale/sale.gql.
 */
export const GET_SALE = gql`
  query GetSale($saleId: ID!) {
    getSale(saleId: $saleId) {
      id
      customerId
      userId
      status
      totalAmount
      paymentMethod
      saleDate
      createdAt
      updatedAt
      
      customer {
        id
        firstName
        lastName
        email
        phone
        addressLine1
        addressLine2
        cityCode
        provinceCode
        postalCode
        country
      }
      
      author {
        id
        firstName
        lastName
        role
        email
        status
      }
      
      saleItems {
        id
        saleId
        productId
        quantity
        unitPrice
        product {
          id
          sku
          name
          unitPrice
          regularPrice
          productType
          status
          bundleItems {
            id
            parentProductId
            bundledProductId
            quantity
            product {
              id
              name
              sku
            }
          }
          pricingTiers {
            id
            minQuantity
            maxQuantity
            tierPrice
            freeProductId
            freeQuantity
            freeProduct {
              id
              name
              sku
            }
          }
        }
      }
    }
  }
`;

export const GET_SELLABLE_PRODUCTS = gql`
  query GetSellableProducts($input: GetInventoriesInput!) {
    getSellableProducts(args: $input) {
      data {
        id
        productId
        quantityOnHand
        reorderLevel
        maxStock
        updatedAt
        stockStatus
        product {
          id
          sku
          name
          description
          unitPrice
          costPrice
          regularPrice
          productType
          status
          bundleItems {
            id
            parentProductId
            bundledProductId
            quantity
            product {
              id
              name
              sku
              unitPrice
            }
          }
          pricingTiers {
            id
            minQuantity
            maxQuantity
            tierPrice
            freeProductId
            freeQuantity
            freeProduct {
              id
              name
              sku
            }
          }
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
