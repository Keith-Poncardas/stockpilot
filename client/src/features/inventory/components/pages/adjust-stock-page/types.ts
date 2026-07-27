import type { StockMovementReason } from "@/constants";

export type AdjustmentType = "increase" | "decrease" | "set";

export type AdjustmentReason = StockMovementReason;

export interface AdjustStockFormValues {
    adjustmentType: AdjustmentType;
    quantity: number;
    /** Typed reason code — saved to the audit log */
    reason?: AdjustmentReason;
    /** Reference number (PO, transfer order, etc.) */
    reference?: string;
    /** YYYY-MM-DD date string — from DatePicker */
    adjustmentDate?: string;
    /** Free-text notes — max 250 chars */
    notes?: string;
}
