import * as React from "react";
import { Link } from "react-router-dom";
import UserAvatar from "@/components/UserAvatar";
import { useAuthStore } from "@/store";
import { cn } from "@/lib/utils";
import { CUSTOMER_AVATAR_COLORS, CUSTOMER_TEXT_COLORS } from "@/features/customer-refactor";
import { PATHS } from "@/routes/paths";

export interface UserInfoCellUser {
    id?: string;
    firstName?: string;
    lastName?: string;
    name?: string;
    role?: string;
    isCurrentUser?: boolean;
    [key: string]: any;
}

export interface UserInfoCellProps {
    /** User object containing user details */
    user?: UserInfoCellUser | null;
    /** TanStack table row object containing user or original record */
    row?: {
        original: any;
    };
    /** Optional direct props */
    id?: string;
    firstName?: string;
    lastName?: string;
    name?: string;
    role?: string;
    isCurrentUser?: boolean;

    /** Destination link path. Defaults to `/users/${id}/view` */
    to?: string;
    /** Whether to link to user profile. Default: true */
    isLink?: boolean;
    /** Whether to show "(You)" indicator if target is current user. Default: true */
    showYouTag?: boolean;
    /** Avatar size prop for UserAvatar. Default: "sm" */
    avatarSize?: 'sm' | 'default' | 'lg' | 'xl' | '2xl';
    /** Additional CSS classes for the Avatar */
    avatarClassName?: string;
    /** Additional CSS classes for root container */
    className?: string;
    /** Text to display when user data is missing. Default: "—" */
    fallbackText?: string;
    /** Type of the entity. Defaults to 'user'. If 'customer', handles customer styling. */
    type?: 'user' | 'customer';
    /** Optional click handler callback */
    onClick?: (e: React.MouseEvent) => void;
}

export const UserInfoCell = React.memo(function UserInfoCell({
    user: userProp,
    row,
    id: idProp,
    firstName: firstNameProp,
    lastName: lastNameProp,
    name: nameProp,
    role: roleProp,
    isCurrentUser: isCurrentUserProp,
    to,
    isLink = true,
    showYouTag = true,
    avatarSize = 'sm',
    avatarClassName = 'w-7 h-7',
    className,
    fallbackText = "—",
    type = 'user',
    onClick,
}: UserInfoCellProps) {
    const { user: authUser } = useAuthStore();

    // Determine target user object (priority: user prop > row.original.user/customer > row.original)
    const targetUser = userProp ??
        (type === 'customer' ? row?.original?.customer : row?.original?.user) ??
        row?.original ??
        null;

    const id = idProp ?? targetUser?.id;
    const firstName = firstNameProp ?? targetUser?.firstName ?? '';
    const lastName = lastNameProp ?? targetUser?.lastName ?? '';
    const role = roleProp ?? targetUser?.role;

    let displayName = nameProp ?? targetUser?.name;
    if (!displayName && (firstName || lastName)) {
        displayName = `${firstName} ${lastName}`.trim();
    }
    if (type === 'customer' && !displayName) {
        displayName = 'Walk-in';
    }

    // If no user info is available at all, return fallback text
    if (!displayName && !id && !targetUser) {
        return <span className="text-sm text-gray-400 font-mono">{fallbackText}</span>;
    }

    const isCurrentUser = isCurrentUserProp ?? targetUser?.isCurrentUser ?? (Boolean(id) && authUser?.id === id);

    let linkPath = to;
    if (!linkPath && id) {
        if (type === 'user') linkPath = PATHS.users.view(id);
        else if (type === 'customer') linkPath = PATHS.customers.view(id);
    }
    const isWalkIn = type === 'customer' && displayName === 'Walk-in';

    const shouldLink = isLink && Boolean(linkPath) && !isWalkIn && !onClick;


    // Resolve custom classes for customer layout
    let finalAvatarClassName = avatarClassName;
    let customFallbackClassName = "";
    if (type === 'customer') {
        const colorKey = isWalkIn ? 'WALK_IN' : 'CUSTOMER';
        customFallbackClassName = CUSTOMER_AVATAR_COLORS[colorKey];
    }

    let nameTextClass = "font-semibold text-sm text-gray-900 truncate";
    if (type === 'customer') {
        const colorKey = isWalkIn ? 'WALK_IN' : 'CUSTOMER';
        nameTextClass = cn("text-sm truncate", CUSTOMER_TEXT_COLORS[colorKey]);
    }

    const content = (
        <>
            <UserAvatar
                fallback={isWalkIn ? 'W' : (targetUser || displayName || 'U')}
                role={role}
                size={avatarSize}
                className={finalAvatarClassName}
                fallbackClassName={customFallbackClassName}
            />
            <div className="flex flex-inline items-center gap-1.5 min-w-0">
                <span className={nameTextClass}>
                    {displayName || "Unknown User"}
                </span>
                {showYouTag && isCurrentUser && (
                    <span className="text-[10px] text-gray-400 font-medium leading-none mt-0.5 shrink-0">
                        (You)
                    </span>
                )}
            </div>
        </>
    );

    const containerClasses = cn("flex items-center gap-2 min-w-0", className);

    if (shouldLink && linkPath) {
        return (
            <Link to={linkPath} className={cn(containerClasses, "hover:opacity-80 transition-opacity")} onClick={(e) => e.stopPropagation()}>
                {content}
            </Link>
        );
    }

    return (
        <div
            className={containerClasses}
            onClick={onClick ? (e) => { e.stopPropagation(); onClick(e); } : undefined}
        >
            {content}
        </div>
    );
});

export default UserInfoCell;
