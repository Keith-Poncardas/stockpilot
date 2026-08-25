import { ActionCell } from "@/components/ui/action-cell"
import { PopoverClose } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Eye, SquarePen } from "lucide-react"
import type { ProductRowInfoCellProps } from "../../product.types"
import { useNavigate } from "react-router-dom"
import { useCallback } from "react"
import { PATHS } from "@/routes"
import { ProductStatus } from "../../product.constants"

export function ActionsCell({ row }: ProductRowInfoCellProps) {
    const navigate = useNavigate();

    const handleViewClick = useCallback(() => {
        navigate(PATHS.products.view(row.original.id));
    }, [navigate, row.original.id]);

    const handleEditClick = useCallback(() => {
        navigate(PATHS.products.edit(row.original.id));
    }, [navigate, row.original.id]);

    const isNotEditable = row.original.status === ProductStatus.DISCONTINUED.a;

    return (
        <div className="flex justify-center">
            <ActionCell>
                <div className="flex flex-col">
                    <PopoverClose asChild>
                        <Button onClick={handleViewClick} variant="ghost" className="w-full justify-start px-2.5 py-2 h-auto text-xs font-semibold tracking-wide text-gray-700 uppercase">
                            <Eye size={15} strokeWidth={2.2} className="text-gray-500 mr-1" />
                            Details
                        </Button>
                    </PopoverClose>
                    <PopoverClose asChild>
                        <Button onClick={handleEditClick} variant="ghost" className="w-full justify-start px-2.5 py-2 h-auto text-xs font-semibold tracking-wide text-gray-700 uppercase" disabled={isNotEditable}>
                            <SquarePen size={15} strokeWidth={2.2} className="text-gray-500 mr-1" />
                            Edit
                        </Button>
                    </PopoverClose>
                </div>
            </ActionCell>
        </div>
    )
}
