import type { Row } from "@tanstack/react-table";
import { MapPin } from "lucide-react";
import { formatLocation } from "@/features/customer-refactor/utils";
import type { ICustomer } from "../../../../types";

interface LocationCellProps {
    row: Row<ICustomer>;
}

export function LocationCell({ row }: LocationCellProps) {
    const loc = formatLocation(row.original.cityCode, row.original.provinceCode);

    if (!loc || loc === '—') {
        return <span className="text-sm text-slate-400 font-mono">—</span>;
    }

    return (
        <span
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-700 bg-slate-100/80 border border-slate-200/60 px-2 py-0.5 rounded-md truncate max-w-80"
            title={loc}
        >
            <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
            <span className="truncate">{loc}</span>
        </span>
    );
}
