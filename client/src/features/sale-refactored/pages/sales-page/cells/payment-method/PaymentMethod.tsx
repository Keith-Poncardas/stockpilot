import { ActionCellContent } from "@/components/common/action-cell-content/ActionCellContent";
import type { SaleCellProps } from "../cells.types";

/**
 * Renders the payment method cell in the table.
 * Uses ActionCellContent to display the payment method label.
 */
export function PaymentMethodCell({ row }: SaleCellProps) {
    const method = row.original.paymentMethod;

    if (!method) {
        return <span className="text-sm text-slate-400">—</span>;
    }

    return (
        <ActionCellContent
            label={method}
            isLocked={false}
            withBorder={false}
        />
    );
}
