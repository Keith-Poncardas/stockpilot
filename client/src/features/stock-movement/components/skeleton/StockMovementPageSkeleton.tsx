import { Header } from "@/features/product/components";
import { InventoryValueImpact, MovementSummary, PerformedBy, ProductDetails, RecordInfo } from "../pages";
import { InventoryHealth } from "@/components/InventoryHealth";

export function StockMovementPageSkeleton() {
    return (
        <>
            <Header.Skeleton />

            <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6 max-sm:mb-15">

                <div className="lg:col-span-2 flex flex-col gap-6">

                    <MovementSummary.skeleton />

                    <InventoryValueImpact.skeleton />

                    <ProductDetails.skeleton />

                </div>

                <div className="flex flex-col gap-6">

                    <PerformedBy.skeleton />

                    <InventoryHealth.skeleton />

                    <RecordInfo.skeleton />

                </div>

            </main>
        </>
    )
}
