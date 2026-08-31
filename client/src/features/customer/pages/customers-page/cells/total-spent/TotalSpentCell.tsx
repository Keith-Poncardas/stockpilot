import type { Row } from '@tanstack/react-table';
import { formatCurrency } from '@/lib/utils';
import type { ICustomer } from '../../../../types';

interface TotalSpentCellProps {
    row: Row<ICustomer>;
}

export function TotalSpentCell({ row }: TotalSpentCellProps) {
    const totalSpent = row.original.purchaseSummary?.totalSpent ?? 0;
    return (
        <div className="flex flex-col text-right py-1">
            <span
                className="text-sm font-bold text-slate-900"
                style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}
            >
                {formatCurrency(totalSpent)}
            </span>
            <span className="text-[10px] text-slate-400 font-medium">
                Lifetime Spend
            </span>
        </div>
    );
}
