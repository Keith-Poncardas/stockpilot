import { gql } from '@apollo/client';

export const GET_PRODUCT = gql`
  query GetProduct($productId: ID!) {
    getProduct(productId: $productId) {
      productInfo {
        id
        sku
        name
        description
        unitPrice
        costPrice
        grossMargin
        status
        createdAt
        updatedAt
      }
      inventoryStatus {
        quantityOnHand
        reorderLevel
        maxStock
        lastRestockDate
        estimatedDaysOfStock
      }
      salesSummary {
        unitsSoldMonth
        revenueMonth
        avgSalePerDay
        transactions
        avgPerSale
        sellThroughRate
      }
      salesTrend {
        date
        label
        unitsSold
        isToday
      }
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
        status
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

export const CHANGE_PRODUCT_STATUS = gql`
    mutation ChangeProductStatus($input: ChangeProductStatusInput!) {
        changeProductStatus(input: $input) {
            id
            status
        }
    }
`;

export const CREATE_PRODUCT = gql`
    mutation CreateProduct($input: CreateProductInput!) {
        createProduct(input: $input) {
            id
            name
            sku
            status
        }
    }
`;



export const EDIT_PRODUCT = gql`
    mutation EditProduct($input: EditProductInput!) {
        editProduct(input: $input) {
            id
            name
            sku
            status
        }
    }
`;
