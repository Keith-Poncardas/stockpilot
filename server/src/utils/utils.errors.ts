import { GraphQLError } from "graphql/error/GraphQLError";

/**
 * Custom Error class for application-level errors.
 */
export class AppError extends Error {
    constructor(
        message: string,
        public code: string = 'INTERNAL_SERVER_ERROR',
        public statusCode: number = 500
    ) {
        super(message);
        this.name = 'AppError';
    }
}

/**
 * Throws a GraphQL error with the given message and code.
 */
export function throwGraphQLError(
    message: string,
    code: string = 'INTERNAL_SERVER_ERROR',
    extensions?: Record<string, unknown>
): never {
    throw new GraphQLError(message, {
        extensions: { code, ...extensions },
    });
}

/**
 * Throws a GraphQL error indicating that the requested resource was not found.
 */
export function throwNotFound(
    entity: string,
    extensions?: Record<string, unknown>
): never {
    throwGraphQLError(`${entity} not found`, 'NOT_FOUND', extensions);
}

/**
 * Throws a GraphQL error indicating that the request lacks proper authentication.
 */
export function throwUnauthorized(message: string = 'Not authenticated'): never {
    throwGraphQLError(message, 'UNAUTHENTICATED');
}

/**
 * Throws a GraphQL error indicating that the request lacks proper authorization.
 */
export function throwForbidden(message: string = 'Not authorized'): never {
    throwGraphQLError(message, 'FORBIDDEN');
}

/**
 * Throws a GraphQL error indicating that the request contains invalid input.
 */
export function throwBadInput(
    message: string,
    extensions?: Record<string, unknown>
): never {
    throwGraphQLError(message, 'BAD_USER_INPUT', extensions);
}

/**
 * Throws a GraphQL error indicating that the request contains invalid input.
 */
export function throwConflict(
    message: string,
    extensions?: Record<string, unknown>
): never {
    throwGraphQLError(message, 'CONFLICT', extensions);
}