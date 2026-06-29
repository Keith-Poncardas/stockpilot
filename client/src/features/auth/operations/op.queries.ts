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
            createdAt
        }
    }
`;

export const VERIFY_OTP = gql`
    mutation VerifyOtp($input: VerifyOtpInput!) {
        verifyOtp(input: $input) {
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

export const RESEND_OTP = gql`
    mutation ResendOtp($input: ResendOtpInput!) {
        resendOtp(input: $input) {
            id
            firstName
            lastName
            email
            expiresAt
            createdAt
        }
    }
`;