import type { Row } from '@tanstack/react-table';
import { Mail } from 'lucide-react';
import type { ICustomer } from '../../../../types';

interface EmailCellProps {
    row: Row<ICustomer>;
}

export function EmailCell({ row }: EmailCellProps) {
    const email = row.original.email;
    if (!email) {
        return <span className="text-xs font-mono text-slate-400">—</span>;
    }
    return (
        <div className="flex items-center gap-1.5 text-xs font-mono text-slate-600 py-1" title={email}>
            <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate max-w-[180px]">{email}</span>
        </div>
    );
}
