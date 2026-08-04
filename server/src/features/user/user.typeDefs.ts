export const userTypeDefs = `#graphql

    # User role enum
    enum UserRole {
        UNASSIGNED
        SUPER_ADMIN
        ADMIN
        MANAGER
        CASHIER
    }

    # User status enum
    enum UserStatus {
        INACTIVE
        ACTIVE
        SUSPENDED
        TERMINATED
    }

      # Approval status enum
    enum UserApprovalStatus {
        PENDING
        APPROVED
        REJECTED
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

    # User type
    type User {
        id: ID!
        firstName: String!
        lastName: String!
        email: String!
        role: UserRole!
        status: UserStatus!
        approvalStatus: UserApprovalStatus!
        createdAt: String!
        updatedAt: String!

        # Operation Summary
        salesProcessedCount: Int
        stockMovementsProcessedCount: Int
    }

    # User Metrics Type
    type UserMetrics {
        total: Int!
        active: Int!
        pendingApproval: Int!
    }

    # Paginated user response
    type PaginatedUser {
        data: [User!]!
        meta: Pagination!
    }

    # Filter input for getUsers
    input GetUsersFilterInput {
        search: String
        role: UserRole
        status: UserStatus
        approvalStatus: UserApprovalStatus
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

    # Update user status input
    input UpdateUserStatusInput {
        userId: ID!
        status: UserStatus!
    }

    # Change user approval status input
    input ApproveRejectUserInput {
        userId: ID!
        approvalStatus: UserApprovalStatus!
    }

    # Assign role input
    input AssignRoleInput {
        userId: ID!
        role: UserRole!
    }

    # Query type
    type Query {
        getUser(userId: ID!): User!
        getUsers(args: GetUsersInput!): PaginatedUser
        getUserMetrics: UserMetrics!
    }

    # Mutation type
    type Mutation {
        changeUserStatus(input: UpdateUserStatusInput!): User
        approveRejectUser(input: ApproveRejectUserInput!): User
        assignRole(input: AssignRoleInput!): User
    }

`;
