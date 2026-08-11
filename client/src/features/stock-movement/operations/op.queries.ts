import { gql } from "@apollo/client";

/**
 * Paginated list of stock movements.
 * Correct query name is `getStockMovements` (not `getAllStockMovements`).
 * The user who performed the movement is `author` (not `user`).
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
 * Single stock movement detail.
 * - Correct argument name is `movementId` (not `id`).
 * - The user is `author` (not `user`).
 * - The product inventory is accessed via `inventory` (not `inventoryStatus`).
 *   Inventory.inventory provides: id, quantityOnHand, reorderLevel, maxStock, updatedAt.
 *   Fields `lastRestockDate` and `estimatedDaysOfStock` do NOT exist on the Inventory type.
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
