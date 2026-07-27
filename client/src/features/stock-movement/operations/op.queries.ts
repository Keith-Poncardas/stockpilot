import { gql } from "@apollo/client";

export const GET_ALL_STOCK_MOVEMENTS = gql`
    query GetAllStockMovements($args: PaginatedStockMovementsInput!) {
        getAllStockMovements(args: $args) {
            data {
                id
                productId
                userId
                type
                quantity
                reference
                notes
                reason
                createdAt
                product {
                    id
                    sku
                    name
                }
                user {
                    id
                    firstName
                    lastName
                    role
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

export const GET_STOCK_MOVEMENT_DASHBOARD_METRICS = gql`
    query GetStockMovementDashboardMetrics {
        getStockMovementDashboardMetrics {
            totalStockIn
            totalStockOut
            totalStockAdjustments
            lowStockProducts
        }
    }
`;

export const GET_STOCK_MOVEMENT = gql`
    query GetStockMovement($id: ID!) {
        getStockMovement(id: $id) {
            id
            productId
            userId
            type
            quantity
            reference
            notes
            reason
            createdAt
            product {
                id
                sku
                name
                costPrice
                unitPrice
                status
                inventoryStatus {
                    id
                    quantityOnHand
                    reorderLevel
                    maxStock
                    lastRestockDate
                    estimatedDaysOfStock
                }
            }
            user {
                id
                firstName
                lastName
                role
            }
        }
    }
`;
