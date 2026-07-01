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

export const GET_USER_METRICS = gql`
    query GetUserMetrics {
        getUserMetrics {
            total
            active
            pendingApproval
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

export const APPROVE_REJECT_USER = gql`
  mutation ApproveRejectUser($input: ApproveRejectUserInput!) {
    approveRejectUser(input: $input) {
      id
      email
      status
      approvalStatus
      role
    }
  }
`;

export const CHANGE_USER_STATUS = gql`
    mutation ChangeUserStatus($input: UpdateUserStatusInput!) {
        changeUserStatus(input: $input) {
            id
            email
            status
            role
        }
    }
`;

export const ASSIGN_ROLE = gql`
    mutation AssignRole($input: AssignRoleInput!) {
        assignRole(input: $input) {
            id
            email
        }
    }
`;

export const DELETE_USER = gql`
    mutation DeleteUser($userId: ID!) {
        deleteUser(userId: $userId) {
            action
        }
    }
`;