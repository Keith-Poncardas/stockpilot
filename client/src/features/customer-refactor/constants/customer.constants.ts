export const CustomerOrderBy = {
    createdAt: 'createdAt',
    firstName: 'firstName',
    lastName:  'lastName',
} as const;

export type CustomerOrderBy = (typeof CustomerOrderBy)[keyof typeof CustomerOrderBy];

/**
 * Tailwind CSS class mapping for Customer Avatars.
 * Defines styling for registered Customers and Walk-in transactions.
 */
export const CUSTOMER_AVATAR_COLORS: Record<string, string> = {
    CUSTOMER: "bg-blue-50 text-blue-600 border border-blue-100",
    WALK_IN: "bg-slate-100 text-slate-500 border border-slate-200",
};

/**
 * Tailwind CSS class mapping for Customer Name text in table cells.
 */
export const CUSTOMER_TEXT_COLORS: Record<string, string> = {
    CUSTOMER: "text-slate-700 font-medium",
    WALK_IN: "text-slate-400 italic",
};
