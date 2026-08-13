import { gql } from "@apollo/client";

/**
 * Query to fetch the details of the currently authenticated user.
 */
export const ME_QUERY = gql`
    query Me {
        me {
            id
            firstName
            lastName
            email
            role
            status
            approvalStatus
        }
    }
`;

/**
 * Mutation to authenticate a user and retrieve an access token.
 */
export const LOGIN = gql`
    mutation Login($input: LoginInput!) {
        login(input: $input) {
            user {
                id
                firstName
                lastName
                email
                role
                status
                approvalStatus
            }
            token
        }
    }
`;

/**
 * Mutation to register a new user account.
 */
export const SIGN_UP = gql`
    mutation SignUp($input: SignUpInput!) {
        signUp(input: $input) {
            id
            firstName
            lastName
            email
            expiresAt
        }
    }
`;

/**
 * Mutation to verify the OTP sent during the registration process.
 */
export const VERIFY_OTP_REGISTRATION = gql`
    mutation VerifyOtpRegistration($input: VerifyOtpRegistrationInput!) {
        verifyOtpRegistration(input: $input) {
            user {
                id
                firstName
                lastName
                email
                role
                status
                approvalStatus
            }
            token
        }
    }
`;

/**
 * Mutation to verify the OTP sent for a password reset request.
 */
export const VERIFY_OTP_FORGOT_PASSWORD = gql`
    mutation VerifyForgotPasswordOtp($input: VerifyOtpRegistrationInput!) {
        verifyForgotPasswordOtp(input: $input) {
            id
            email
            expiresAt
        }
    }
`;

/**
 * Mutation to update or change a user's password.
 */
export const CHANGE_PASSWORD = gql`
    mutation ChangePassword($input: ChangesPasswordInput!) {
        changePassword(input: $input) {
            id
            firstName
            lastName
            email
            role
            status
        }
    }
`;

/**
 * Mutation to resend the OTP during the registration process.
 */
export const RESEND_OTP_SIGNUP = gql`
    mutation resendOtpSignUp($input: ResendOtpSignUpInput!) {
        resendOtpSignUp(input: $input) {
            id
            firstName
            lastName
            email
            expiresAt
        }
    }
`;

/**
 * Mutation to resend the OTP for a password reset request.
 */
export const RESEND_OTP_FORGOT_PASSWORD = gql`
    mutation resendOtpForgotPassword($input: ResendOtpSignUpInput!) {
        resendOtpForgotPassword(input: $input) {
            id
            email
            expiresAt
        }
    }
`;

/**
 * Mutation to initiate the forgot password flow and send an OTP.
 */
export const FORGOT_PASSWORD = gql`
    mutation ForgotPassword($input: ResendOtpSignUpInput!) {
        forgotPassword(input: $input) {
            id
            email
            expiresAt
        }
    }
`;