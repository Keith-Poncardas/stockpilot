import type { Row } from '@tanstack/react-table';
import { formatDate } from '@/lib/utils';
import type { ICustomer } from '../../../../types';

interface CustomerSinceCellProps {
    row: Row<ICustomer>;
}

export function CustomerSinceCell({ row }: CustomerSinceCellProps) {
    return (
        <div className="flex flex-col py-1">
            <span
                className="text-xs font-medium text-slate-600"
                style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}
            >
                {formatDate(row.original.createdAt)}
            </span>
        </div>
    );
}
