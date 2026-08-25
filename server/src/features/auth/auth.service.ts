import { prisma } from "@/lib";
import {
    generateToken,
    throwBadInput,
    throwUnauthorized,
    requireValidUserAccess,
    omit
} from "@/utils";
import * as argon2 from "argon2";
import { Prisma } from '@/generated/client.js';
import {
    sendOtpEmail,
    checkOtpRateLimit,
    checkOtpExpiration,
    generateOtpData,
    processOtpResend,
    verifyHash
} from "./auth.utils";
import {
    ChangePasswordInput,
    ForgotPasswordInput,
    LoginInput,
    ResendOtpInput,
    SignUpInput,
    VerifyForgotPasswordOtpInput,
    VerifyOtpRegistrationInput
} from "./types";

export class AuthService {

    private select = {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        status: true,
        tokenVersion: true,
        createdAt: true,
        updatedAt: true,
    } satisfies Prisma.UserSelect;

    /**
     * Validates a user's credentials and access rights.
     *
     * This method searches the database for a user matching the provided email.
     * It then verifies the provided password against the user's stored hash.
     * Finally, it checks if the user has valid access rights.
     *
     * @async
     * @param {string} email - The email address of the user.
     * @param {string} password - The plain text password of the user.
     * @returns {Promise<import('@/generated/client.js').User>} The validated user record.
     * @throws {Error} If the user is not found, password is invalid, or access is denied.
     */
    private async ensureUserIsValid(email: string, password: string) {

        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) throwUnauthorized("Invalid email or password");

        await verifyHash(
            user.passwordHash,
            password,
            () => throwUnauthorized("Invalid email or password")
        );

        requireValidUserAccess(user, { allowInactiveOrUnassigned: true });

