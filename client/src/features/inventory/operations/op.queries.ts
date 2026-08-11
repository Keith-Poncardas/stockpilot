import { gql } from '@apollo/client';

export const GET_INVENTORY_STATUSES = gql`
    query GetInventoryStatuses {
        getInventoryStatuses {
            wellStocked
            lowStock
            criticalOut
            belowReorderLevel
        }
    }
`;

export const GET_INVENTORIES = gql`
    query GetInventories($input: GetInventoriesInput) {
        getInventories(input: $input) {
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
                    status
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

export const GET_INVENTORY = gql`
    query GetInventory($inventoryId: ID!) {
        getInventory(inventoryId: $inventoryId) {
            id
            productId
            quantityOnHand
            reorderLevel
            maxStock
            updatedAt
            createdAt
            stockStatus
            product {
                id
                sku
                name
                description
                unitPrice
                costPrice
                status
            }
            author {
                id
                firstName
                lastName
                email
                role
            }
        }
    }
`;

export const ADJUST_STOCK = gql`
    mutation AdjustStock($input: AdjustStockInput!) {
        adjustStock(input: $input) {
            id
            productId
            quantityOnHand
            reorderLevel
            maxStock
            updatedAt
            product {
                id
                sku
                name
            }
        }
    }
`;

/**
 * Cursor-based infinite scroll search across products.
 * Used by the inventory "Add Inventory" flow to find products
 * that can have inventory records created for them.
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

export const CREATE_INVENTORY = gql`
    mutation CreateInventory($input: CreateInventoryInput!) {
        createInventory(input: $input) {
            id
            productId
            quantityOnHand
            reorderLevel
            maxStock
            createdAt
            product {
                id
                sku
                name
            }
        }
    }
`;
