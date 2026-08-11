import { gql } from "@apollo/client";

/**
 * User fragment with correct field names.
 * Backend schema uses `salesCount` and `stockMovementsCount`
 * (not `salesProcessedCount` / `stockMovementsProcessedCount`).
 */
const USER_FIELDS = `
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
`;

export const GET_USER = gql`
query GetUser($userId: ID!) {
  getUser(userId: $userId) {
    ${USER_FIELDS}
  }
}
`;

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

export const CHANGE_USER_STATUS = gql`
mutation ChangeUserStatus($input: UpdateUserStatusInput!) {
  changeUserStatus(input: $input) {
    ${USER_FIELDS}
  }
}
`;

export const APPROVE_REJECT_USER = gql`
mutation ApproveRejectUser($input: ApproveRejectUserInput!) {
  approveRejectUser(input: $input) {
    ${USER_FIELDS}
  }
}
`;

export const ASSIGN_ROLE = gql`
mutation AssignRole($input: AssignRoleInput!) {
  assignRole(input: $input) {
    ${USER_FIELDS}
  }
}
`;
