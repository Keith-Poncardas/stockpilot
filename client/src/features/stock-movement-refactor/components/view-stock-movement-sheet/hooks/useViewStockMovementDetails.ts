import { useMemo, useCallback } from "react";
import { useQuery } from "@apollo/client";
import { GET_STOCK_MOVEMENT } from "@/features/stock-movement-refactor/operations";
import { extractInventoryHealthData } from "@/features/stock-movement-refactor/utils";
import { useViewProductSheet } from "@/features/product/components/view-product-sheet";
import { useViewStockMovementSheet } from "./useViewStockMovementSheet";

export function useViewStockMovementDetails(stockMovementId: string) {
    const { onClose: closeStockMovementSheet } = useViewStockMovementSheet();
    const { onOpen: openProductSheet } = useViewProductSheet();

    const { data, loading, error } = useQuery(GET_STOCK_MOVEMENT, {
        variables: { movementId: stockMovementId },
        skip: !stockMovementId,
    });

    const movement = data?.getStockMovement;
    const inventoryStatus = movement?.inventory;

    const inventoryHealthData = useMemo(() => {
        return extractInventoryHealthData(inventoryStatus);
    }, [inventoryStatus]);

    const handleViewProduct = useCallback(() => {
        const productId = movement?.product?.id || movement?.productId;
        if (productId) {
            closeStockMovementSheet();
            openProductSheet(productId);
        }
    }, [movement, closeStockMovementSheet, openProductSheet]);

    return {
        movement,
        inventoryHealthData,
        loading,
        error,
        handleViewProduct,
    };
}
