import { GraphQLContext } from "@/types";
import { authService } from "./auth.service";
import { applyErrorHandling, composeResolvers, protectResolvers, validate } from "@/graphql/helpers";
import {
    changePasswordSchema,
    forgotPasswordSchema,
    loginSchema,
    resendOtpSchema,
    signUpSchema,
    verifyForgotPasswordOtpSchema,
    verifyOtpRegistrationSchema
} from "./auth.validation";
import {
    ChangePasswordInput,
    ForgotPasswordInput,
    LoginInput,
    ResendOtpInput,
    SignUpInput,
    VerifyForgotPasswordOtpInput,
    VerifyOtpRegistrationInput
} from "./types";

export const authResolver = {

    Query: composeResolvers(
        protectResolvers,
        applyErrorHandling
    )({

        /**
         * Retrieves the authenticated user's details.
         *
         * @param _ - The parent resolver object (unused).
         * @param __ - The arguments (unused).
         * @param context - The GraphQL context containing the authenticated user.
         * @returns The authenticated user record.
         */
        me: async (_: unknown, __: unknown, context: GraphQLContext) => {
            return context.user;
        },

    }),

    Mutation: {

        ...composeResolvers(
            applyErrorHandling
        )({

            /**
             * Authenticates a user and returns a token.
             *
             * @param _ - The parent resolver object (unused).
             * @param args - The arguments containing the login input.
             * @returns The login response containing user data and token.
             */
            login: composeResolvers(
                validate(loginSchema)
            )(async (_: unknown, { input }: { input: LoginInput }) => {
                return authService.login(input);
            }),

            /**
             * Registers a new user.
             *
             * @param _ - The parent resolver object (unused).
             * @param args - The arguments containing the sign-up input.
             * @returns The sign-up response.
             */
            signUp: composeResolvers(
                validate(signUpSchema)
            )(async (_: unknown, { input }: { input: SignUpInput }) => {
                return authService.signup(input);
            }),

            /**
             * Verifies a user's registration OTP.
             *
             * @param _ - The parent resolver object (unused).
             * @param args - The arguments containing the OTP verification input.
             * @returns The verification response.
             */
            verifyOtpRegistration: composeResolvers(
                validate(verifyOtpRegistrationSchema)
            )(async (_: unknown, { input }: { input: VerifyOtpRegistrationInput }) => {
                return authService.verifyOtpRegistration(input);
            }),

            /**
             * Resends the registration OTP to the user.
             *
             * @param _ - The parent resolver object (unused).
             * @param args - The arguments containing the resend OTP input.
             * @returns The resend OTP response.
             */
            resendOtpSignUp: composeResolvers(
                validate(resendOtpSchema)
            )(async (_: unknown, { input }: { input: ResendOtpInput }) => {
                return authService.resendOtpSignUp(input);
            }),

            /**
             * Resends the password recovery OTP to the user.
             *
             * @param _ - The parent resolver object (unused).
             * @param args - The arguments containing the resend OTP input.
             * @returns The resend OTP response.
             */
            resendOtpForgotPassword: composeResolvers(
                validate(resendOtpSchema)
            )(async (_: unknown, { input }: { input: ResendOtpInput }) => {
                return authService.resendOtpForgotPassword(input);
            }),

            /**
             * Initiates the password recovery process.
             *
             * @param _ - The parent resolver object (unused).
             * @param args - The arguments containing the forgot password input.
             * @returns The forgot password response.
             */
            forgotPassword: composeResolvers(
                validate(forgotPasswordSchema)
            )(async (_: unknown, { input }: { input: ForgotPasswordInput }) => {
                return authService.forgotPassword(input);
            }),

            /**
             * Verifies the password recovery OTP.
             *
             * @param _ - The parent resolver object (unused).
             * @param args - The arguments containing the OTP verification input.
             * @returns The verification response.
             */
            verifyForgotPasswordOtp: composeResolvers(
                validate(verifyForgotPasswordOtpSchema)
            )(async (_: unknown, { input }: { input: VerifyForgotPasswordOtpInput }) => {
                return authService.verifyForgotPasswordOtp(input);
            }),

        }),

        ...composeResolvers(
            protectResolvers,
            applyErrorHandling
        )({

            /**
             * Changes the authenticated user's password.
             *
             * @param _ - The parent resolver object (unused).
             * @param args - The arguments containing the change password input.
             * @returns The change password response.
             */
            changePassword: composeResolvers(
                validate(changePasswordSchema)
            )(async (_: unknown, { input }: { input: ChangePasswordInput }) => {
                return authService.changePassword(input);
            }),

        }),
    }

}