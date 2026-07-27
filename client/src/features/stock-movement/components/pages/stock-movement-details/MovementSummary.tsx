import { FormSection } from '@/components/ui/form-section';
import { MovementIcon } from '@/components/ui/stock-movement-ledger';
import { Box } from 'lucide-react';
import { cn, formatDate } from '@/lib/utils';
import type { IStockMovement, MovementType } from '@/features/stock-movement/stock-movement.types';
import { getMovementColor, getMovementPrefix } from './movement-details.utils';

const MOVEMENT_TYPE_LABEL: Record<MovementType, string> = {
    IN: 'Stock In',
    OUT: 'Stock Out',
    ADJUSTMENT: 'Adjustment',
};

const MOVEMENT_REASON_LABEL: Record<IStockMovement['reason'], string> = {
    SALE: 'Sale',
    PURCHASE: 'Purchase',
    ADJUSTMENT: 'Adjustment',
    RETURN: 'Return',
    DAMAGE: 'Damage',
    EXPIRED: 'Expired',
    TRANSFER: 'Transfer',
    INITIAL_STOCK: 'Initial Stock',
};

function getIconWrapperColor(type: MovementType): string {
    switch (type) {
        case 'IN':
            return 'bg-emerald-50 text-emerald-600';
        case 'OUT':
            return 'bg-rose-50 text-rose-600';
        case 'ADJUSTMENT':
        default:
            return 'bg-amber-50 text-amber-600';
    }
}

function getMovementDescription(type: MovementType): string {
    switch (type) {
        case 'IN':
            return 'Stock received into inventory';
        case 'OUT':
            return 'Stock removed from inventory';
        case 'ADJUSTMENT':
        default:
            return 'Stock level manually adjusted';
    }
}

interface MovementSummaryProps {
    movement: IStockMovement;
}

export function MovementSummary({ movement }: MovementSummaryProps) {
    const { type, quantity, reference, reason, notes, createdAt } = movement;

    const quantityColor = getMovementColor(type);
    const iconWrapperColor = getIconWrapperColor(type);
    const description = getMovementDescription(type);
    const prefix = getMovementPrefix(type);
    const typeLabel = MOVEMENT_TYPE_LABEL[type];
    const reasonLabel = MOVEMENT_REASON_LABEL[reason];

    return (
        <FormSection
            title="Movement Summary"
            description="Overview of the stock movement"
            icon={<Box className="w-4.5 h-4.5" strokeWidth={2} />}
            iconWrapperClassName="bg-blue-50 text-blue-600"
        >
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
        </FormSection>
    );
}


function MovementSummarySkeleton() {
    return (
        <FormSection
            title="Movement Summary"
            description="Overview of the stock movement"
            icon={<Box className="w-4.5 h-4.5" strokeWidth={2} />}
            iconWrapperClassName="bg-blue-50 text-blue-600"
        >
            {/* Quantity hero - full width skeleton */}
            <div className="flex items-start gap-4 my-3">
                <div className="h-12 w-12 rounded-lg bg-slate-100 animate-pulse shrink-0" />
                <div className="flex-1">
                    <div className="h-8 w-32 bg-slate-100 animate-pulse rounded mb-1.5" />
                    <div className="h-5 w-48 bg-slate-100 animate-pulse rounded" />
                </div>
            </div>

            {/* Key details grid - skeleton version */}
            <dl className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-4">
                <div>
                    <div className="h-3 w-16 bg-slate-100 animate-pulse rounded mb-1" />
                    <div className="h-6 w-20 bg-slate-100 animate-pulse rounded" />
                </div>
                <div>
                    <div className="h-3 w-28 bg-slate-100 animate-pulse rounded mb-1" />
                    <div className="h-6 w-24 bg-slate-100 animate-pulse rounded" />
                </div>
                <div>
                    <div className="h-3 w-10 bg-slate-100 animate-pulse rounded mb-1" />
                    <div className="h-6 w-16 bg-slate-100 animate-pulse rounded" />
                </div>
            </dl>

            {/* Notes - skeleton */}
            <div className="mt-4 pt-4 border-t border-slate-100">
                <div className="h-3 w-12 bg-slate-100 animate-pulse rounded mb-1.5" />
                <div className="h-6 w-full bg-slate-100 animate-pulse rounded" />
            </div>
        </FormSection>
    );
}

MovementSummary.skeleton = MovementSummarySkeleton;