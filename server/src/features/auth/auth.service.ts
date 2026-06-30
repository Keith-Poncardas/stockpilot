import { prisma, mailer } from "@/lib";
import { generateOtpEmailHtml, OtpEmailType } from "./templates/otpEmail";
import { generateToken, throwBadInput, throwUnauthorized, requireValidUserAccess, generateOtp, throwNotFound } from "@/utils";
import * as argon2 from "argon2";
import { ChangePasswordInput, changePasswordSchema, LoginInput, loginSchema, SignUpInput, signUpSchema, ResendOtpInput, resendOtpSchema, ForgotPasswordInput, forgotPasswordSchema, VerifyOtpRegistrationInput, verifyOtpRegistrationSchema, VerifyForgotPasswordOtpInput, verifyForgotPasswordOtpSchema } from "./auth.validation";
import { Prisma } from "@prisma/client";

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
     * Reusable helper to send OTP emails
     */
    private async sendOtpEmail(email: string, firstName: string, otp: string, subject: string, type: OtpEmailType = 'signup') {
        if (process.env.NODE_ENV === 'development') {
            console.log(`[DEVELOPMENT] OTP for ${email}: ${otp}`);
            return;
        }

        try {
            const info = await mailer.sendMail({
                from: `"StockPilot" <${process.env.SMTP_EMAIL}>`,
                to: email,
                subject,
                html: generateOtpEmailHtml(otp, firstName, type),
            });
            console.log("Email sent successfully! Message ID:", info.messageId);
            return info;
        } catch (error) {
            console.error("Failed to send email with Nodemailer:", error);
            // Non-blocking error
        }
    }

    /**
     * Enforce a 60-second cooldown between OTP requests.
     */
    private checkOtpRateLimit(expiresAt: Date) {
        // Since expiresAt is always set to exactly 15 mins after generation, we can deduce the generation time
        const otpGeneratedAt = new Date(expiresAt.getTime() - 15 * 60 * 1000);
        const msSinceLastOtp = Date.now() - otpGeneratedAt.getTime();

        if (msSinceLastOtp < 60000) {
            const secondsLeft = Math.ceil((60000 - msSinceLastOtp) / 1000);
            throwBadInput(`Please wait ${secondsLeft} seconds before requesting a new OTP.`);
        }
    }

    /**
     * Check if OTP has expired
     */
    private checkOtpExpiration(expiresAt: Date) {
        if (expiresAt < new Date()) {
            throwBadInput("OTP has expired. Please request a new one.");
        }
    }

    /**
     * Generate OTP, hash it, and set expiration time (15 mins)
     */
    private async generateOtpData() {
        const otp = generateOtp();
        const hashedOtp = await argon2.hash(otp);
        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 15);
        return { otp, hashedOtp, expiresAt };
    }

    /**
     * Core reusable logic to handle OTP resend
     */
    private async processOtpResend(
        email: string,
        firstName: string,
        currentExpiresAt: Date,
        updateRecordFn: (email: string, otpHash: string, newExpiresAt: Date) => Promise<any>,
        emailSubject: string,
        emailType: OtpEmailType
    ) {
        this.checkOtpRateLimit(currentExpiresAt);

        const { otp, hashedOtp, expiresAt: newExpiresAt } = await this.generateOtpData();

        const updatedRecord = await updateRecordFn(email, hashedOtp, newExpiresAt);

        await this.sendOtpEmail(email, firstName, otp, emailSubject, emailType);

        return updatedRecord;
    }

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

        requireValidUserAccess(user, { allowInactiveOrUnassigned: true });

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

    /**
     * User signup (register user)
     */
    async signup(input: SignUpInput) {
        const {
            firstName,
            lastName,
            email,
            password
        } = signUpSchema.parse(input);

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) throwBadInput("Email is already registered");

        const hashedPassword = await argon2.hash(password);
        const { otp, hashedOtp, expiresAt } = await this.generateOtpData();

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

        await this.sendOtpEmail(
            email,
            firstName,
            otp,
            'Your StockPilot Verification Code',
            'signup'
        );

        return pending;
    }

    /**
     * Verify OTP and complete registration
     */
    async verifyOtpRegistration(input: VerifyOtpRegistrationInput) {
        const { email, otp } = verifyOtpRegistrationSchema.parse(input);

        const pending = await prisma.pendingRegistration.findUnique({
            where: { email },
        });

        if (!pending) throwBadInput("No pending registration found for this email");

        this.checkOtpExpiration(pending.expiresAt);
        const validOtp = await argon2.verify(pending.otpHash, otp);
        if (!validOtp) throwBadInput("Invalid OTP");

        const [newUser] = await prisma.$transaction([
            prisma.user.create({
                data: {
                    firstName: pending.firstName,
                    lastName: pending.lastName,
                    email: pending.email,
                    passwordHash: pending.passwordHash
                },
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

        const { passwordHash, tokenVersion, ...userWithoutPassword } = newUser;

        return {
            user: userWithoutPassword,
            token
        };
    }

    /**
     * Resend OTP for pending registration
     */
    async resendOtpSignUp(input: ResendOtpInput) {
        const { email } = resendOtpSchema.parse(input);

        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) throwBadInput("Email is already registered");

        const pending = await prisma.pendingRegistration.findUnique({
            where: { email }
        });

        if (!pending) throwBadInput("No pending registration found. Please sign up first.");

        return this.processOtpResend(
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
     * Resend OTP for forgot password
     */
    async resendOtpForgotPassword(input: ResendOtpInput) {
        const { email } = resendOtpSchema.parse(input);

        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) throwNotFound("User not found");

        const resetRecord = await prisma.passwordReset.findUnique({
            where: { email }
        });

        if (!resetRecord) throwBadInput(
            "No password reset request found. Please request a new one."
        );

        return this.processOtpResend(
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
     * Request forgot password OTP
     */
    async forgotPassword(input: ForgotPasswordInput) {
        const { email } = forgotPasswordSchema.parse(input);

        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) throwNotFound("Email");

        // Check rate limit if there's an existing password reset request
        const existingReset = await prisma.passwordReset.findUnique({
            where: { email }
        });

        if (existingReset) {
            this.checkOtpRateLimit(existingReset.expiresAt);
        }

        const { otp, hashedOtp, expiresAt } = await this.generateOtpData();

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

        // FOR PRODUCTION ONLY
        await this.sendOtpEmail(
            email,
            user.firstName,
            otp,
            'Your Password Reset Code',
            'forgot_password'
        );

        return passReset;
    }

    /**
     * Verify OTP for forgot password request
     */
    async verifyForgotPasswordOtp(input: VerifyForgotPasswordOtpInput) {
        const { email, otp } = verifyForgotPasswordOtpSchema.parse(input);

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

        this.checkOtpExpiration(resetRecord.expiresAt);

        const validOtp = await argon2.verify(resetRecord.otpHash, otp);
        if (!validOtp) throwBadInput("Invalid OTP");

        return {
            id: resetRecord.id,
            email: email
        };
    }

    /**
     * Change user password (requires current password)
     */
    async changePassword(input: ChangePasswordInput) {
        const {
            email,
            newPassword,
        } = changePasswordSchema.parse(input);

        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) throwBadInput("User");

        const validateNewPassword = await argon2.verify(
            user.passwordHash,
            newPassword
        );

        if (validateNewPassword)
            throwBadInput("New password is same as old password");

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