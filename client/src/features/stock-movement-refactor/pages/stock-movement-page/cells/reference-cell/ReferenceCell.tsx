import { useState } from "react";
import type { Row } from "@tanstack/react-table";
import { Hash, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import type { IStockMovementWithRelations } from "@/features/stock-movement-refactor/types";

interface ReferenceCellProps {
    row: Row<IStockMovementWithRelations>;
}

export function ReferenceCell({ row }: ReferenceCellProps) {
    const reference = row.original.reference;
    const [copied, setCopied] = useState(false);

    if (!reference) {
        return <span className="text-slate-400 text-xs font-mono italic">—</span>;
    }

    const handleCopy = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigator.clipboard.writeText(reference);
        setCopied(true);
        toast.success(`Copied reference "${reference}"`);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <button
            type="button"
            onClick={handleCopy}
            title={`Click to copy: ${reference}`}
            className="group/ref inline-flex items-center gap-1.5 font-mono text-xs text-slate-700 font-medium bg-slate-100/90 hover:bg-slate-200/90 px-2 py-0.5 rounded-md border border-slate-200/90 hover:border-slate-300 tracking-tight shadow-2xs transition-all cursor-pointer text-left"
        >
            <Hash className="w-3 h-3 text-slate-400 group-hover/ref:text-slate-600 shrink-0 transition-colors" />
            <span className="truncate max-w-[120px]">{reference}</span>
            {copied ? (
                <Check className="w-3 h-3 text-emerald-600 shrink-0" />
            ) : (
                <Copy className="w-2.5 h-2.5 text-slate-400 opacity-0 group-hover/ref:opacity-100 shrink-0 transition-opacity" />
            )}
        </button>
    );
}

