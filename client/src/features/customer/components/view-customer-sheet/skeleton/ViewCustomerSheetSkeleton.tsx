import { ViewCustomerDetailsLayout } from "../layout/ViewCustomerDetailsLayout";
import { MetricCard } from "@/components";
import {
    CustomerInfoSection,
    CustomerAddressSection,
    CustomerPurchaseSummarySection,
    CustomerPurchaseHistorySection,
} from "../sections";

export function ViewCustomerSheetSkeleton() {
    const metricsSkeleton = (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard.Skeleton />
            <MetricCard.Skeleton />
            <MetricCard.Skeleton />
            <MetricCard.Skeleton />
        </div>
    );

    return (
        <ViewCustomerDetailsLayout
            metrics={metricsSkeleton}
            customerInfo={<CustomerInfoSection.Skeleton />}
            addressInfo={<CustomerAddressSection.Skeleton />}
            purchaseSummary={<CustomerPurchaseSummarySection.Skeleton />}
            purchaseHistory={<CustomerPurchaseHistorySection.Skeleton />}
        />
    );
}
