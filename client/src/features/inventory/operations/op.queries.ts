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
                    imageUrl
                    productType
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
            estimatedDaysOfStock
            lastRestockDate
            product {
                id
                sku
                name
                description
                unitPrice
                costPrice
                status
                imageUrl
                productType
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

export const GET_AI_STOCK_RECOMMENDATION = gql`
    query GetAiStockRecommendation($inventoryId: ID!) {
        getAiStockRecommendation(inventoryId: $inventoryId) {
            recommendedQuantity
            urgencyLevel
            headline
            reasoning
            targetDaysOfCoverage
            stockoutRiskAssessment
            salesVelocityDaily
            currentStock
            reorderLevel
            maxStock
            financialImpact {
                estimatedRestockCost
                potentialRevenue
                projectedProfit
            }
            calculatedAt
        }
    }
`;


