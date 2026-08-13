import { gql } from "@apollo/client";

/**
 * Query to fetch detailed information for a specific user by their ID.
 */
export const GET_USER = gql`
  query GetUser($userId: ID!) {
    getUser(userId: $userId) {
      id
      firstName
      lastName
      email
      role
      status
      approvalStatus
      createdAt
      updatedAt
      salesCount
      stockMovementsCount
    }
  }
`;

/**
 * Query to fetch a paginated list of users with optional filtering and sorting.
 */
export const GET_USERS = gql`
  query GetUsers($args: GetUsersInput!) {
    getUsers(args: $args) {
      data {
        id
        firstName
        lastName
        email
        role
        status
        approvalStatus
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

/**
 * Query to fetch aggregated metrics for users (total, active, pending approval).
 */
export const GET_USER_METRICS = gql`
  query GetUserMetrics {
    getUserMetrics {
      total
      active
      pendingApproval
    }
  }
`;

