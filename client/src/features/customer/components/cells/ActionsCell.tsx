import { ActionCell } from "@/components/ui/action-cell";
import { PopoverClose } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import type { CustomerRowProps } from "../../customer.types";
import { useNavigate } from "react-router-dom";
import { useCallback } from "react";
import { PATHS } from "@/routes";

export function ActionsCell({ row }: CustomerRowProps) {
    const navigate = useNavigate();

    const handleViewClick = useCallback(() => {
        navigate(PATHS.customers.view(row.original.id));
    }, [navigate, row.original.id]);

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
