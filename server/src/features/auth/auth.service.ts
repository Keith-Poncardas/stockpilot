import { prisma } from "@/lib";
import { generateToken, throwBadInput, throwUnauthorized } from "@/utils";
import * as argon2 from "argon2";
import { ChangePasswordInput, changePasswordSchema, LoginInput, loginSchema } from "./auth.validation";
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

        if (user.status !== UserStatus.ACTIVE) throwUnauthorized(
            `Your account is ${user.status.toLowerCase()}. Please contact the administrator.`
        );

        const validPassword = await argon2.verify(user.passwordHash, password);

        if (!validPassword) throwUnauthorized("Invalid email or password");

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