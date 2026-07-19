import { useWatch, type Control } from "react-hook-form";
import type { AdjustStockFormValues, AdjustmentType } from "../components/pages/adjust-stock-page/types";

// ─── Output types ─────────────────────────────────────────────────────────────

export type StockImpactStatus = "ok" | "warning" | "error";

export interface StockImpactData {
    /** Stock value before this adjustment */
    currentStock: number;
    /** Projected stock value after this adjustment */
    newStock: number;
    /** Signed delta (+/-/0) */
    delta: number;
    /** Formatted delta string e.g. "+25 units", "−10 units", "No change" */
    deltaLabel: string;
    /** ok = within bounds, warning = below reorder, error = negative */
    status: StockImpactStatus;
    /** The adjustment direction — useful for color-coding in the UI */
    adjustmentType: AdjustmentType;
    /** True when newStock < reorderLevel */
    isBelowReorder: boolean;
    /** True when newStock < 0 */
    isNegative: boolean;
    /** True when newStock > maxStock */
    isAboveMax: boolean;
}

// ─── Input ────────────────────────────────────────────────────────────────────

export interface UseStockImpactPreviewOptions {
    control: Control<AdjustStockFormValues>;
    currentStock: number;
    reorderLevel: number;
    maxStock: number;
}

// ─── Pure computation (exported for unit-testing) ─────────────────────────────

export function computeStockImpact(
    adjustmentType: AdjustmentType,
    quantity: number,
    currentStock: number,
    reorderLevel: number,
    maxStock: number,
): StockImpactData {
    const qty = Math.max(0, quantity ?? 0);

    let newStock: number;
    let delta: number;

    switch (adjustmentType) {
        case "increase":
            newStock = currentStock + qty;
            delta = qty;
            break;
        case "decrease":
            newStock = currentStock - qty;
            delta = -qty;
            break;
        case "set":
            newStock = qty;
            delta = qty - currentStock;
            break;
    }

    const isNegative = newStock < 0;
    const isBelowReorder = !isNegative && newStock < reorderLevel;
    const isAboveMax = newStock > maxStock;

    let status: StockImpactStatus = "ok";
    if (isNegative) status = "error";
    else if (isBelowReorder) status = "warning";

    const absDelta = Math.abs(delta);
    let deltaLabel: string;
    if (delta === 0) deltaLabel = "No change";
    else if (delta > 0) deltaLabel = `+${absDelta} unit${absDelta !== 1 ? "s" : ""}`;
    else deltaLabel = `−${absDelta} unit${absDelta !== 1 ? "s" : ""}`;

    return {
        currentStock,
        newStock,
        delta,
        deltaLabel,
        status,
        adjustmentType,
        isBelowReorder,
        isNegative,
        isAboveMax,
    };
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useStockImpactPreview({
    control,
    currentStock,
    reorderLevel,
    maxStock,
}: UseStockImpactPreviewOptions): StockImpactData {
    const adjustmentType = useWatch({ control, name: "adjustmentType" }) ?? "increase";
    const quantity = useWatch({ control, name: "quantity" }) ?? 0;

    return computeStockImpact(adjustmentType, quantity, currentStock, reorderLevel, maxStock);
}
