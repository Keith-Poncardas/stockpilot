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

    # Sign up input
    input SignUpInput {
        firstName: String!
        lastName: String!
        email: String!
        password: String!
    }

    # Verify OTP input
    input VerifyOtpInput {
        email: String!
        otp: String!
    }

    # Resend OTP input
    input ResendOtpInput {
        email: String!
    }

    # Pending Registration type
    type PendingRegistration {
        id: ID!
        firstName: String!
        lastName: String!
        email: String!
        expiresAt: String!
        createdAt: String!
    }

    # Mutations for authentication
    type Mutation {
        login(input: LoginInput!): AuthResponse!
        changePassword(input: ChangePasswordInput!): AuthResponse!
        signUp(input: SignUpInput!): PendingRegistration!
        verifyOtp(input: VerifyOtpInput!): AuthResponse!
        resendOtp(input: ResendOtpInput!): PendingRegistration!
    }

`;