import { gql } from "@apollo/client";

export const ME_QUERY = gql`
    query Me {
        me {
            id
            firstName
            lastName
            email
            role
            status
        }
    }
`;

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
            }
            token
        }
    }
`;

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
            }
            token
        }
    }
`;

export const VERIFY_OTP_FORGOT_PASSWORD = gql`
    mutation VerifyForgotPasswordOtp($input: VerifyForgotPasswordOtpInput!) {
        verifyForgotPasswordOtp(input: $input) {
            id
            email
        }
    }
`;

export const CHANGE_PASSWORD = gql`
    mutation ChangePassword($input: ChangePasswordInput!) {
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

export const RESEND_OTP_SIGNUP = gql`
    mutation resendOtpSignUp($input: ResendOtpInput!) {
        resendOtpSignUp(input: $input) {
            id
            firstName
            lastName
            email
            expiresAt
        }
    }
`;

export const RESEND_OTP_FORGOT_PASSWORD = gql`
    mutation resendOtpForgotPassword($input: ResendOtpInput!) {
        resendOtpForgotPassword(input: $input) {
            id
            email
            expiresAt
        }
    }
`;

export const FORGOT_PASSWORD = gql`
    mutation ForgotPassword($input: ForgotPasswordInput!) {
        forgotPassword(input: $input) {
            id
            email
        }
    }
`;