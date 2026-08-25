import { Button } from '@/components/ui/button'
import UserAvatar from '@/components/UserAvatar'
import { ProfileStamp } from '@/components/ProfileViewLayout'
import type { IUser } from '../../../types'
import { Skeleton } from './Skeleton'
import { USER_ACTION_BUTTONS } from './utils'

/**
 * Header component for the User Profile view.
 * 
 * Displays the user's avatar, basic information (name, email, role stamp), 
 * and a set of action buttons for interacting with the profile.
 * 
 * @param {IUser} user - The user data object containing details to display.
 * @returns {JSX.Element} The rendered profile header component.
 */
export function UserProfileHeader({ user }: { user: IUser }) {
    return (
        <>
            {/* Avatar and Name */}
            <div className="flex flex-col md:flex-row md:items-end gap-4 md:gap-6 relative z-10">

                <UserAvatar
                    fallback={user}
                    role={user?.role}
                    size="2xl"
                    className="mx-auto md:mx-0 shrink-0"
                />

                {/* Name and Info */}
                <div className="flex flex-col items-center md:items-start md:mb-4 text-center md:text-left">
                    <div className="flex items-center gap-3 flex-wrap justify-center md:justify-start">
                        <h1 className="text-3xl font-bold text-gray-900">{`${user?.firstName || ''} ${user?.lastName || ''}`.trim()}</h1>
                        <ProfileStamp stamp="User" />
                    </div>
                    <p className="text-gray-500 font-medium text-[15px] mt-1">
                        {user?.email}
                    </p>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-row items-center justify-center md:justify-start gap-2 md:mb-4 relative z-10 flex-wrap">
                {USER_ACTION_BUTTONS.map(({ label, Icon, iconProps, props }) => (
                    <Button key={label || "more"} {...props}>
                        <Icon {...iconProps} />
                        {label}
                    </Button>
                ))}
            </div>
        </>
    )
};

UserProfileHeader.Skeleton = Skeleton;
