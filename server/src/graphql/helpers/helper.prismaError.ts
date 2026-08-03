import { Prisma } from "@prisma/client";
import { GraphQLError } from "graphql/error/GraphQLError";
import { throwConflict, throwGraphQLError, throwNotFound } from "@/utils";

enum PrismaErrorCode {
    UNIQUE_CONSTRAINT_VIOLATION = "P2002",
    FOREIGN_KEY_VIOLATION = "P2003",
    RECORD_NOT_FOUND = "P2025",
}

/**
 * Converts Prisma errors into application-specific GraphQL errors.
 *
 * This function catches common Prisma errors and throws a
 * user-friendly GraphQL error with the appropriate error code.
 * If the error is already a GraphQL error, it is rethrown
 * without modification.
 *
 * Any unknown errors are treated as internal server errors to
 * avoid exposing database details to the client.
 *
 * @param {unknown} error - The error to convert.
 * @throws {GraphQLError} Always throws a GraphQL error.
 * @returns {never} This function never returns because it always throws an error.
 */
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
