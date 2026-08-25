import { UserAvatar } from '@/components/UserAvatar';
import { formatDateTime } from '@/lib/utils';

// ─── Props ────────────────────────────────────────────────────────────────────

export interface UserIdentityRowProps {
    /** User's display name */
    name: string;
    /** Initials string or user object used for the avatar fallback. Defaults to `name`. */
    fallback?: string | { firstName?: string; lastName?: string } | null;
    /** Optional avatar image URL */
    avatarSrc?: string;
    /** Role key used to tint the avatar and shown as a sub-label (e.g. "SUPER_ADMIN") */
    role?: string;
    /**
     * Timestamp to display beneath the name/role.
     * Pass a `Date` or numeric timestamp and it will be formatted with the user's locale,
     * or pass a pre-formatted string to bypass formatting.
     */
    performedAt?: Date | string | number;
    /**
     * Optional id for the live-region paragraph rendered below the timestamp
     * (used for ARIA live announcements). Omit to skip rendering the element.
     */
    timestampId?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatTimestamp(value: Date | string | number): string {
    try {
        return formatDateTime(value);
    } catch {
        return String(value);
    }
}

/** Converts a SCREAMING_SNAKE role key to a readable label (e.g. "SUPER_ADMIN" → "Super Admin"). */
function formatRoleLabel(role: string): string {
    return role
        .split('_')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * Globally reusable user identity row: avatar + name + optional role + optional timestamp.
 *
 * @example
 * // Basic
 * <UserIdentityRow name="Jane Doe" role="ADMIN" performedAt={new Date()} />
 *
 * @example
 * // With avatar image
 * <UserIdentityRow name="Jane Doe" avatarSrc="/img/jane.png" performedAt="Jul 27, 2026, 10:00 AM" />
 */
export function UserIdentityRow({
    name,
    fallback,
    avatarSrc,
    role,
    performedAt,
    timestampId,
}: UserIdentityRowProps) {
    const formattedDate = performedAt ? formatTimestamp(performedAt) : undefined;

    return (
        <div className="mt-2 flex items-center gap-3">
            <UserAvatar
                fallback={fallback ?? name}
                src={avatarSrc}
                role={role}
                size="lg"
            />
            <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-slate-900">{name}</p>
                {role && (
                    <p className="truncate text-xs text-slate-500">{formatRoleLabel(role)}</p>
                )}
                {formattedDate && (
                    <p className="truncate mt-0.5 text-xs text-slate-400">{formattedDate}</p>
                )}
                {timestampId && (
                    <p id={timestampId} className="sr-only" aria-live="polite" />
                )}
            </div>
        </div>
    );
}

function UserIdentityRowSkeleton({ className }: { className?: string } = {}) {
    return (
        <div className={`mt-2 flex items-center gap-3 ${className ?? ''}`}>
            <div className="h-10 w-10 sm:h-12 sm:w-12 shrink-0 rounded-full bg-slate-100 animate-pulse" />
            <div className="min-w-0 flex-1 space-y-2 py-0.5">
                <div className="h-4 w-32 bg-slate-100 animate-pulse rounded" />
                <div className="h-3 w-20 bg-slate-100 animate-pulse rounded" />
                <div className="h-3 w-24 bg-slate-100 animate-pulse rounded" />
            </div>
        </div>
    );
}

UserIdentityRow.Skeleton = UserIdentityRowSkeleton;
