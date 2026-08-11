import { gql } from '@apollo/client';

/**
 * Paginated sales list for the Sales Index table.
 * Returns only what the table renders — no product/inventory data.
 * The cashier relation is `author` (not `user`) per the backend schema.
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

        author {
          id
          firstName
          lastName
          role
        }

        saleItems {
          id
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
 * KPI metrics for the Sales Index page.
 * `getSalesMetrics` takes no arguments per the backend schema.
 * Returns: totalRevenue, completedSales, totalTransactions, refundedOrVoidedCount.
 * Note: averageOrderValue is NOT returned by the backend — compute it in the UI if needed.
 */
export const GET_SALE_METRICS = gql`
  query GetSaleMetrics {
    getSalesMetrics {
      totalRevenue
      completedSales
      totalTransactions
      refundedOrVoidedCount
    }
  }
`;

/**
 * Products list for POS product catalog grid.
 */
export const GET_POS_PRODUCTS = gql`
  query GetPosProducts($input: GetInventoriesInput) {
    getInventories(input: $input) {
      data {
        id
        productId
        quantityOnHand
        reorderLevel
        product {
          id
          sku
          name
          unitPrice
          status
        }
      }
      meta {
        page
        limit
        totalItems
        totalPages
        hasNextPage
      }
    }
  }
`;

/**
 * Customers search for POS customer modal with cursor pagination.
 * Uses the correct backend argument signature: searchCustomers(args: SearchCustomersInput!)
 */
export const SEARCH_CUSTOMERS = gql`
  query SearchCustomers($args: SearchCustomersInput!) {
    searchCustomers(args: $args) {
      data {
        id
        firstName
        lastName
        phone
        email
      }
      meta {
        nextCursor
        hasNextPage
      }
    }
  }
`;

/**
 * Full sale detail query for the Sale View Page.
 * The cashier relation is `author` (not `user`).
 * Sale items are under `saleItems` (not `items`), and product details
 * come from the nested `product` relation on each SaleItem.
 */
export const GET_SALE = gql`
  query GetSale($saleId: ID!) {
    getSale(saleId: $saleId) {
      id
      saleDate
      totalAmount
      paymentMethod
      status
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
        product {
          id
          sku
          name
        }
      }
    }
  }
`;
