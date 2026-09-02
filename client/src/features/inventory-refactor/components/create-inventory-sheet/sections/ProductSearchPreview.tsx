import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/StatusBadge';
import { X } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import type { IInventoryProduct } from '../../../types';

interface ProductSearchPreviewProps {
    product: Partial<IInventoryProduct> | null;
    onClear: () => void;
}

export function ProductSearchPreview({ product, onClear }: ProductSearchPreviewProps) {
    if (!product) return null;

    return (
        <div className="mt-4 rounded-xl border border-slate-200/80 bg-slate-50/80 p-4 shadow-2xs">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <p
                        id="detail-name"
                        className="font-semibold text-slate-900 leading-snug truncate"
                    >
                        {product.name}
                    </p>
                    <p id="detail-sku" className="font-mono text-xs mt-0.5 text-slate-500">
                        {product.sku}
                    </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                    {product.status && <StatusBadge value={product.status} className="shrink-0" />}
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={onClear}
                        aria-label="Remove selected product"
                        className="h-8 w-8 p-0 text-slate-400 hover:text-slate-600"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            </div>
            {product.description && (
                <p className="mt-2 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {product.description}
                </p>
            )}
            <dl className="mt-3 grid grid-cols-2 gap-3 border-t border-slate-200/80 pt-3">
                <div>
                    <dt className="text-xs text-slate-500 font-medium">Selling Price</dt>
                    <dd className="font-mono text-sm font-semibold text-slate-900 mt-0.5">
                        {formatCurrency(product.unitPrice ?? 0)}
                    </dd>
                </div>
                <div>
                    <dt className="text-xs text-slate-500 font-medium">Cost Price</dt>
                    <dd className="font-mono text-sm font-semibold text-slate-700 mt-0.5">
                        {product.costPrice ? formatCurrency(product.costPrice) : '—'}
                    </dd>
                </div>
            </dl>
        </div>
    );
}
