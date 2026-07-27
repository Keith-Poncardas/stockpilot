import type { MovementType } from '@/features/stock-movement/stock-movement.types';

/**
 * Returns the sign prefix for a quantity/value based on movement type.
 *   IN  → '+'
 *   OUT → '-'
 *   ADJUSTMENT → '±'
 */
export function getMovementPrefix(type: MovementType): string {
    switch (type) {
        case 'IN':
            return '+';
        case 'OUT':
            return '-';
        case 'ADJUSTMENT':
        default:
            return '±';
    }
}

/**
 * Returns the Tailwind text-colour class for a quantity/value based on movement type.
 *   IN  → emerald
 *   OUT → rose
 *   ADJUSTMENT → amber
 */
export function getMovementColor(type: MovementType): string {
    switch (type) {
        case 'IN':
            return 'text-emerald-600';
        case 'OUT':
            return 'text-rose-600';
        case 'ADJUSTMENT':
        default:
            return 'text-amber-600';
    }
}

