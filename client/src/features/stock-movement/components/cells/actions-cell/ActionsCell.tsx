import { useCallback } from "react"
import { ActionCell } from "@/components/ui/action-cell"
import { PopoverClose } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { PATHS } from "@/routes"
import type { ActionsCellProps } from "./types"

/**
 * Renders the actions cell for a stock movement row in a data table.
 * Provides functionality to view the details of a specific stock movement.
 *
 * @param {ActionsCellProps} props - The properties for the ActionsCell component.
 * @param {Object} props.row - The row data from the data table, containing the stock movement details.
 * @returns {JSX.Element} The rendered actions cell component.
 */
export function ActionsCell({ row }: ActionsCellProps) {
    const navigate = useNavigate();

    const handleViewClick = useCallback(() => {
        navigate(PATHS.stockMovement.view(row.original.id));
    }, [navigate, row.original.id]);

    return (
        <div className="flex justify-center">
            <ActionCell>
                <div className="flex flex-col">
                    <PopoverClose asChild>
                        <Button onClick={handleViewClick} variant="ghost" className="w-full justify-start px-2.5 py-2 h-auto text-xs font-semibold tracking-wide text-gray-700 uppercase">
                            <Eye size={15} strokeWidth={2.2} className="text-gray-500 mr-1" />
                            SM Details
                        </Button>
                    </PopoverClose>
                </div>
            </ActionCell>
        </div>
    )
}
