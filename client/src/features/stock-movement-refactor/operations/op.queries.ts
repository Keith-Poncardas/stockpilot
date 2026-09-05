import { gql } from "@apollo/client";

/**
 * Paginated list of stock movements.
 */
export const GET_ALL_STOCK_MOVEMENTS = gql`
    query GetStockMovements($args: PaginatedStockMovementsInput!) {
        getStockMovements(args: $args) {
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
                    imageUrl
                }
                author {
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

/**
 * Dashboard metrics for stock movements.
 */
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

/**
 * Single stock movement detail with product, inventory, and author.
 */
export const GET_STOCK_MOVEMENT = gql`
    query GetStockMovement($movementId: ID!) {
        getStockMovement(movementId: $movementId) {
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
                imageUrl
                costPrice
                unitPrice
                status
            }
            inventory {
                id
                quantityOnHand
                reorderLevel
                maxStock
                updatedAt
            }
            author {
                id
                firstName
                lastName
                role
            }
        }
    }
`;
