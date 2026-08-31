import type { Row } from '@tanstack/react-table';
import type { IProduct } from '../../../../types';

interface DescriptionCellProps {
    row: Row<IProduct>;
}

export function DescriptionCell({ row }: DescriptionCellProps) {
    const description = row.original.description;
    return (
        <div className="text-xs text-slate-600 leading-relaxed break-words whitespace-normal max-w-[280px] py-1">
            {description ? (
                <span>{description}</span>
            ) : (
                <span className="text-slate-400 italic">No description provided</span>
            )}
        </div>
    );
}
