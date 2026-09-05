import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { AlertCircle, ExternalLink } from "lucide-react";
import { InventoryHealth } from "@/components/InventoryHealth";
import {
    MovementSummary,
    InventoryValueImpact,
    ProductDetails,
    PerformedBy,
    RecordInfo
} from "./sections";
import { ViewStockMovementDetailsLayout } from "./layout";
import { ViewStockMovementSkeleton } from "./skeleton";
import { useViewStockMovementDetails } from "./hooks";

interface ViewStockMovementDetailsProps {
    stockMovementId: string;
}

export function ViewStockMovementDetails({ stockMovementId }: ViewStockMovementDetailsProps) {
    const {
        movement,
        inventoryHealthData,
        loading,
        error,
        handleViewProduct,
    } = useViewStockMovementDetails(stockMovementId);

    if (loading) {
        return <ViewStockMovementSkeleton />;
    }

    if (error || !movement) {
        return (
            <EmptyState
                title="Failed to load stock movement"
                description={error?.message || "Stock movement record not found."}
                icon={AlertCircle}
                iconClassName="text-red-500 dark:text-red-400"
                iconWrapperClassName="bg-red-50 dark:bg-red-500/10"
            />
        );
    }

    return (
        <ViewStockMovementDetailsLayout
            movementSummary={<MovementSummary movement={movement} />}
            inventoryValueImpact={<InventoryValueImpact movement={movement} />}
            productDetails={<ProductDetails movement={movement} />}
            performedBy={<PerformedBy movement={movement} />}
            inventoryHealth={<InventoryHealth data={inventoryHealthData} />}
            recordInfo={<RecordInfo movement={movement} />}
            actions={
                <div className="flex items-center justify-end gap-3 w-full">
                    <Button
                        variant="outline"
                        className="h-10 px-4 text-sm font-medium"
                        disabled
                    >
                        Print
                    </Button>
                    <Button
                        className="h-10 px-4 text-sm font-semibold"
                        onClick={handleViewProduct}
                    >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        View Product
                    </Button>
                </div>
            }
        />
    );
}

ViewStockMovementDetails.Skeleton = ViewStockMovementSkeleton;
