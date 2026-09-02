import { useWatch, type Control } from 'react-hook-form';
import { computeStockImpact } from '../../../utils';
import type { AdjustStockFormValues, StockImpactData } from '../../../types';

export interface UseStockImpactPreviewOptions {
    control: Control<AdjustStockFormValues>;
    currentStock: number;
    reorderLevel: number;
    maxStock: number;
}

export function useStockImpactPreview({
    control,
    currentStock,
    reorderLevel,
    maxStock,
}: UseStockImpactPreviewOptions): StockImpactData {
    const adjustmentType = useWatch({ control, name: 'adjustmentType' }) ?? 'increase';
    const quantity = useWatch({ control, name: 'quantity' }) ?? 0;

    return computeStockImpact(adjustmentType, quantity, currentStock, reorderLevel, maxStock);
}
