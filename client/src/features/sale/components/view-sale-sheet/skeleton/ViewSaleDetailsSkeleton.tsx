import { ViewSaleDetailsLayout } from "../layout";
import {
    PurchasedItemsSection,
    TransactionSummaryCard,
    CashierInfoCard,
    CustomerInfoCard,
} from "../sections";
import { Skeleton } from "@/components/ui/skeleton";

export function ViewSaleDetailsSkeleton() {
    return (
        <ViewSaleDetailsLayout
            transactionSummary={<TransactionSummaryCard.Skeleton />}
            cashierInfo={<CashierInfoCard.Skeleton />}
            customerInfo={<CustomerInfoCard.Skeleton />}
            purchasedItems={<PurchasedItemsSection.Skeleton />}
            actions={
                <>
                    <Skeleton className="h-11 w-32" />
                    <Skeleton className="h-11 w-28" />
                </>
            }
        />
    );
}
