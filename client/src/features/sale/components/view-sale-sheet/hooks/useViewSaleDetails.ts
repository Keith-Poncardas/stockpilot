import { useCallback } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_SALE } from "@/features/sale/operations/op.queries";
import { CHANGE_SALE_STATUS } from "@/features/sale/operations/op.mutations";
import type { ISaleDetails } from "@/features/sale/types";
import { toast } from "sonner";

export function useViewSaleDetails(saleId: string) {
    const { data, loading, error } = useQuery(GET_SALE, {
        variables: { saleId },
        skip: !saleId,
        fetchPolicy: "cache-and-network",
    });

    const [changeStatus, { loading: isMutating }] = useMutation(CHANGE_SALE_STATUS, {
        refetchQueries: ["GetSales", "GetSaleMetrics", "GetDashboardMetrics", "GetSale"],
        awaitRefetchQueries: true,
        onError: (err) => {
            console.error("Failed to change sale status:", err);
            toast.error(err.message || "Failed to change sale status");
        }
    });

    const handleRefund = useCallback(async () => {
        if (!saleId || isMutating) return;

        const confirmed = window.confirm(`Are you sure you want to mark this sale as REFUNDED?`);
        if (!confirmed) return;
        try {
            await changeStatus({
                variables: {
                    input: {
                        saleId,
                        status: "REFUNDED",
                    },
                },
            });
            toast.success("Sale has been refunded successfully");
        } catch {
            // Handled by onError
        }
    }, [saleId, isMutating, changeStatus]);

    const handleVoid = useCallback(async () => {
        if (!saleId || isMutating) return;

        const confirmed = window.confirm(`Are you sure you want to mark this sale as VOIDED?`);
        if (!confirmed) return;

        try {
            await changeStatus({
                variables: {
                    input: {
                        saleId,
                        status: "VOIDED",
                    },
                },
            });
            toast.success("Sale has been voided successfully");
        } catch {
            // Handled by onError
        }
    }, [saleId, isMutating, changeStatus]);

    const sale: ISaleDetails | undefined = data?.getSale;

    return {
        sale,
        loading,
        error,
        handleRefund,
        handleVoid,
        isMutating,
    };
}

