import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Undo2, Ban, AlertCircle } from "lucide-react";
import {
    PurchasedItemsSection,
    TransactionSummaryCard,
    CashierInfoCard,
    CustomerInfoCard
} from "./sections";
import { ViewSaleDetailsLayout } from "./layout";
import { ViewSaleDetailsSkeleton } from "./skeleton";
import { useViewSaleDetails, useSaleStatus } from "./hooks";

interface ViewSaleDetailsProps {
    saleId: string;
}

export function ViewSaleDetails({ saleId }: ViewSaleDetailsProps) {
    const {
        sale,
        loading,
        error,
        handleRefund,
        handleVoid,
        isMutating
    } = useViewSaleDetails(saleId);

    const { isRefunded, isVoided, isCompleted } = useSaleStatus(sale?.status);

    if (loading) {
        return <ViewSaleDetailsSkeleton />;
    }

    if (error || !sale) {
        return (
            <EmptyState
                title="Failed to load sale"
                description={error?.message || "Sale not found."}
                icon={AlertCircle}
                iconClassName="text-red-500 dark:text-red-400"
                iconWrapperClassName="bg-red-50 dark:bg-red-500/10"
            />
        );
    }

    return (
        <ViewSaleDetailsLayout
            transactionSummary={<TransactionSummaryCard sale={sale} />}
            cashierInfo={<CashierInfoCard user={sale.author} />}
            customerInfo={<CustomerInfoCard customer={sale.customer} />}
            purchasedItems={<PurchasedItemsSection items={sale.saleItems} totalAmount={sale.totalAmount} />}
            actions={
                <>
                    <Button
                        variant="outline"
                        className="h-11 px-5 text-base font-semibold"
                        onClick={handleRefund}
                        disabled={isMutating || !isCompleted}
                    >
                        <Undo2 className="mr-2 h-5 w-5" />
                        Refund
                    </Button>
                    <Button
                        variant="destructive"
                        className="h-11 flex-1 text-base font-semibold"
                        onClick={handleVoid}
                        disabled={isMutating || isRefunded || isVoided}
                    >
                        <Ban className="mr-2 h-5 w-5" />
                        Void
                    </Button>
                </>
            }
        />
    );
}

ViewSaleDetails.Skeleton = ViewSaleDetailsSkeleton;
