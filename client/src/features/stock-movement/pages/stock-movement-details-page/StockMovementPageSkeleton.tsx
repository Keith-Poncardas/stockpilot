import { Header, InventoryHealth } from "@/components";
import { StockMovementDetailsLayout } from "./StockMovementDetailsLayout";
import {
    InventoryValueImpact,
    MovementSummary,
    PerformedBy,
    ProductDetails,
    RecordInfo
} from "../../components";

/**
 * Skeleton loading state for the Stock Movement Details page.
 * Displays placeholders for the header and all layout components, including Movement Summary, 
 * Inventory Value Impact, Product Details, Performed By, Inventory Health, and Record Info.
 *
 * @returns {JSX.Element} The rendered skeleton component.
 */
export function StockMovementPageSkeleton() {
    return (
        <>
            <Header.Skeleton />

            <StockMovementDetailsLayout
                leftContent={
                    <>
                        <MovementSummary.Skeleton />
                        <InventoryValueImpact.Skeleton />
                        <ProductDetails.Skeleton />
                    </>
                }
                rightContent={
                    <>
                        <PerformedBy.Skeleton />
                        <InventoryHealth.Skeleton />
                        <RecordInfo.Skeleton />
                    </>
                }
            />
        </>
    )
};
