import type { ISaleDetails } from "@/features/sale/types";

export interface TransactionSummaryCardProps {
    sale: ISaleDetails;
}

export interface CashierInfoCardProps {
    user: ISaleDetails["author"];
}

export interface CustomerInfoCardProps {
    customer: ISaleDetails["customer"];
}

