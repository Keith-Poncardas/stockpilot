import { GraphQLContext } from "@/types";
import { authService } from "./auth.service";
import { ChangePasswordInput, ForgotPasswordInput, LoginInput, ResendOtpInput, SignUpInput, VerifyOtpRegistrationInput, VerifyForgotPasswordOtpInput } from "./auth.validation";
import { throwUnauthorized } from "@/utils";

export const authResolver = {

    Query: {

        /**
         * Get current authenticated user
         */
        me: async (_: unknown, __: unknown, context: GraphQLContext) => {
            if (!context.user) throwUnauthorized("You must be logged in to access this resource.");
            return context.user;
        },

    },

    Mutation: {

        /**
         * User login (login user) and return user and token
         */
        login: async (_: unknown, { input }: { input: LoginInput }) => {
            return authService.login(input);
        },

        /**
         * Change user password (requires current password)
         */
        changePassword: async (
            _: unknown,
            { input }: { input: ChangePasswordInput }
        ) => {
            return authService.changePassword(input);
        },

        /**
         * Sign up a new user (Pending Registration)
         */
        signUp: async (_: unknown, { input }: { input: SignUpInput }) => {
            return authService.signup(input);
        },

        /**
         * Verify OTP for pending registration
         */
        verifyOtpRegistration: async (
            _: unknown,
            { input }: { input: VerifyOtpRegistrationInput }
        ) => {
            return authService.verifyOtpRegistration(input);
        },

        /**
         * Resend OTP for signup
         */
        resendOtpSignUp: async (
            _: unknown,
            { input }: { input: ResendOtpInput }
        ) => {
            return authService.resendOtpSignUp(input);
        },

        /**
         * Resend OTP for forgot password
         */
        resendOtpForgotPassword: async (
            _: unknown,
            { input }: { input: ResendOtpInput }
        ) => {
            return authService.resendOtpForgotPassword(input);
        },

        /**
         * Forgot password (send OTP)
         */
        forgotPassword: async (
            _: unknown,
            { input }: { input: ForgotPasswordInput }
        ) => {
            return authService.forgotPassword(input);
        },

        /**
         * Verify OTP for forgot password
         */
        verifyForgotPasswordOtp: async (
            _: unknown,
            { input }: { input: VerifyForgotPasswordOtpInput }
        ) => {
            return authService.verifyForgotPasswordOtp(input);
        }

    }

}