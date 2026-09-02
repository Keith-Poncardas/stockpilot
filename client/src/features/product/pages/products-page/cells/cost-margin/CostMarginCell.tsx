import type { Row } from '@tanstack/react-table';
import { formatCurrency } from '@/lib/utils';
import type { IProduct } from '../../../../types';

interface CostMarginCellProps {
    row: Row<IProduct>;
}

export function CostMarginCell({ row }: CostMarginCellProps) {
    const { costPrice, unitPrice } = row.original;
    const margin =
        costPrice != null && unitPrice > 0
            ? (((unitPrice - costPrice) / unitPrice) * 100).toFixed(1)
            : null;

    return (
        <div className="flex flex-col text-left py-1">
            <span
                className="text-sm font-medium text-slate-600"
                style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}
            >
                {costPrice != null ? formatCurrency(costPrice) : '—'}
            </span>
            {margin !== null ? (
                <span className="text-[10px] text-emerald-600 font-semibold font-mono">
                    {margin}% margin
                </span>
            ) : (
                <span className="text-[10px] text-slate-400 font-mono">No cost recorded</span>
            )}
        </div>
    );
}
