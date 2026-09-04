import { gql } from '@apollo/client';

export const ADJUST_STOCK = gql`
    mutation AdjustStock($input: AdjustStockInput!) {
        adjustStock(input: $input) {
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
                imageUrl
                productType
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
            stockStatus
            product {
                id
                sku
                name
                imageUrl
                productType
            }
        }
    }
`;
