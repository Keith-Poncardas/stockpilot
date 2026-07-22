
import { UserInfoCell as GlobalUserInfoCell, type UserInfoCellProps } from "@/components/UserInfoCell";
import type { UserRowInfoCellProps } from "../../user.types";

export function UserInfoCell({ row, ...props }: UserRowInfoCellProps & Omit<UserInfoCellProps, 'row'>) {
    return <GlobalUserInfoCell row={row} {...props} />;
}

export default UserInfoCell;