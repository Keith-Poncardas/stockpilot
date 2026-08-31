import { ActionCell } from "@/components/ui/action-cell";
import { PopoverClose } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Eye, SquarePen } from "lucide-react";
import type { CustomerRowProps } from "../../../../types";
import { useViewCustomerSheet, useEditCustomerSheet } from "@/features/customer";
import { useCallback } from "react";

export function Actions({ row }: CustomerRowProps) {
    const { onOpen: onOpenView } = useViewCustomerSheet();
    const { onOpen: onOpenEdit } = useEditCustomerSheet();

    const handleViewClick = useCallback(() => {
        onOpenView(row.original.id);
    }, [onOpenView, row.original.id]);

    const handleEditClick = useCallback(() => {
        onOpenEdit(row.original.id);
    }, [onOpenEdit, row.original.id]);

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
                            Customer Details
                        </Button>
                    </PopoverClose>
                    <PopoverClose asChild>
                        <Button
                            onClick={handleEditClick}
                            variant="ghost"
                            className="w-full justify-start px-2.5 py-2 h-auto text-xs font-semibold tracking-wide text-gray-700 uppercase"
                        >
                            <SquarePen size={15} strokeWidth={2.2} className="text-gray-500 mr-1" />
                            Edit Customer
                        </Button>
                    </PopoverClose>
                </div>
            </ActionCell>
        </div>
    );
}

