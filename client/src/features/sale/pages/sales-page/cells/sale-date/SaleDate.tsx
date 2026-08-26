
import { formatDate, formatTime } from "@/lib/utils";
import type { SaleCellProps } from "../cells.types";

/**
 * Renders the formatted date and time for a sale table cell.
 */
export function SaleDateCell({ row }: SaleCellProps) {
    const saleDate = row.original.saleDate;

    if (!saleDate) {
        return <span className="text-sm text-slate-400">—</span>;
    };

    try {
        return (
            <div className="flex flex-col text-left">
                <span className="text-sm font-medium text-slate-700">
                    {formatDate(saleDate)}
                </span>
                <span className="text-xs text-slate-400 font-mono mt-0.5">
                    {formatTime(saleDate)}
                </span>
            </div>
        );
    } catch {
        return <span className="text-sm text-slate-400">—</span>;
    }
};