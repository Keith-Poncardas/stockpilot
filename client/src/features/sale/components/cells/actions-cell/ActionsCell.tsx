import { ActionCell } from "@/components/ui/action-cell";
import { PopoverClose } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import type { SaleRowProps } from "../../../sale.types";
import { useNavigate } from "react-router-dom";
import { useCallback, useMemo } from "react";
import { PATHS } from "@/routes";
import { getActionOptions } from "./options";

/**
 * Component that renders the action menu cell for a specific sale row.
 * Offers quick actions such as viewing the sale details or downloading the sale receipt.
 *
 * @component
 * @param {SaleRowProps} props - The component props.
 * @param {Object} props.row - The table row context for the current sale.
 * @returns {React.ReactElement} The rendered ActionsCell component.
 */
export function ActionsCell({ row }: SaleRowProps) {
    const navigate = useNavigate();

    /**
     * Navigates to the sale details view.
     */
    const handleViewClick = useCallback(() => {
        navigate(PATHS.sales.view(row.original.id));
    }, [navigate, row.original.id]);

    /**
     * Initiates the receipt download process for the sale.
     */
    const handleDownloadReceiptClick = useCallback(() => {

        console.log("Download receipt for sale:", row.original.id);
    }, [row.original.id]);

    /**
     * Memoized action options list to avoid recreating the array reference on every render.
     */
    const actions = useMemo(
        () => getActionOptions(handleViewClick, handleDownloadReceiptClick),
        [
            handleViewClick,
            handleDownloadReceiptClick
        ]
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
