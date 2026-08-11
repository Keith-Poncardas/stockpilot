import { gql } from '@apollo/client';

/**
 * Fetch a single product by ID.
 * Returns the flat Product fields plus the nested inventory relation
 * (quantityOnHand, reorderLevel, maxStock) which maps to the backend
 * Product.inventory resolver.
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

/**
 * Cursor-based infinite scroll search across all products.
 * Corresponds to the backend `searchProductsInfinite` query.
 */
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
                status
            }
            meta {
                nextCursor
                hasNextPage
            }
        }
    }
`;
