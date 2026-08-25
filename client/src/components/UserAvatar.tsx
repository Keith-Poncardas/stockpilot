import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn, getConfigColor } from '@/lib/utils'
import { ROLE_COLORS } from '@/features/user/user.config'

interface UserAvatarProps {
    /** Initials string or User object to extract initials from */
    fallback?: string | { firstName?: string; lastName?: string } | null
    /** URL of the user's profile image (optional) */
    src?: string
    /** Avatar size — maps to shadcn Avatar size prop */
    size?: 'sm' | 'default' | 'md' | 'lg' | 'xl' | '2xl' | 'header'
    /** User role to determine the avatar color */
    role?: string
    /** Extra classes forwarded to the Avatar root */
    className?: string
    /** Extra classes forwarded to the AvatarFallback */
    fallbackClassName?: string
}

export function UserAvatar({
    fallback,
    src,
    size = 'default',
    role,
    className,
    fallbackClassName,
}: UserAvatarProps) {
    const roleColor = getConfigColor(ROLE_COLORS, role);

    let fallbackText = "U";
    if (typeof fallback === 'string') {
        fallbackText = fallback || "U";
    } else if (fallback && typeof fallback === 'object') {
        fallbackText = ((fallback.firstName?.[0] ?? '') + (fallback.lastName?.[0] ?? '')).toUpperCase() || 'U';
    }

    return (
        <Avatar size={size} className={cn(size === '2xl' && 'border-4 border-white shadow-sm', className)}>
            {src && <AvatarImage src={src} alt={fallbackText} />}
            <AvatarFallback
                className={cn('font-bold', roleColor, fallbackClassName)}
            >
                {fallbackText}
            </AvatarFallback>
        </Avatar>
    )
}

export default UserAvatar