        return user;
    }

    /**
     * Ensures that an email address is not already registered.
     *
     * This method searches the database for a user with the given email.
     * If a user is found, it throws a Bad Input error indicating the email
     * is already in use.
     *
     * @async
     * @param {string} email - The email address to check.
     * @returns {Promise<void>} Resolves if the email is not registered.
     * @throws {Error} If the email is already registered.
     */
    private async ensureEmailNotRegistered(email: string) {
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) throwBadInput("Email is already registered");
    }

    /**
     * Retrieves a pending registration record by email.
     *
     * This method searches the database for a pending registration matching
     * the provided email. If no record is found, it throws a Bad Input error.
     *
     * @async
     * @param {string} email - The email address associated with the pending registration.
     * @returns {Promise<import('@/generated/client.js').PendingRegistration>} The pending registration record.
     * @throws {Error} If no pending registration is found for the email.
     */
    private async ensurePendingRegistrationExists(email: string) {
        const pending = await prisma.pendingRegistration.findUnique({
            where: { email },
        });

        if (!pending) throwBadInput(
            "No pending registration found for this email"
        );

        return pending;
    }

    /**
     * Retrieves a password reset record by email.
     *
     * This method searches the database for a password reset request matching
     * the provided email. If no record is found, it throws a Bad Input error.
     *
     * @async
     * @param {string} email - The email address associated with the password reset request.
     * @returns {Promise<import('@/generated/client.js').PasswordReset>} The password reset record.
     * @throws {Error} If no password reset request is found for the email.
     */
    private async ensurePasswordResetRecordExists(email: string) {
        const resetRecord = await prisma.passwordReset.findUnique({
            where: { email }
        });

        if (!resetRecord) throwBadInput(
            "No password reset request found. Please request a new one."
        );

        return resetRecord;
    }

    /**
     * Retrieves a user record by email.
     *
     * This method searches the database for a user matching the provided email.
     * If no user is found, it throws a Bad Input error.
     *
     * @async
     * @param {string} email - The email address of the user to retrieve.
     * @returns {Promise<import('@/generated/client.js').User>} The user record.
     * @throws {Error} If no user is found for the email.
     */
    private async ensureUserExists(email: string) {
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) throwBadInput("No user found");

        return user;
    }

    /**
     * Checks and retrieves specific fields of a password reset record by email.
     *
     * This method searches the database for a password reset request matching
     * the provided email and selects specific fields (id, expiresAt, otpHash).
     * If no record is found, it throws a Bad Input error.
     *
     * @async
     * @param {string} email - The email address associated with the password reset request.
     * @returns {Promise<{id: string, expiresAt: Date, otpHash: string}>} The selected fields of the password reset record.
     * @throws {Error} If no password reset request is found for the email.
     */
    private async checkResetRecord(email: string) {
        const resetRecord = await prisma.passwordReset.findUnique({
            where: { email },
            select: {
                id: true,
                expiresAt: true,
                otpHash: true,
            }
        });

        if (!resetRecord) throwBadInput(
            "No password reset request found for this email"
        );

        return resetRecord;
    }

    /**
     * Authenticates a user and generates an access token.
     *
     * This method validates the user's credentials and, upon success,
     * generates a JWT access token. It returns the user object (excluding
     * sensitive fields) and the generated token.
     *
     * @async
     * @param {LoginInput} input - The login credentials (email and password).
     * @returns {Promise<{user: Partial<import('@/generated/client.js').User>, token: string}>} The authenticated user object and access token.
     * @throws {Error} If authentication fails.
     */
    async login(input: LoginInput) {

        const { email, password } = input;

        const user = await this.ensureUserIsValid(email, password);

        const token = generateToken({
            userId: user.id,
            email: user.email,
            tokenVersion: user.tokenVersion
        });

        const userWithoutPassword = omit(user, [
            "passwordHash",
            "tokenVersion"
        ]);

        return {
            user: userWithoutPassword,
            token
        };

    }

    /**
     * Initiates the user registration process.
     *
     * This method ensures the email is not already registered, hashes the password,
     * generates an OTP, creates or updates a pending registration record, and sends
     * the OTP via email.
     *
     * @async
     * @param {SignUpInput} input - The user's sign-up details.
     * @returns {Promise<import('@/generated/client.js').PendingRegistration>} The created or updated pending registration record.
     * @throws {Error} If the email is already registered or other errors occur during the process.
     */
    async signup(input: SignUpInput) {
        const {
            firstName,
            lastName,
            email,
            password
        } = input;

        await this.ensureEmailNotRegistered(email);

        const hashedPassword = await argon2.hash(password);
        const { otp, hashedOtp, expiresAt } = await generateOtpData();

        const pending = await prisma.pendingRegistration.upsert({
            where: { email },
            update: {
                firstName,
                lastName,
                passwordHash: hashedPassword,
                otpHash: hashedOtp,
                expiresAt,
            },
            create: {
                firstName,
                lastName,
                email,
                passwordHash: hashedPassword,
                otpHash: hashedOtp,
                expiresAt,
            },
        });

        await sendOtpEmail(
            email,
            firstName,
            otp,
            'Your StockPilot Verification Code',
            'signup'
        );

        const pendingWithoutHash = omit(pending, [
            "passwordHash",
            "otpHash"
        ]);

        return pendingWithoutHash;
    }

    /**
     * Verifies the OTP for a pending registration and creates the user account.
     *
     * This method checks the validity and expiration of the provided OTP against
     * the pending registration record. If successful, it creates a new user,
     * deletes the pending registration, and generates an access token.
     *
     * @async
     * @param {VerifyOtpRegistrationInput} input - The email and OTP for verification.
     * @returns {Promise<{user: Partial<import('@/generated/client.js').User>, token: string}>} The newly created user object and access token.
     * @throws {Error} If the pending registration is not found, or the OTP is invalid/expired.
     */
    async verifyOtpRegistration(input: VerifyOtpRegistrationInput) {
        const { email, otp } = input;

        const pending = await this.ensurePendingRegistrationExists(email);

        checkOtpExpiration(pending.expiresAt);

        await verifyHash(pending.otpHash, otp);

        const [newUser] = await prisma.$transaction([
            prisma.user.create({
                data: {
                    firstName: pending.firstName,
                    lastName: pending.lastName,
                    email: pending.email,
                    passwordHash: pending.passwordHash
                }
            }),
            prisma.pendingRegistration.delete({
                where: { id: pending.id },
            })
        ]);

        const token = generateToken({
            userId: newUser.id,
            email: newUser.email,
            tokenVersion: newUser.tokenVersion
        });

        const userWithoutPassword = omit(newUser, [
            "passwordHash",
            "tokenVersion"
        ]);

        return {
            user: userWithoutPassword,
            token
        };
    }

    /**
     * Resends the OTP for a pending sign-up registration.
     *
     * This method ensures the email is not fully registered but has a pending
     * registration. It then processes the OTP resend, generating a new OTP and
     * sending it via email.
     *
     * @async
     * @param {ResendOtpInput} input - The email address to resend the OTP to.
     * @returns {Promise<void>} Resolves when the new OTP has been sent.
     * @throws {Error} If the email is already registered or no pending registration exists.
     */
    async resendOtpSignUp(input: ResendOtpInput) {
        const { email } = input;

        await this.ensureEmailNotRegistered(email);
        const pending = await this.ensurePendingRegistrationExists(email);

        return processOtpResend(
            email,
            pending.firstName,
            pending.expiresAt,
            (email, otpHash, expiresAt) => prisma.pendingRegistration.update({
                where: { email },
                data: { otpHash, expiresAt }
            }),
            'Your StockPilot Verification Code',
            'signup'
        );
    }

    /**
     * Resends the OTP for a password reset request.
     *
     * This method ensures a user exists and a password reset record is present
     * for the given email. It then processes the OTP resend, generating a new OTP
     * and sending it via email.
     *
     * @async
     * @param {ResendOtpInput} input - The email address to resend the OTP to.
     * @returns {Promise<void>} Resolves when the new OTP has been sent.
     * @throws {Error} If the user or password reset record does not exist.
     */
    async resendOtpForgotPassword(input: ResendOtpInput) {
        const { email } = input;

        const user = await this.ensureUserExists(email);
        const resetRecord = await this.ensurePasswordResetRecordExists(email);

        return processOtpResend(
            email,
            user.firstName,
            resetRecord.expiresAt,
            (email, otpHash, expiresAt) => prisma.passwordReset.update({
                where: { email },
                data: { otpHash, expiresAt }
            }),
            'Your Password Reset Code',
            'forgot_password'
        );
    }

    /**
     * Initiates the password reset process.
     *
     * This method checks if a user exists, enforces rate limits on existing
     * reset requests, generates a new OTP, creates or updates the password reset
     * record, and sends the OTP via email.
     *
     * @async
     * @param {ForgotPasswordInput} input - The email address for the password reset.
     * @returns {Promise<{id: string, email: string}>} The created or updated password reset record's basic details.
     * @throws {Error} If the user does not exist or rate limits are exceeded.
     */
    async forgotPassword(input: ForgotPasswordInput) {
        const { email } = input;

        const user = await this.ensureUserExists(email);
        const existingReset = await this.ensurePasswordResetRecordExists(email);

        if (existingReset) {
            checkOtpRateLimit(existingReset.expiresAt);
        }

        const { otp, hashedOtp, expiresAt } = await generateOtpData();

        const passReset = await prisma.passwordReset.upsert({
            where: { email },
            update: {
                otpHash: hashedOtp,
                expiresAt
            },
            create: {
                email,
                otpHash: hashedOtp,
                expiresAt
            },
            select: {
                id: true,
                email: true
            }
        });

        await sendOtpEmail(
            email,
            user.firstName,
            otp,
            'Your Password Reset Code',
            'forgot_password'
        );

        return passReset;
    }

    /**
     * Verifies the OTP for a password reset request.
     *
     * This method checks the validity and expiration of the provided OTP against
     * the password reset record. It returns the record's details if successful,
     * which can be used to proceed with changing the password.
     *
     * @async
     * @param {VerifyForgotPasswordOtpInput} input - The email and OTP for verification.
     * @returns {Promise<{id: string, email: string}>} The validated password reset record details.
     * @throws {Error} If the password reset record is not found, or the OTP is invalid/expired.
     */
    async verifyForgotPasswordOtp(input: VerifyForgotPasswordOtpInput) {
        const { email, otp } = input;

        const resetRecord = await this.checkResetRecord(email);
        checkOtpExpiration(resetRecord.expiresAt);
        await verifyHash(resetRecord.otpHash, otp);

        return {
            id: resetRecord.id,
            email: email
        };
    }

    /**
     * Changes a user's password.
     *
     * This method verifies the user exists and the new password is not the same
     * as the old one. It then hashes the new password, updates the user's record
     * (incrementing the token version to invalidate old tokens), and deletes the
     * password reset record.
     *
     * @async
     * @param {ChangePasswordInput} input - The email and new password.
     * @returns {Promise<Partial<import('@/generated/client.js').User>>} The updated user record with selected fields.
     * @throws {Error} If the user is not found or the new password is the same as the old one.
     */
    async changePassword(input: ChangePasswordInput) {
        const {
            email,
            newPassword,
        } = input;

        const user = await this.ensureUserExists(email);

        await verifyHash(
            user.passwordHash,
            newPassword,
            () => throwBadInput("New password is same as old password")
        );

        const hashedNewPassword = await argon2.hash(newPassword);

        const [updatedUser] = await prisma.$transaction([
            prisma.user.update({
                where: { email },
                data: {
                    passwordHash: hashedNewPassword,
                    tokenVersion: {
                        increment: 1
                    }
                },
                select: this.select,
            }),
            prisma.passwordReset.delete({
                where: { email },
            })
        ])

        return updatedUser;
    }

}

export const authService = new AuthService();