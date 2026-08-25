/**
 * Tailwind CSS class mapping for User Roles.
 * Used to apply background and text colors to role badges.
 */
export const ROLE_COLORS: Record<string, string> = {
    UNASSIGNED: 'bg-amber-100 text-amber-700',
    SUPER_ADMIN: 'bg-violet-100 text-violet-700',
    ADMIN: 'bg-rose-100 text-rose-700',
    MANAGER: 'bg-blue-100 text-blue-700',
    CASHIER: 'bg-emerald-100 text-emerald-700',
    DEFAULT: 'bg-amber-100 text-amber-700'
};

/**
 * Tailwind CSS class mapping for User Approval Statuses.
 * Used to apply background and text colors to approval badges.
 */
export const APPROVAL_STATUS_COLORS: Record<string, string> = {
    APPROVED: 'bg-green-100 text-green-700',
    REJECTED: 'bg-red-100 text-red-700',
    PENDING: 'bg-amber-100 text-amber-700',
    DEFAULT: 'bg-zinc-100 text-zinc-700'
};

/**
 * Tailwind CSS class mapping for left-border highlight colors
 * based on User Approval Statuses using the 'before' pseudo-element.
 */
export const APPROVAL_BORDER_COLORS: Record<string, string> = {
    APPROVED: 'before:bg-green-500',
    REJECTED: 'before:bg-red-500',
    PENDING: 'before:bg-amber-500',
    DEFAULT: 'before:bg-amber-500'
};

/**
 * Tailwind CSS class mapping for User Account Statuses.
 * Used to apply background and text colors to status badges.
 */
export const STATUS_COLORS: Record<string, string> = {
    ACTIVE: 'bg-teal-100 text-teal-700',
    PENDING: 'bg-orange-100 text-orange-700',
    SUSPENDED: 'bg-pink-100 text-pink-700',
    INACTIVE: 'bg-slate-100 text-slate-700',
    TERMINATED: 'bg-red-100 text-red-700',
    DEFAULT: 'bg-gray-100 text-gray-700'
};