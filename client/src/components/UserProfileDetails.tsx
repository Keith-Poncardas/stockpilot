import UserAvatar from '@/components/UserAvatar'
import type { IUserAvatarProps } from '@/features';
import { cn } from '@/lib/utils'

interface UserProfileDetailsProps {
    user: IUserAvatarProps;
    showEmail?: boolean;
    avatarSize?: 'default' | 'sm' | 'lg' | 'xl' | '2xl';
    nameClassName?: string;
    emailClassName?: string;
    containerClassName?: string;
}

export function UserProfileDetails({
    user,
    showEmail = false,
    avatarSize = 'default',
    nameClassName,
    emailClassName,
    containerClassName,
}: UserProfileDetailsProps) {
    return (
        <>
            <UserAvatar fallback={user} size={avatarSize} role={user?.role} />
            <div className={cn("flex-1 min-w-0", containerClassName)}>
                <p className={cn("truncate font-semibold", nameClassName)}>
                    {user?.firstName} {user?.lastName}
                </p>
                {showEmail && (
                    <p className={cn("truncate text-sm", emailClassName)}>
                        {user?.email}
                    </p>
                )}
            </div>
        </>
    )
}
