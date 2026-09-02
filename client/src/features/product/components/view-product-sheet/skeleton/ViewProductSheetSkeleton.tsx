import {
    ProductOverviewSection,
    PerformanceMetricsSection,
    SalesTrendChartSection,
    ProductBarcodeSection,
    ProductRecordDetailsSection,
    InventoryHealthSection,
} from '../sections';
import { ViewProductDetailsLayout } from '../layout';

export function ViewProductSheetSkeleton() {
    const metricsSkeleton = (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
            {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-20 bg-white border border-slate-200 rounded-2xl p-4 shadow-xs" />
            ))}
        </div>
    );

    return (
        <ViewProductDetailsLayout
            metrics={metricsSkeleton}
            mainContent={
                <>
                    <ProductOverviewSection.Skeleton />
                    <PerformanceMetricsSection.Skeleton />
                    <SalesTrendChartSection.Skeleton />
                </>
            }
            sidebarContent={
                <>
                    <InventoryHealthSection.Skeleton />
                    <ProductBarcodeSection.Skeleton />
                    <ProductRecordDetailsSection.Skeleton />
                </>
            }
        />
    );
}
