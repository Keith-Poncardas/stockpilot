export const authTypeDefs = `#graphql

    # Response after successful auth operation (login or change password)
    type AuthResponse {
        user: User!
        token: String!
    }

    # User login input
    input LoginInput {
        email: String!
        password: String!
    }

    # Change password input
    input ChangePasswordInput {
        oldPassword: String!
        newPassword: String!
        confirmPassword: String!
    }

    # Query to get current authenticated user
    type Query {
        me: User
    }

    # Mutations for authentication
    type Mutation {
        login(input: LoginInput!): AuthResponse!
        changePassword(input: ChangePasswordInput!): AuthResponse!
    }

`;