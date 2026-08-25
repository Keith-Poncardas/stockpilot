import { useCallback } from "react"
import { ActionCell } from "@/components/ui/action-cell"
import { PopoverClose } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"
import { useNavigate } from "react-router-dom"
import type { UserRowInfoCellProps } from "../../../types"
import { PATHS } from "@/routes"

/**
 * Renders the actions cell for a user row in the data table.
 * 
 * Provides an action menu (e.g., via a Popover) that contains 
 * a button to navigate to the detailed view of the specific user.
 *
 * @param {UserRowInfoCellProps} props - The properties for the cell.
 * @param {Row<IUser>} props.row - The current row data from TanStack table.
 * @returns {JSX.Element} The rendered actions cell component.
 */
export function ActionsCell({ row }: UserRowInfoCellProps) {
    const navigate = useNavigate();

    const handleViewClick = useCallback(() => {
        navigate(PATHS.users.view(row.original.id));
    }, [navigate, row.original.id]);

    return (
        <div className="flex justify-center">
            <ActionCell>
                <div className="flex flex-col">
                    <PopoverClose asChild>
                        <Button
                            onClick={handleViewClick}
                            variant="ghost"
                            className="w-full justify-start px-2.5 py-2 h-auto text-xs font-semibold tracking-wide text-gray-700 uppercase">
                            <Eye
                                size={15}
                                strokeWidth={2.2}
                                className="text-gray-500 mr-1"
                            />
                            View User
                        </Button>
                    </PopoverClose>
                </div>
            </ActionCell>
        </div>
    )
};
