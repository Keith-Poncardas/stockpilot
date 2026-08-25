import { UserInfoCell as GlobalUserInfoCell, type UserInfoCellProps } from "@/components/UserInfoCell";
import type { UserRowInfoCellProps } from "../../../types";

/**
 * Renders the user information cell for the data table.
 * 
 * This component acts as a specialized wrapper around the global `UserInfoCell`,
 * automatically passing the row data from the TanStack table to display the user's
 * avatar, name, and an optional "(You)" tag for the current user.
 *
 * @param {UserRowInfoCellProps & Omit<UserInfoCellProps, 'row'>} props - The properties for the cell.
 * @param {Row<IUser>} props.row - The current row data containing the user details.
 * @returns {JSX.Element} The rendered user info cell component.
 */
export function UserInfoCell({
    row,
    ...props
}: UserRowInfoCellProps & Omit<UserInfoCellProps, 'row'>) {
    return <GlobalUserInfoCell row={row} {...props} />;
};
