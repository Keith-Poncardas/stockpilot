import { prisma } from "@/lib";
import { GraphQLContext } from "@/types";
import { verifyToken } from "@/utils";
import { IncomingMessage } from "http";

/**
 * Create GraphQL Context
 */
export async function createContext({ req }: { req: IncomingMessage })
    : Promise<GraphQLContext> {

    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) {
        return { user: null }
    }

    const payload = verifyToken(token);

    if (!payload || !payload.userId) {
        return { user: null }
    }

    let user;
    try {
        user = await prisma.user.findUnique({
            where: {
                id: payload.userId
            }
        });
    } catch (error) {
        console.error("Context auth DB error:", error);
        return { user: null }
    }

    if (user?.tokenVersion !== payload.tokenVersion) {
        return { user: null }
    }

    const { passwordHash, tokenVersion, ...safeUser } = user;

    return { user: safeUser };
}