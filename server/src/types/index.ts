import { User } from '@/generated/client.js';

/**
 * JWT Payload Interface
 */
export interface JwtPayload {
    userId: string;
    email: string;
    tokenVersion: number;
}

/**
 * Safe user type — Prisma User with sensitive fields stripped.
 * This is what ctx.auth.ts returns after removing passwordHash and tokenVersion.
 */
export type SafeUser = Omit<User, "passwordHash" | "tokenVersion">;

/**
 * GraphQL Context Interface
 */
export interface GraphQLContext {
    user: SafeUser | null;
}
