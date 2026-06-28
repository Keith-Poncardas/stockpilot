import { GraphQLContext } from "@/types";
import { authService } from "./auth.service";
import { protectResolvers } from "@/graphql/helpers";
import { ChangePasswordInput, LoginInput, ResendOtpInput, SignUpInput, VerifyOtpInput } from "./auth.validation";
import { throwUnauthorized } from "@/utils";

export const authResolver = {

    Query: protectResolvers({

        /**
         * Get current authenticated user
         */
        me: async (_: unknown, __: unknown, context: GraphQLContext) => {
            return context.user;
        },

    }),

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
            { input }: { input: ChangePasswordInput },
            context: GraphQLContext
        ) => {
            if (!context.user) throwUnauthorized();
            return authService.changePassword(context.user!.id, input);
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
        verifyOtp: async (_: unknown, { input }: { input: VerifyOtpInput }) => {
            return authService.verifyOtp(input);
        },

        /**
         * Resend OTP for pending registration
         */
        resendOtp: async (_: unknown, { input }: { input: ResendOtpInput }) => {
            return authService.resendOtp(input);
        }

    }

}