
import type { UserRowInfoCellProps } from "../../user.types"
import { useAuthStore } from "@/store";
import { Link } from "react-router-dom";
import UserAvatar from "@/components/UserAvatar";

export function UserInfoCell({ row }: UserRowInfoCellProps) {
    const { user } = useAuthStore();
    const { id, firstName, lastName, role } = row.original;
    const name = `${firstName} ${lastName}`;
    const isCurrentUser = user?.id === id;

    return (
        <Link to={`/users/${id}/view`} className="flex items-center gap-2">
            <UserAvatar fallback={row.original} role={role} size="sm" className="w-7 h-7" />
            <div className="flex flex-inline items-center gap-1.5">
                <span className="font-semibold text-sm text-gray-900">{name}</span>
                {isCurrentUser && (
                    <span className="text-[10px] text-gray-400 font-medium leading-none mt-0.5">(You)</span>
                )}
            </div>
        </Link>
    )
}