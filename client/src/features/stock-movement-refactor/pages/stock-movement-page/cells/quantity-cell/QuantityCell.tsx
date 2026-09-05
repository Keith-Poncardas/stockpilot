import type { Row } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, RefreshCw } from "lucide-react";
import { cn, formatNumber } from "@/lib/utils";
import type { IStockMovementWithRelations } from "@/features/stock-movement-refactor/types";

interface QuantityCellProps {
    row: Row<IStockMovementWithRelations>;
}

export function QuantityCell({ row }: QuantityCellProps) {
    const { quantity, type } = row.original;
    const formattedQty = formatNumber(quantity);

    const prefix = type === "IN" ? "+" : type === "OUT" ? "-" : "±";

    return (
        <div className="flex justify-center items-center">
            <span
                className={cn(
                    "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-mono text-xs font-bold border shadow-2xs transition-all",
                    type === "IN" && "bg-emerald-50/90 text-emerald-700 border-emerald-200/80 shadow-emerald-500/5",
                    type === "OUT" && "bg-rose-50/90 text-rose-700 border-rose-200/80 shadow-rose-500/5",
                    type === "ADJUSTMENT" && "bg-purple-50/90 text-purple-700 border-purple-200/80 shadow-purple-500/5"
                )}
            >
                {type === "IN" && <ArrowDown className="w-3 h-3 text-emerald-600 stroke-[2.5]" />}
                {type === "OUT" && <ArrowUp className="w-3 h-3 text-rose-600 stroke-[2.5]" />}
                {type === "ADJUSTMENT" && <RefreshCw className="w-2.5 h-2.5 text-purple-600 stroke-[2.5]" />}
                <span className="tracking-tight">{`${prefix}${formattedQty}`}</span>
                <span className="text-[10px] font-normal opacity-60 font-sans tracking-normal uppercase">units</span>
            </span>
        </div>
    );
}

