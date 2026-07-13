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
                    isActive
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
            updatedAt
            stockStatus
            product {
                id
                sku
                name
                description
                unitPrice
                costPrice
                isActive
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
            updatedAt
            stockStatus
            product {
                id
                sku
                name
            }
        }
    }
`;
