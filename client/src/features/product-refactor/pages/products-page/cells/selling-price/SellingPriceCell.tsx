import type { Row } from '@tanstack/react-table';
import { formatCurrency } from '@/lib/utils';
import type { IProduct } from '../../../../types';

interface SellingPriceCellProps {
    row: Row<IProduct>;
}

export function SellingPriceCell({ row }: SellingPriceCellProps) {
    return (
        <div className="flex flex-col text-left py-1">
            <span
                className="text-sm font-bold text-slate-900"
                style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}
            >
                {formatCurrency(row.original.unitPrice)}
            </span>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                Unit Price
            </span>
        </div>
    );
}
