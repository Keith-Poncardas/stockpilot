import { ActionCell } from "@/components/ui/action-cell"
import { PopoverClose } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"
import type { UserRowInfoCellProps } from "../../user.types"
import { useNavigate } from "react-router-dom"

export function ActionsCell({ row }: UserRowInfoCellProps) {
    const navigate = useNavigate();

    function handleViewClick() {
        navigate(`/users/${row.original.id}/view`);
    }

    return (
        <div className="flex justify-center">
            <ActionCell>
                <div className="flex flex-col">
                    <PopoverClose asChild>
                        <Button onClick={handleViewClick} variant="ghost" className="w-full justify-start px-2.5 py-2 h-auto text-xs font-semibold tracking-wide text-gray-700 uppercase">
                            <Eye size={15} strokeWidth={2.2} className="text-gray-500 mr-1" />
                            View
                        </Button>
                    </PopoverClose>
                </div>
            </ActionCell>
        </div>
    )
}
