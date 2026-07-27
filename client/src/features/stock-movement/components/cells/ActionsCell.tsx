import { ActionCell } from "@/components/ui/action-cell"
import { PopoverClose } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"
import { useNavigate } from "react-router-dom"
import type { Row } from "@tanstack/react-table"
import type { IStockMovement } from "../../stock-movement.types"

interface ActionsCellProps {
    row: Row<IStockMovement>;
}

export function ActionsCell({ row }: ActionsCellProps) {
    const navigate = useNavigate();

    function handleViewClick() {
        navigate(`/stock-movement/${row.original.id}/view`);
    }

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
