import { formatCurrency } from "@/lib/utils";
import type { SaleCellProps } from "../cells.types";

/**
 * Renders the formatted total monetary amount for a sale.
 */
export function TotalAmountCell({ row }: SaleCellProps) {
    const totalAmount = row.original.totalAmount ?? 0;

    return (
        <div className="text-right text-sm font-bold text-slate-900">
            {formatCurrency(totalAmount)}
        </div>
    );
};
