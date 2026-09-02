import { gql } from '@apollo/client';

/**
 * Fetch a single product by ID.
 * Returns the flat Product fields plus inventory, performanceMetrics, and salesTrend.
 */
export const GET_PRODUCT = gql`
  query GetProduct($productId: ID!) {
    getProduct(productId: $productId) {
      id
      sku
      name
      description
      unitPrice
      costPrice
      regularPrice
      productType
      status
      createdAt
      updatedAt
      inventory {
        id
        quantityOnHand
        reorderLevel
        maxStock
        updatedAt
        lastRestockDate
        estimatedDaysOfStock
      }
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
          costPrice
          status
          inventory {
            id
            quantityOnHand
          }
        }
      }
      pricingTiers {
        id
        productId
        minQuantity
        maxQuantity
        tierPrice
        freeProductId
        freeQuantity
        freeProduct {
          id
          name
          sku
          unitPrice
        }
      }
      performanceMetrics {
        unitsSold
        unitsSoldTrend
        revenue
        revenueTrend
        transactions
        avgPerSale
        sellThroughRate
      }
      salesTrend {
        label
        date
        sales
        isActive
      }
    }
  }
`;

export const GET_PRODUCT_SALES_OVERVIEW = gql`
  query GetProductSalesOverview($period: SalesOverviewPeriod!, $productId: ID) {
    getSalesOverview(period: $period, productId: $productId) {
      label
      date
      sales
      isActive
    }
  }
`;

export const GET_PRODUCTS = gql`
  query GetProducts($args: PaginatedProductsInput!) {
    getProducts(args: $args) {
      data {
        id
        sku
        name
        description
        unitPrice
        costPrice
        regularPrice
        productType
        status
        createdAt
        updatedAt
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

export const GET_TOTAL_PRODUCTS_COUNT = gql`
  query GetTotalProductsCount {
    getTotalProductsCount
  }
`;

export const GET_PRODUCT_METRICS = gql`
  query GetProductMetrics {
    getProductMetrics {
      total
      active
      draft
    }
  }
`;

export const SEARCH_PRODUCTS_INFINITE = gql`
  query SearchProductsInfinite($input: SearchProductsInfiniteInput!) {
    searchProductsInfinite(input: $input) {
      data {
        id
        sku
        name
        description
        unitPrice
        costPrice
        regularPrice
        productType
        status
        createdAt
        updatedAt
        inventory {
          id
          quantityOnHand
          reorderLevel
          maxStock
          updatedAt
        }
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
      meta {
        nextCursor
        hasNextPage
      }
    }
  }
`;
