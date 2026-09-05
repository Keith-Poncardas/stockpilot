import { InventoryHealth } from "@/components/InventoryHealth";
import { ViewStockMovementDetailsLayout } from "../layout";
import {
    MovementSummary,
    InventoryValueImpact,
    ProductDetails,
    PerformedBy,
    RecordInfo
} from "../sections";

export function ViewStockMovementSkeleton() {
    return (
        <ViewStockMovementDetailsLayout
            movementSummary={<MovementSummary.Skeleton />}
            inventoryValueImpact={<InventoryValueImpact.Skeleton />}
            productDetails={<ProductDetails.Skeleton />}
            performedBy={<PerformedBy.Skeleton />}
            inventoryHealth={<InventoryHealth.Skeleton />}
            recordInfo={<RecordInfo.Skeleton />}
        />
    );
}
