import { useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { PATHS } from "@/routes";
import { GET_STOCK_MOVEMENT } from "@/features/stock-movement-refactor/operations";
import { extractInventoryHealthData } from "@/features/stock-movement-refactor/utils";
import { useViewStockMovementSheet } from "./useViewStockMovementSheet";

export function useViewStockMovementDetails(stockMovementId: string) {
    const navigate = useNavigate();
    const { onClose } = useViewStockMovementSheet();

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
        if (movement?.productId) {
            onClose();
            navigate(PATHS.products.view(movement.productId));
        }
    }, [navigate, movement, onClose]);

    return {
        movement,
        inventoryHealthData,
        loading,
        error,
        handleViewProduct,
    };
}
