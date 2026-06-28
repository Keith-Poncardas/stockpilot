import { prisma } from "@/lib";
import { generateToken, throwBadInput, throwUnauthorized, requireValidUserAccess, generateOtp } from "@/utils";
import * as argon2 from "argon2";
import { ChangePasswordInput, changePasswordSchema, LoginInput, loginSchema, SignUpInput, signUpSchema, VerifyOtpInput, verifyOtpSchema, ResendOtpInput, resendOtpSchema } from "./auth.validation";
import { Prisma, UserStatus } from "@prisma/client";

export class AuthService {

    /**
     * Select user model properties
     */
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
     * User login (login user) and return user and token 
     */
    async login(input: LoginInput) {

        const { email, password } = loginSchema.parse(input);

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) throwUnauthorized("Invalid email or password");

        const validPassword = await argon2.verify(user.passwordHash, password);

        if (!validPassword) throwUnauthorized("Invalid email or password");

        requireValidUserAccess(user);

        const token = generateToken({
            userId: user.id,
            email: user.email,
            tokenVersion: user.tokenVersion
        });

        const { passwordHash, tokenVersion, ...userWithoutPassword } = user;

        return {
            user: userWithoutPassword,
            token
        };

    }

    async signup(input: SignUpInput) {
        const {
            firstName,
            lastName,
            email,
            password
        } = signUpSchema.parse(input);

        // 1. Check if user is already fully registered
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) throwBadInput("Email is already registered");

        // 2. Hash password and generate OTP
        const hashedPassword = await argon2.hash(password);
        const otp = generateOtp();
        const hashedOtp = await argon2.hash(otp);

        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 15); // Valid for 15 mins

        // 3. Upsert pending registration (overwrites if they request again)
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

        // TODO: In a real app, you would send the `otp` via email here.
        // For development/testing, we log it:
        console.log(`[DEV ONLY] OTP for ${email}: ${otp}`);

        return pending;
    }

    /**
     * Verify OTP and complete registration
     */
    async verifyOtp(input: VerifyOtpInput) {
        const { email, otp } = verifyOtpSchema.parse(input);

        // 1. Find pending registration
        const pending = await prisma.pendingRegistration.findUnique({
            where: { email },
        });

        if (!pending) throwBadInput("No pending registration found for this email");

        // 2. Check if expired
        if (pending.expiresAt < new Date()) {
            throwBadInput("OTP has expired. Please request a new one.");
        }

        // 3. Verify OTP
        const validOtp = await argon2.verify(pending.otpHash, otp);
        if (!validOtp) throwBadInput("Invalid OTP");

        // 4 & 5. Create actual user and delete pending registration in a transaction
        const [newUser] = await prisma.$transaction([
            prisma.user.create({
                data: {
                    firstName: pending.firstName,
                    lastName: pending.lastName,
                    email: pending.email,
                    passwordHash: pending.passwordHash,
                    status: UserStatus.ACTIVE,
                },
            }),
            prisma.pendingRegistration.delete({
                where: { id: pending.id },
            })
        ]);

        // 6. Generate auth token and return
        const token = generateToken({
            userId: newUser.id,
            email: newUser.email,
            tokenVersion: newUser.tokenVersion
        });

        const { passwordHash, tokenVersion, ...userWithoutPassword } = newUser;

        return {
            user: userWithoutPassword,
            token
        };
    }

    /**
     * Resend OTP for pending registration
     */
    async resendOtp(input: ResendOtpInput) {
        const { email } = resendOtpSchema.parse(input);

        // 1. Check if they are already fully registered
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) throwBadInput("Email is already registered");

        // 2. Check if there's a pending registration
        const pending = await prisma.pendingRegistration.findUnique({
            where: { email }
        });

        if (!pending) throwBadInput("No pending registration found. Please sign up first.");

        // 3. Generate new OTP and update
        const otp = generateOtp();
        const hashedOtp = await argon2.hash(otp);

        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 15);

        const updatedPending = await prisma.pendingRegistration.update({
            where: { email },
            data: {
                otpHash: hashedOtp,
                expiresAt
            }
        });

        console.log(`[DEV ONLY] Resent OTP for ${email}: ${otp}`);

        return updatedPending;
    }

    /**
     * Change user password (requires current password)
     */
    async changePassword(userId: string, input: ChangePasswordInput) {
        const {
            oldPassword,
            newPassword,
        } = changePasswordSchema.parse(input);

        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user) throwBadInput("User not found");

        const validateOldPassword = await argon2.verify(
            user.passwordHash,
            oldPassword
        );

        if (!validateOldPassword)
            throwBadInput("Invalid old password");

        const validateNewPassword = await argon2.verify(
            user.passwordHash,
            newPassword
        );

        if (validateNewPassword)
            throwBadInput("New password is same as old password");

        const hashedNewPassword = await argon2.hash(newPassword);

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                passwordHash: hashedNewPassword,
                tokenVersion: {
                    increment: 1
                }
            },
            select: this.select,
        });

        const token = generateToken({
            userId: updatedUser.id,
            email: updatedUser.email,
            tokenVersion: updatedUser.tokenVersion,
        });

        const { tokenVersion, ...updatedWithoutTokenVersion } = updatedUser;

        return {
            user: updatedWithoutTokenVersion,
            token
        };
    }

}

export const authService = new AuthService();