import { MovementIcon } from '@/components/ui/stock-movement-ledger';
import { MovementSummaryLayout } from './MovementSummaryLayout';
import { MovementSummarySkeleton } from './MovementSummarySkeleton';
import { cn, formatDate } from '@/lib/utils';
import { useMovementSummary } from './useMovementSummary';
import type { MovementSummaryProps } from './types';

/**
 * Component that displays a comprehensive summary of a stock movement.
 * Shows the quantity change, reference, movement type, reason, date, and any associated notes.
 *
 * @param {MovementSummaryProps} props - The properties for the component.
 * @returns {JSX.Element} The rendered movement summary component.
 */
export function MovementSummary({ movement }: MovementSummaryProps) {
    const { type, quantity, reference, notes, createdAt } = movement;

    const {
        quantityColor,
        iconWrapperColor,
        description,
        prefix,
        typeLabel,
        reasonLabel
    } = useMovementSummary(movement);

    return (
        <MovementSummaryLayout>
            {/* Quantity hero */}
            <div className="flex items-start gap-4 my-3">
                <div className={cn('h-12 w-12 rounded-lg flex items-center justify-center shrink-0', iconWrapperColor)}>
                    <MovementIcon type={type} />
                </div>
                <div>
                    <p className={cn('text-3xl font-bold', quantityColor)}>
                        {prefix}{quantity.toLocaleString()}{' '}
                        <span className="text-lg font-medium text-slate-400">units</span>
                    </p>
                    <p className="text-sm text-slate-500 mt-0.5">{description}</p>
                </div>
            </div>

            {/* Key details grid */}
            <dl className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-4">
                <div>
                    <dt className="text-xs text-slate-400 mb-1">Reference</dt>
                    <dd className="text-sm font-mono font-medium text-slate-900">
                        {reference ?? <span className="text-slate-400 font-sans font-normal italic">—</span>}
                    </dd>
                </div>
                <div>
                    <dt className="text-xs text-slate-400 mb-1">Movement Type</dt>
                    <dd className="text-sm font-medium text-slate-900">
                        {typeLabel} · {reasonLabel}
                    </dd>
                </div>
                <div>
                    <dt className="text-xs text-slate-400 mb-1">Date</dt>
                    <dd className="text-sm font-medium text-slate-900">
                        {formatDate(createdAt)}
                    </dd>
                </div>
            </dl>

            {/* Notes */}
            {notes && (
                <div className="mt-4 pt-4 border-t border-slate-100">
                    <dt className="text-xs text-slate-400 mb-1.5">Notes</dt>
                    <dd className="text-sm text-slate-600 leading-relaxed">{notes}</dd>
                </div>
            )}
        </MovementSummaryLayout>
    );
}

MovementSummary.Skeleton = MovementSummarySkeleton;