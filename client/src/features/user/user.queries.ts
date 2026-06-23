import { gql } from '@apollo/client';

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
          salesProcessed
          stockMovementProcessed
        }
    }
`;