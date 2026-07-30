import { ActionCell } from "@/components/ui/action-cell";
import { PopoverClose } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Eye, Receipt } from "lucide-react";
import type { SaleRowProps } from "../../sale.types";
import { useNavigate } from "react-router-dom";

export function ActionsCell({ row }: SaleRowProps) {
    const navigate = useNavigate();

    function handleViewClick() {
        navigate(`/sales/${row.original.id}/view`);
    }

    function handleDownloadReceiptClick() {
        // Placeholder for receipt download
        console.log("Download receipt for sale:", row.original.id);
    }

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
                            View Sale
                        </Button>
                    </PopoverClose>
                    <PopoverClose asChild>
                        <Button
                            onClick={handleDownloadReceiptClick}
                            variant="ghost"
                            className="w-full justify-start px-2.5 py-2 h-auto text-xs font-semibold tracking-wide text-gray-700 uppercase"
                        >
                            <Receipt size={15} strokeWidth={2.2} className="text-gray-500 mr-1" />
                            Download Receipt
                        </Button>
                    </PopoverClose>
                </div>
            </ActionCell>
        </div>
    );
}
