import { ActionCell } from "@/components/ui/action-cell";
import { PopoverClose } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import type { CustomerRowProps } from "../../../../types";
import { useViewCustomerSheet } from "@/features/customer-refactor";
import { useCallback } from "react";

export function Actions({ row }: CustomerRowProps) {
    const { onOpen } = useViewCustomerSheet();

    const handleViewClick = useCallback(() => {
        onOpen(row.original.id);
    }, [onOpen, row.original.id]);

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
                </div>
            </ActionCell>
        </div>
    );
}
