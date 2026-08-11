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
            approvalStatus
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
                approvalStatus
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
                approvalStatus
            }
            token
        }
    }
`;

export const VERIFY_OTP_FORGOT_PASSWORD = gql`
    mutation VerifyForgotPasswordOtp($input: VerifyOtpRegistrationInput!) {
        verifyForgotPasswordOtp(input: $input) {
            id
            email
            expiresAt
        }
    }
`;

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

export const RESEND_OTP_FORGOT_PASSWORD = gql`
    mutation resendOtpForgotPassword($input: ResendOtpSignUpInput!) {
        resendOtpForgotPassword(input: $input) {
            id
            email
            expiresAt
        }
    }
`;

export const FORGOT_PASSWORD = gql`
    mutation ForgotPassword($input: ResendOtpSignUpInput!) {
        forgotPassword(input: $input) {
            id
            email
            expiresAt
        }
    }
`;