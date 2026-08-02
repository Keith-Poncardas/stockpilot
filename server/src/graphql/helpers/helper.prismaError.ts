import { Prisma } from "@prisma/client";
import { GraphQLError } from "graphql/error/GraphQLError";
import { throwConflict, throwGraphQLError, throwNotFound } from "@/utils";

enum PrismaErrorCode {
    UNIQUE_CONSTRAINT_VIOLATION = "P2002",
    FOREIGN_KEY_VIOLATION = "P2003",
    RECORD_NOT_FOUND = "P2025",
}

export function mapPrismaError(error: unknown): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
        switch (error.code) {
            case PrismaErrorCode.UNIQUE_CONSTRAINT_VIOLATION:
                throwConflict("Resource already exists.", {
                    target: error.meta?.target,
                });

            case PrismaErrorCode.FOREIGN_KEY_VIOLATION:
                throwGraphQLError("Referenced record does not exist.", "BAD_REQUEST");

            case PrismaErrorCode.RECORD_NOT_FOUND:
                throwNotFound("Record");

            default:
                throwGraphQLError(error.message, error.code);
        }
    }

    if (error instanceof Prisma.PrismaClientValidationError) {
        throwGraphQLError("Invalid database query.", "BAD_REQUEST");
    }

    if (error instanceof GraphQLError) {
        throw error;
    }

    throwGraphQLError("Internal Server Error", "INTERNAL_SERVER_ERROR");
}
