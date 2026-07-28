import { cn } from '@/lib/utils'

// ─── Color tokens ─────────────────────────────────────────────────────────────
// Each token defines the pill bg/text/border and the indicator dot color.
// To add a new status: add a single entry here — nothing else needs to change.

interface BadgeToken {
    pill: string
    dot: string
}

const BADGE_TOKENS: Record<string, BadgeToken> = {
    // ── Product ────────────────────────────────────────────────────────────────
    ACTIVE:       { pill: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25', dot: 'bg-emerald-400' },
    INACTIVE:     { pill: 'bg-gray-500/15 text-gray-400 border-gray-500/20',          dot: 'bg-gray-400' },
    DRAFT:        { pill: 'bg-amber-500/15 text-amber-400 border-amber-500/25',        dot: 'bg-amber-400' },
    DISCONTINUED: { pill: 'bg-red-500/15 text-red-400 border-red-500/20',             dot: 'bg-red-400' },
    ARCHIVED:     { pill: 'bg-slate-500/15 text-slate-400 border-slate-500/20',       dot: 'bg-slate-400' },

    // ── Inventory / stock ──────────────────────────────────────────────────────
    WELL_STOCKED: { pill: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25', dot: 'bg-emerald-400' },
    LOW_STOCK:    { pill: 'bg-amber-500/15 text-amber-400 border-amber-500/25',        dot: 'bg-amber-400' },
    CRITICAL_OUT: { pill: 'bg-red-500/15 text-red-400 border-red-500/20',             dot: 'bg-red-400' },

    // ── User account ───────────────────────────────────────────────────────────
    SUSPENDED:    { pill: 'bg-pink-500/15 text-pink-400 border-pink-500/20',          dot: 'bg-pink-400' },
    TERMINATED:   { pill: 'bg-red-500/15 text-red-400 border-red-500/20',             dot: 'bg-red-400' },

    // ── Approval ───────────────────────────────────────────────────────────────
    PENDING:      { pill: 'bg-orange-500/15 text-orange-400 border-orange-500/20',    dot: 'bg-orange-400' },
    APPROVED:     { pill: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25', dot: 'bg-emerald-400' },
    REJECTED:     { pill: 'bg-red-500/15 text-red-400 border-red-500/20',             dot: 'bg-red-400' },

    // ── Roles ──────────────────────────────────────────────────────────────────
    SUPER_ADMIN:  { pill: 'bg-violet-500/15 text-violet-400 border-violet-500/20',    dot: 'bg-violet-400' },
    ADMIN:        { pill: 'bg-rose-500/15 text-rose-400 border-rose-500/20',          dot: 'bg-rose-400' },
    MANAGER:      { pill: 'bg-blue-500/15 text-blue-400 border-blue-500/20',          dot: 'bg-blue-400' },
    CASHIER:      { pill: 'bg-teal-500/15 text-teal-400 border-teal-500/20',          dot: 'bg-teal-400' },
    UNASSIGNED:   { pill: 'bg-amber-500/15 text-amber-400 border-amber-500/25',       dot: 'bg-amber-400' },

    // ── Sales ──────────────────────────────────────────────────────────────────
    COMPLETED:    { pill: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25', dot: 'bg-emerald-400' },
    REFUNDED:     { pill: 'bg-sky-500/15 text-sky-400 border-sky-500/20',             dot: 'bg-sky-400' },
    VOIDED:       { pill: 'bg-gray-500/15 text-gray-400 border-gray-500/20',          dot: 'bg-gray-400' },
    CANCELLED:    { pill: 'bg-red-500/15 text-red-400 border-red-500/20',             dot: 'bg-red-400' },

    // ── Entity / profile ───────────────────────────────────────────────────────
    CUSTOMER:     { pill: 'bg-emerald-500/15 text-emerald-600 border-emerald-500/30', dot: 'bg-emerald-500' },
    USER:         { pill: 'bg-blue-500/15 text-blue-600 border-blue-500/30',          dot: 'bg-blue-500' },

    // ── Fallback ───────────────────────────────────────────────────────────────
    DEFAULT:      { pill: 'bg-gray-500/15 text-gray-400 border-gray-500/20',          dot: 'bg-gray-400' },
}

// ─── Size scale ────────────────────────────────────────────────────────────────

const SIZE_CLASSES = {
    sm: { pill: 'px-2 py-0.5 text-[10px] gap-1',    dot: 'w-1 h-1' },
    md: { pill: 'px-2.5 py-1 text-xs gap-1.5',       dot: 'w-1.5 h-1.5' },
    lg: { pill: 'px-3 py-1.5 text-sm gap-2',          dot: 'w-2 h-2' },
} as const

export type BadgeSize = keyof typeof SIZE_CLASSES

// Expose the full union for consumer typing convenience — but plain string is
// also accepted so callers don't need to cast arbitrary API values.
export type BadgeVariant =
    | 'ACTIVE' | 'INACTIVE' | 'DRAFT' | 'DISCONTINUED' | 'ARCHIVED'
    | 'WELL_STOCKED' | 'LOW_STOCK' | 'CRITICAL_OUT'
    | 'SUSPENDED' | 'TERMINATED'
    | 'PENDING' | 'APPROVED' | 'REJECTED'
    | 'SUPER_ADMIN' | 'ADMIN' | 'MANAGER' | 'CASHIER' | 'UNASSIGNED'
    | 'CUSTOMER' | 'USER'
    | (string & {})

// ─── Component ────────────────────────────────────────────────────────────────

export interface StatusBadgeProps {
    /** The status/role string — matched case-insensitively against the token map. */
    value: BadgeVariant
    /** Display label. Defaults to `value` with underscores replaced by spaces. */
    label?: string
    /** Visual size scale. @default 'md' */
    size?: BadgeSize
    /** Show the coloured dot indicator. @default true */
    withDot?: boolean
    /** Optional icon to render inside the badge instead of or alongside the dot */
    icon?: React.ReactNode
    /** Extra classes applied to the outer pill element. */
    className?: string
}

/**
 * StatusBadge — reusable, configurable pill-style badge for any status or role.
 *
 * @example
 * <StatusBadge value="ACTIVE" />
 * <StatusBadge value="LOW_STOCK" size="sm" />
 * <StatusBadge value="PENDING" label="Awaiting Review" size="lg" />
 * <StatusBadge value="SUPER_ADMIN" withDot={false} />
 */
export function StatusBadge({
    value,
    label,
    size = 'md',
    withDot = true,
    icon,
    className,
}: StatusBadgeProps) {
    const key = (value ?? '').toUpperCase()
    const token = BADGE_TOKENS[key] ?? BADGE_TOKENS.DEFAULT
    const sz = SIZE_CLASSES[size]
    const displayLabel = label ?? value?.replace(/_/g, ' ')

    return (
        <span
            className={cn(
                'inline-flex items-center rounded-full border font-semibold',
                sz.pill,
                token.pill,
                className,
            )}
        >
            {icon && <span className="shrink-0">{icon}</span>}
            {withDot && !icon && (
                <span className={cn('rounded-full shrink-0', sz.dot, token.dot)} />
            )}
            {displayLabel}
        </span>
    )
}
