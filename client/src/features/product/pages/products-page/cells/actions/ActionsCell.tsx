import { useCallback } from 'react';
import { Eye, SquarePen } from 'lucide-react';
import { ActionCell } from '@/components/ui/action-cell';
import { PopoverClose } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import type { ProductRowInfoCellProps } from '../../../../types';
import { useViewProductSheet, useEditProductSheet } from '../../../../components';

export function ActionsCell({ row }: ProductRowInfoCellProps) {
    const { onOpen: onOpenView } = useViewProductSheet();
    const { onOpen: onOpenEdit } = useEditProductSheet();

    const handleViewClick = useCallback(() => {
        onOpenView(row.original.id);
    }, [onOpenView, row.original.id]);

    const handleEditClick = useCallback(() => {
        onOpenEdit(row.original.id);
    }, [onOpenEdit, row.original.id]);

    const isNotEditable = row.original.status === 'DISCONTINUED';

    return (
        <div className="flex justify-center">
            <ActionCell>
                <div className="flex flex-col">
                    <PopoverClose asChild>
                        <Button
                            onClick={handleViewClick}
                            variant="ghost"
                            className="w-full justify-start px-2.5 py-2 h-auto text-xs font-semibold tracking-wide text-gray-700 uppercase"
                        >
                            <Eye size={15} strokeWidth={2.2} className="text-gray-500 mr-1" />
                            Details
                        </Button>
                    </PopoverClose>
                    <PopoverClose asChild>
                        <Button
                            onClick={handleEditClick}
                            variant="ghost"
                            className="w-full justify-start px-2.5 py-2 h-auto text-xs font-semibold tracking-wide text-gray-700 uppercase"
                            disabled={isNotEditable}
                        >
                            <SquarePen size={15} strokeWidth={2.2} className="text-gray-500 mr-1" />
                            Edit
                        </Button>
                    </PopoverClose>
                </div>
            </ActionCell>
        </div>
    );
}
