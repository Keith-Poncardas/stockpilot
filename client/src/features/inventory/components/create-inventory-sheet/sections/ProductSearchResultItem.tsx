import { formatCurrency } from '@/lib/utils';
import type { ProductSearchItem } from '../../../types';

interface ProductSearchResultItemProps {
    product: ProductSearchItem & { isAddedInventory?: boolean };
    onSelect: (product: ProductSearchItem) => void;
}

export function ProductSearchResultItem({ product: p, onSelect }: ProductSearchResultItemProps) {
    return (
        <li
            role="option"
            aria-disabled={p.isAddedInventory}
            onMouseDown={(e) => {
                e.preventDefault();
                if (p.isAddedInventory) return;
                onSelect(p);
            }}
            className={`flex items-center justify-between gap-3 px-3.5 py-2.5 transition-colors ${
                p.isAddedInventory
                    ? 'cursor-not-allowed opacity-50 bg-slate-50'
                    : 'cursor-pointer hover:bg-slate-100/80'
            }`}
        >
            <div className="min-w-0">
                <p className="text-sm font-medium text-slate-800 truncate">{p.name}</p>
                <p className="font-mono text-xs text-slate-500">{p.sku}</p>
            </div>
            {p.isAddedInventory ? (
                <span className="shrink-0 font-mono text-[10px] uppercase tracking-wide text-slate-400 border border-slate-200 rounded px-1.5 py-0.5 bg-slate-50">
                    In inventory
                </span>
            ) : (
                <span className="shrink-0 font-mono text-xs font-semibold text-slate-600">
                    {formatCurrency(p.unitPrice)}
                </span>
            )}
        </li>
    );
}
