import { Button } from '@/components/ui/button'
import { Plus, PenSquare, MoreHorizontal } from 'lucide-react'
import UserAvatar from '@/components/UserAvatar'
import type { IUserDetail } from '../../user.types'

interface UserProfileHeaderProps {
    user?: IUserDetail
    isLoading?: boolean
}

export function UserProfileHeader({ user, isLoading }: UserProfileHeaderProps) {
    if (isLoading) {
        return (
            <>
                <div className="flex flex-col md:flex-row md:items-end gap-4 md:gap-6 relative z-10">
                    <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white bg-slate-300 animate-pulse shrink-0 mx-auto md:mx-0"></div>
                    <div className="flex flex-col items-center md:items-start md:mb-4 w-full md:w-auto">
                        <div className="h-8 w-48 bg-slate-200 animate-pulse rounded-md mb-2"></div>
                        <div className="h-4 w-32 bg-slate-200 animate-pulse rounded-md"></div>
                    </div>
                </div>

                <div className="flex flex-row items-center justify-center md:justify-start gap-2 md:mb-4 relative z-10 flex-wrap">
                    <div className="h-9 w-28 bg-slate-200 animate-pulse rounded-md"></div>
                    <div className="h-9 w-32 bg-slate-200 animate-pulse rounded-md"></div>
                    <div className="h-9 w-12 bg-slate-200 animate-pulse rounded-md"></div>
                </div>
            </>
        )
    }

    const actionButtons = [
        {
            label: 'Edit User',
            icon: <Plus size={18} />,
            props: {
                className: 'gap-2 font-semibold px-4 h-9',
            }
        },
        {
            label: 'Update Role',
            icon: <PenSquare size={18} className="text-gray-500" />,
            props: {
                variant: 'outline' as const,
                className: 'gap-2 font-semibold px-4 h-9 border-gray-200 text-gray-700',
            }
        },
        {
            label: null,
            icon: <MoreHorizontal size={20} />,
            props: {
                variant: 'outline' as const,
                size: 'icon' as const,
                className: 'h-9 w-12 border-gray-200 text-gray-700',
            }
        }
    ];

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
                    <h1 className="text-3xl font-bold text-gray-900">{`${user?.firstName} ${user?.lastName}`}</h1>
                    <p className="text-gray-500 font-medium text-[15px] mt-1">
                        {user?.email}
                    </p>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-row items-center justify-center md:justify-start gap-2 md:mb-4 relative z-10 flex-wrap">
                {actionButtons.map((btn, idx) => (
                    <Button key={idx} {...btn.props}>
                        {btn.icon}
                        {btn.label}
                    </Button>
                ))}
            </div>
        </>
    )
}
