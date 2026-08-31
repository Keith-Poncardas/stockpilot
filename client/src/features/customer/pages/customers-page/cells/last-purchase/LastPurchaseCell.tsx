import type { Row } from '@tanstack/react-table';
import { formatDate } from '@/lib/utils';
import type { ICustomer } from '../../../../types';

interface LastPurchaseCellProps {
    row: Row<ICustomer>;
}

export function LastPurchaseCell({ row }: LastPurchaseCellProps) {
    const lastPurchase = row.original.purchaseSummary?.lastPurchase;
    if (!lastPurchase) {
        return <span className="text-xs text-slate-400 italic py-1 block">No orders yet</span>;
    }
    return (
        <div className="flex flex-col py-1">
            <span
                className="text-xs font-medium text-slate-700"
                style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}
            >
                {formatDate(lastPurchase)}
            </span>
            <span className="text-[10px] text-slate-400 font-medium">
                Recent Activity
            </span>
        </div>
    );
}
