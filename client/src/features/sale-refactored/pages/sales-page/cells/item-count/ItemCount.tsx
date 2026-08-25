import { cn } from "@/lib/utils";
import type { SaleCellProps } from "../cells.types";

/**
 * Renders the total number of items associated with a sale.
 */
export function ItemCountCell({ row }: SaleCellProps) {
    const count = row.original.itemsCount;

    return (
        <div className="flex justify-center">
            <span className={cn(
                "inline-flex items-center justify-center min-w-6 h-6 px-1.5 rounded-full text-xs font-semibold font-mono",
                count > 0 ? "bg-slate-100 text-slate-700" : "bg-slate-50 text-slate-400"
            )}>
                {count}
            </span>
        </div>
    );
};
