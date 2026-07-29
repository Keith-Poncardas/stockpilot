import { MetricCard, ProfileViewLayout } from "@/components";
import {
    CustomerInfoSection,
    CustomerAddressSection,
    CustomerPurchaseSummarySection,
    CustomerPurchaseHistorySection,
} from "../customer-view";

export function CustomerViewPageSkeleton() {
    return (
        <ProfileViewLayout isLoading={true} backLabel="Back to Customers" backUrl="/customers">

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {Array.from({ length: 4 }).map((_, i) => (
                    <MetricCard.Skeleton key={i} />
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left column — details */}
                <div className="lg:col-span-1 flex flex-col gap-6">
                    <CustomerInfoSection.skeleton />
                    <CustomerAddressSection.skeleton />
                    <CustomerPurchaseSummarySection.skeleton />
                </div>

                {/* Right column — purchase history table */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                    <CustomerPurchaseHistorySection.skeleton />
                </div>
            </div>

        </ProfileViewLayout>
    )
}
