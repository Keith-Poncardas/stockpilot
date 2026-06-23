import "dotenv/config";
import express from "express";
import cors from "cors";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express4";
import { resolvers, typeDefs } from "@/graphql";
import { createContext } from "@/context";

async function bootstrap() {
    const app = express();
    const port = process.env.PORT || 4000;

    /**
     * Apollo Server configuration
     */
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        formatError: (error) => {
            console.error("GraphQL Error:", error);
            return {
                message: error.message,
                extensions: {
                    code: error.extensions?.code || "INTERNAL_SERVER_ERROR",
                },
            };
        },
    });

    await server.start();

    /**
     * CORS configuration
     */
    app.use(
        cors({
            origin: process.env.CORS_ORIGIN || "http://localhost:5173",
            credentials: true,
        }),
    );

    /**
     * JSON body parsing
     */
    app.use(express.json());

    /**
     * GraphQL endpoint
     */
    app.use(
        "/graphql",
        expressMiddleware(server, {
            context: createContext,
        }) as any,
    );

    /**
     * Health check endpoint
     */
    app.get("/health", (_, res) => {
        res.json({ status: "ok", timestamp: new Date().toISOString() });
    });

    /**
     * Start server
     */
    app.listen(port, () => {
        console.log(`Server is running on port http://localhost:${port}`);
    });
}

/**
 * Start the server
 */
bootstrap().catch((error) => {
    console.error("Failed to start server:", error);
    process.exit(1);
});


