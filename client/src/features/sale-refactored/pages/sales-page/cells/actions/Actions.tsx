import { ActionCell } from "@/components/ui/action-cell";
import { PopoverClose } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import type { SaleCellProps } from "../cells.types";
import { useCallback, useMemo } from "react";
import { getActionOptions } from "./options";
import { useViewSaleSheet } from "@/features/sale-refactored/components/view-sale-sheet/hooks";


/**
 * Component that renders the action menu cell for a specific sale row.
 * Offers quick actions such as viewing the sale details or downloading the sale receipt.
 */
export function ActionsCell({ row }: SaleCellProps) {
    const { onOpen } = useViewSaleSheet();

    /**
     * Navigates to the sale details view by opening the slide-over sheet.
     */
    const handleViewClick = useCallback(() => {
        onOpen(row.original.id);
    }, [onOpen, row.original.id]);

    /**
     * Memoized action options list to avoid recreating the array reference on every render.
     */
    const actions = useMemo(
        () => getActionOptions(handleViewClick),
        [handleViewClick]
    );

    return (
        <div className="flex justify-center">
            <ActionCell>
                <div className="flex flex-col">
                    {actions.map(({ label, icon: Icon, onClick }) => (
                        <PopoverClose key={label} asChild>
                            <Button
                                onClick={onClick}
                                variant="ghost"
                                className="w-full justify-start px-2.5 py-2 h-auto text-xs font-semibold tracking-wide text-gray-700 uppercase"
                            >
                                <Icon size={15} strokeWidth={2.2} className="text-gray-500 mr-1" />
                                {label}
                            </Button>
                        </PopoverClose>
                    ))}
                </div>
            </ActionCell>
        </div>
    );
}
