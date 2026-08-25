import { useParams } from "react-router-dom";
import { useCallback, useMemo } from "react";
import { SALE_STATUS_COLORS, SALE_STATUS_LABELS } from "../sale.config";
import { useQuery } from "@apollo/client";
import { AlertTriangle, Receipt } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import ActionPopover from "@/components/ActionPopover";
import { formatDate, handleGraphQLError } from "@/lib/utils";
import { useOptimisticMutation } from "@/hooks/useOptimisticMutation";
import { GET_SALE, CHANGE_SALE_STATUS, GET_SALE_METRICS } from "../operations";
import { AVAILABLE_STATUSES, SaleStatus } from "../sale.constants";
import { getOptions } from "@/features/user/user.utils";
import {
    PurchasedItemsSection,
    TransactionSummaryCard,
    CashierInfoCard,
    CustomerInfoCard,
    ReceiptPreviewSection,
} from "../components";
import type { ISaleDetail } from "../sale.types";

export function SaleViewPage() {
    const { saleId } = useParams<{ saleId: string }>();
    const { mutate } = useOptimisticMutation();

    const { data, loading, error } = useQuery<{ getSale: ISaleDetail }>(GET_SALE, {
        variables: { saleId },
        skip: !saleId,
    });

    if (loading) {
        return (
            <>
                <Header.Skeleton />
                <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 flex flex-col gap-6">
                        <div className="h-64 rounded-2xl bg-gray-900/10 dark:bg-gray-800/20 animate-pulse" />
                    </div>
                    <div className="flex flex-col gap-6">
                        <div className="h-48 rounded-2xl bg-gray-900/10 dark:bg-gray-800/20 animate-pulse" />
                        <div className="h-48 rounded-2xl bg-gray-900/10 dark:bg-gray-800/20 animate-pulse" />
                    </div>
                </main>
            </>
        );
    }

    if (error || !data?.getSale) {
        return (
            <EmptyState
                icon={AlertTriangle}
                title="Sale not found"
                description={handleGraphQLError(error?.graphQLErrors[0]?.message ?? error?.networkError?.message)}
                showBackButton
            />
        );
    }

    const sale = data.getSale;
    const isStatusDisabled = sale.status === SaleStatus.VOIDED.a || sale.status === SaleStatus.REFUNDED.a;

    const handleUpdateStatus = useCallback(async (newStatus: string) => {
        await mutate({
            mutation: CHANGE_SALE_STATUS,
            typename: "SaleDetail",
            entityId: sale.id,
            optimisticFields: {
                status: newStatus,
            },
            buildVariables: ({ status }) => ({
                input: { saleId: sale.id, status },
            }),
            refetchQueries: [GET_SALE_METRICS],
        });
    }, [mutate, sale.id]);

    const statusOptions = useMemo(() => getOptions({
        items: AVAILABLE_STATUSES,
        currentValue: sale.status,
        getValue: (s) => s.a,
        labelConfig: SALE_STATUS_LABELS,
        colorConfig: SALE_STATUS_COLORS,
        onUpdate: handleUpdateStatus as (value: string) => void,
    }), [sale.status, handleUpdateStatus]);

    return (
        <>
            <Header
                title={`Sale #${sale.id.slice(0, 8)}`}
                subtitle={formatDate(sale.saleDate)}
                status={sale.status}
                actions={
                    <>
                        <Button
                            variant="glass"
                            onClick={() => console.log("Download receipt for:", sale.id)}
                            size="lg"
                        >
                            <Receipt className="w-4 h-4" />
                            Receipt
                        </Button>
                        <ActionPopover
                            title="Update Status"
                            options={statusOptions}
                            disabled={isStatusDisabled}
                        >
                            <Button
                                disabled={isStatusDisabled}
                                size="lg"
                            >
                                Update Status
                            </Button>
                        </ActionPopover>
                    </>
                }
            />

            <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6 max-sm:mb-15">
                <div className="lg:col-span-2 flex flex-col gap-6">
                    <PurchasedItemsSection
                        items={sale.saleItems}
                        totalAmount={sale.totalAmount}
                    />
                    <ReceiptPreviewSection sale={sale} />
                </div>

                <div className="flex flex-col gap-6">
                    <TransactionSummaryCard sale={sale} />
                    <CashierInfoCard user={sale.author} />
                    <CustomerInfoCard customer={sale.customer} />
                </div>
            </main>
        </>
    );
}
