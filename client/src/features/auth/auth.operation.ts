import { gql } from "@apollo/client";

/** login mutation */
export const LOGIN = gql`
    mutation Login($input: LoginInput!) {
        login(input: $input) {
            user {
                id
                firstName
                lastName
                email
                role
            }
            token
        }
    }
`;