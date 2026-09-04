import { formatDate } from '@/lib/utils';
import type { InventoryRowProps } from '@/features/inventory/types';

export function LastUpdatedCell({ row }: InventoryRowProps) {
    return (
        <div className="flex flex-col py-1">
            <span
                className="text-xs font-medium text-slate-600"
                style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}
            >
                {formatDate(row.original.updatedAt)}
            </span>
        </div>
    );
}
