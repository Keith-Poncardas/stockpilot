export const userTypeDefs = `#graphql

    # User role enum
    enum UserRole {
        SUPER_ADMIN
        ADMIN
        MANAGER
        CASHIER
        UNASSIGNED
    }

    # User status enum
    enum UserStatus {
        INACTIVE
        ACTIVE
        SUSPENDED
        TERMINATED
    }

    # Order direction enum
    enum OrderDirection {
        asc
        desc
    }

    # Order by field enum (for users)
    enum UserOrderBy {
        firstName
        lastName
        email
        createdAt
    }

    # Approval status enum
    enum ApprovalStatus {
        PENDING
        APPROVED
        REJECTED
    }

    # User type
    type User {
        id: ID!
        firstName: String!
        lastName: String!
        email: String!
        role: UserRole!
        status: UserStatus!
        approvalStatus: ApprovalStatus!
        createdAt: String!
        updatedAt: String!
    }

    # User type with computed stats (returned by getUser)
    type UserDetail {
        id: ID!
        firstName: String!
        lastName: String!
        email: String!
        role: UserRole!
        status: UserStatus!
        approvalStatus: ApprovalStatus!
        createdAt: String!
        updatedAt: String!
        salesProcessed: Int!
        stockMovementProcessed: Int!
    }

    # Pagination metadata
    type Pagination {
        page: Int!
        limit: Int!
        firstItem: Int!
        lastItem: Int!
        totalItems: Int!
        totalPages: Int!
        hasPreviousPage: Boolean!
        hasNextPage: Boolean!
    }

    # Paginated user response
    type PaginatedUser {
        data: [User!]!
        meta: Pagination!
    }

    # Response when resetting a password (includes new generated password)
    type ResetPasswordResponse {
        id: ID!
        firstName: String!
        lastName: String!
        email: String!
        role: UserRole!
        status: UserStatus!
        createdAt: String!
        updatedAt: String!
        password: String!
    }

    # Response when deleting a user
    type DeleteResult {
        action: String!
    }

    # Filter input for getUsers
    input GetUsersFilterInput {
        search: String
        role: UserRole
        status: UserStatus
        approvalStatus: ApprovalStatus
        dateFrom: String
        dateTo: String
        orderBy: UserOrderBy
        orderDirection: OrderDirection
    }

    # Paginated users query input
    input GetUsersInput {
        limit: Int
        page: Int
        filter: GetUsersFilterInput!
    }

    # Fields that can be updated on a user
    input EditUserData {
        firstName: String
        lastName: String
        email: String
        role: UserRole
        status: UserStatus
    }

    # Edit user input
    input EditUserInput {
        userId: ID!
        data: EditUserData!
    }

    # Update user status input
    input UpdateUserStatusInput {
        userId: ID!
        status: UserStatus!
    }

    # Change user approval status input
    input ApproveRejectUserInput {
        userId: ID!
        approvalStatus: ApprovalStatus!
    }

    # Assign role input
    input AssignRoleInput {
        userId: ID!
        role: UserRole!
    }

    # Query type
    type Query {
        getUser(userId: ID!): UserDetail
        getUsers(args: GetUsersInput!): PaginatedUser
    }

    # Mutation type
    type Mutation {
        modifyUser(input: EditUserInput!): User
        resetPassword(userId: ID!): ResetPasswordResponse
        changeUserStatus(input: UpdateUserStatusInput!): User
        approveRejectUser(input: ApproveRejectUserInput!): User
        assignRole(input: AssignRoleInput!): User
        deleteUser(userId: ID!): DeleteResult
    }

`;
