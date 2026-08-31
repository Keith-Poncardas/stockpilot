import type { Row } from '@tanstack/react-table';
import { NumberBadge } from '@/components';
import type { ICustomer } from '../../../../types';

interface TotalOrdersCellProps {
    row: Row<ICustomer>;
}

export function TotalOrdersCell({ row }: TotalOrdersCellProps) {
    const orders = row.original.purchaseSummary?.totalOrders ?? 0;
    return (
        <div className="flex justify-center py-1">
            <NumberBadge
                count={orders}
                variant={orders > 0 ? 'brand' : 'default'}
            />
        </div>
    );
}
