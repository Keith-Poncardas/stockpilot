import { useCallback } from "react";
import { ActionCell } from "@/components/ui/action-cell";
import { PopoverClose } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Eye, Package } from "lucide-react";
import { useViewStockMovementSheet } from "@/features/stock-movement-refactor/components";
import { useViewProductSheet } from "@/features/product/components/view-product-sheet";
import type { ActionsCellProps } from "./types";

/**
 * Renders the actions cell for a stock movement row in a data table.
 * Provides quick actions to open the ViewStockMovementSheet or ViewProductSheet.
 */
export function ActionsCell({ row }: ActionsCellProps) {
    const { onOpen: openStockMovementSheet } = useViewStockMovementSheet();
    const { onOpen: openProductSheet } = useViewProductSheet();

    const productId = row.original.product?.id;

    const handleViewMovement = useCallback(() => {
        openStockMovementSheet(row.original.id);
    }, [openStockMovementSheet, row.original.id]);

    const handleViewProduct = useCallback(() => {
        if (productId) {
            openProductSheet(productId);
        }
    }, [openProductSheet, productId]);

    return (
        <div className="flex justify-center">
            <ActionCell>
                <div className="flex flex-col min-w-[140px] py-0.5">
                    <PopoverClose asChild>
                        <Button
                            onClick={handleViewMovement}
                            variant="ghost"
                            className="w-full justify-start px-2.5 py-1.5 h-auto text-xs font-semibold tracking-wide text-gray-700 hover:text-blue-600 hover:bg-blue-50/50 uppercase cursor-pointer"
                        >
                            <Eye size={14} strokeWidth={2.2} className="text-gray-500 mr-2 shrink-0" />
                            SM Details
                        </Button>
                    </PopoverClose>
                    {productId && (
                        <PopoverClose asChild>
                            <Button
                                onClick={handleViewProduct}
                                variant="ghost"
                                className="w-full justify-start px-2.5 py-1.5 h-auto text-xs font-semibold tracking-wide text-gray-700 hover:text-blue-600 hover:bg-blue-50/50 uppercase cursor-pointer"
                            >
                                <Package size={14} strokeWidth={2.2} className="text-gray-500 mr-2 shrink-0" />
                                View Product
                            </Button>
                        </PopoverClose>
                    )}
                </div>
            </ActionCell>
        </div>
    );
}

