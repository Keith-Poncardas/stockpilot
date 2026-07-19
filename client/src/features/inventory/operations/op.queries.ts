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

export const SEARCH_INVENTORY_PRODUCTS = gql`
    query SearchInventoryProducts($search: String) {
        searchInventoryProducts(search: $search) {
            id
            sku
            name
            description
            unitPrice
            costPrice
            status
            isAddedInventory
        }
    }
`;
