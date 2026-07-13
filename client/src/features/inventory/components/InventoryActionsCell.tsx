
import { ActionCell } from '@/components/ui/action-cell'
import { PopoverClose } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { SlidersHorizontal } from 'lucide-react'
import type { InventoryRowProps } from '../inventory.types'
import { useNavigate } from 'react-router-dom'

export function InventoryActionsCell({ row }: InventoryRowProps) {
    const navigate = useNavigate();

    function handleAdjustClick() {
        navigate(`/inventory/${row.original.id}/adjust`);
    }

    return (
        <div className="flex justify-center">
            <ActionCell>
                <div className="flex flex-col">
                    <PopoverClose asChild>
                        <Button
                            onClick={handleAdjustClick}
                            variant="ghost"
                            className="w-full justify-start px-2.5 py-2 h-auto text-xs font-semibold tracking-wide text-gray-700 uppercase"
                        >
                            <SlidersHorizontal size={15} strokeWidth={2.2} className="text-gray-500 mr-1" />
                            Adjust
                        </Button>
                    </PopoverClose>
                </div>
            </ActionCell>
        </div>
    )
}
