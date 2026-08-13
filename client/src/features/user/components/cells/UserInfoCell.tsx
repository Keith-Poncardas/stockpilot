import * as React from "react";
import { UserInfoCell as GlobalUserInfoCell, type UserInfoCellProps } from "@/components/UserInfoCell";
import type { UserRowInfoCellProps } from "../../types";

export const UserInfoCell = React.memo(function UserInfoCell({
    row,
    ...props
}: UserRowInfoCellProps & Omit<UserInfoCellProps, 'row'>) {
    return <GlobalUserInfoCell row={row} {...props} />;
});
export default UserInfoCell;
