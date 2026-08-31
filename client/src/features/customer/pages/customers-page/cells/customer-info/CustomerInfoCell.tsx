import type { Row } from '@tanstack/react-table';
import { UserInfoCell } from '@/components';
import type { ICustomer } from '../../../../types';

interface CustomerInfoCellProps {
    row: Row<ICustomer>;
}

export function CustomerInfoCell({ row }: CustomerInfoCellProps) {
    const customer = row.original;
    return (
        <div className="flex items-center gap-3 py-1">
            <UserInfoCell
                user={{
                    id: customer.id,
                    firstName: customer.firstName ?? undefined,
                    lastName: customer.lastName ?? undefined,
                }}
                type="customer"
                isLink={false}
                avatarClassName="w-10 h-10 shadow-xs border border-slate-200"
            />
        </div>
    );
}
