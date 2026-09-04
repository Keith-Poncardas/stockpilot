import { ActionCell } from '@/components/ui/action-cell';
import { PopoverClose } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { SlidersHorizontal, BellRing } from 'lucide-react';
import type { InventoryRowProps } from '@/features/inventory/types';
import { useCallback } from 'react';
import { useAdjustStockSheet, useReorderLevelSheet } from '@/features/inventory/components';

export function InventoryActionsCell({ row }: InventoryRowProps) {
    const { onOpen: openAdjustSheet } = useAdjustStockSheet();
    const { onOpen: openReorderSheet } = useReorderLevelSheet();

    const handleAdjustClick = useCallback(() => {
        openAdjustSheet(row.original.id);
    }, [openAdjustSheet, row.original.id]);

    const handleReorderClick = useCallback(() => {
        openReorderSheet(row.original.id);
    }, [openReorderSheet, row.original.id]);

    return (
        <div className="flex justify-center">
            <ActionCell>
                <div className="flex flex-col min-w-[170px]">
                    <PopoverClose asChild>
                        <Button
                            onClick={handleAdjustClick}
                            variant="ghost"
                            className="w-full justify-start px-2.5 py-2 h-auto text-xs font-semibold tracking-wide text-slate-700 hover:text-slate-900 uppercase"
                        >
                            <SlidersHorizontal size={14} strokeWidth={2.2} className="text-slate-500 mr-2" />
                            Adjust Stock
                        </Button>
                    </PopoverClose>
                    <PopoverClose asChild>
                        <Button
                            onClick={handleReorderClick}
                            variant="ghost"
                            className="w-full justify-start px-2.5 py-2 h-auto text-xs font-semibold tracking-wide text-slate-700 hover:text-slate-900 uppercase"
                        >
                            <BellRing size={14} strokeWidth={2.2} className="text-slate-500 mr-2" />
                            Reorder Level
                        </Button>
                    </PopoverClose>
                </div>
            </ActionCell>
        </div>
    );
}
