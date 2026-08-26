export const CustomerOrderBy = {
    createdAt: 'createdAt',
    firstName: 'firstName',
    lastName:  'lastName',
} as const;

export type CustomerOrderBy = (typeof CustomerOrderBy)[keyof typeof CustomerOrderBy];
