import { useMemo } from "react";
import type { SaleStatus } from "@/features/sale/types";

export function useSaleStatus(status?: SaleStatus) {
    return useMemo(() => ({
        isRefunded: status === "REFUNDED",
        isVoided: status === "VOIDED",
        isCompleted: status === "COMPLETED",
        isPending: status === "PENDING",
    }), [status]);
}

