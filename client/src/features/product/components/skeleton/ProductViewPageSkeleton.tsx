import { StockMovementLedger } from "@/components/ui/stock-movement-ledger";
import { Header, PerformanceMetrics, ProductBarcode, ProductOverview, ProductRecordDetails, SalesTrendChart } from "../pages";
import { InventoryHealth } from "@/components/InventoryHealth";

export function ProductViewPageSkeleton() {
    return (
        <>
            <Header.Skeleton />
            <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 flex flex-col gap-6">
                    <ProductOverview.Skeleton />
                    <PerformanceMetrics.Skeleton />
                    <SalesTrendChart.Skeleton />
                    <StockMovementLedger.Skeleton />
                </div>
                <div className="flex flex-col gap-6">
                    <InventoryHealth.skeleton />
                    <ProductBarcode.Skeleton />
                    <ProductRecordDetails.Skeleton />
                </div>
            </main>
        </>
    );
}