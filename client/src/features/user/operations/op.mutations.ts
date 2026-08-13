import { gql } from "@apollo/client";

/**
 * Mutation to change a user's account status (e.g., ACTIVE, INACTIVE, SUSPENDED, TERMINATED).
 */
export const CHANGE_USER_STATUS = gql`
    mutation ChangeUserStatus($input: UpdateUserStatusInput!) {
        changeUserStatus(input: $input) {
            id
        }
    }
`;

/**
 * Mutation to approve or reject a user's account registration request.
 */
export const APPROVE_REJECT_USER = gql`
    mutation ApproveRejectUser($input: ApproveRejectUserInput!) {
        approveRejectUser(input: $input) {
            id
        }
    }
`;

/**
 * Mutation to assign a system role (e.g., ADMIN, MANAGER, CASHIER) to a user.
 */
export const ASSIGN_ROLE = gql`
    mutation AssignRole($input: AssignRoleInput!) {
        assignRole(input: $input) {
            id
        }
    }
`;