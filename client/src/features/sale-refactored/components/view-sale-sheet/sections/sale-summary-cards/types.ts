import type { ISaleDetails } from "@/features/sale-refactored/types";

export interface TransactionSummaryCardProps {
    sale: ISaleDetails;
}

export interface CashierInfoCardProps {
    user: ISaleDetails["author"];
}

export interface CustomerInfoCardProps {
    customer: ISaleDetails["customer"];
}
