import type { Row } from '@tanstack/react-table';
import { Phone } from 'lucide-react';
import type { ICustomer } from '../../../../types';

interface PhoneCellProps {
    row: Row<ICustomer>;
}

export function PhoneCell({ row }: PhoneCellProps) {
    const phone = row.original.phone;
    if (!phone) {
        return <span className="text-xs font-mono text-slate-400">—</span>;
    }
    return (
        <div className="flex items-center gap-1.5 text-xs font-mono text-slate-700 py-1">
            <span className="inline-flex items-center gap-1 bg-slate-100/90 px-2 py-0.5 rounded border border-slate-200/70 font-medium">
                <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                {phone}
            </span>
        </div>
    );
}
