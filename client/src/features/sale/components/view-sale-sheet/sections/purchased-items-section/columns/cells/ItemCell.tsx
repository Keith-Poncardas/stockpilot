import type { Row } from '@tanstack/react-table';
import { Barcode, Gift, Package, Layers } from 'lucide-react';
import type { SaleItem } from '@/features/sale/types';


interface ItemCellProps {
    row: Row<SaleItem>;
}

export function ItemCell({ row }: ItemCellProps) {
    const product = row.original.product;
    const isBundle = product?.productType === 'BUNDLE';
    const bundleCount = product?.bundleItems?.length ?? 0;

    return (
        <div className="flex items-center gap-3 py-1">
            <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0 text-slate-500 shadow-2xs">
                {isBundle ? (
                    <Layers className="w-4.5 h-4.5 text-purple-600" strokeWidth={1.75} />
                ) : (
                    <Package className="w-4.5 h-4.5" strokeWidth={1.75} />
                )}
            </div>
            <div className="flex flex-col min-w-0">
                <span className="font-semibold text-gray-900 dark:text-gray-100 text-sm leading-snug truncate max-w-[200px]" title={product.name}>
                    {product.name}
                </span>
                <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                    {product.sku && (
                        <span className="inline-flex items-center gap-1 font-mono text-[11px] text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.2 rounded border border-gray-200/70 dark:border-gray-700">
                            <Barcode className="w-3 h-3 text-gray-400 shrink-0" />
                            {product.sku}
                        </span>
                    )}
                    {isBundle && (
                        <span
                            className="inline-flex items-center gap-0.5 text-[10px] text-purple-700 dark:text-purple-300 font-bold bg-purple-50 dark:bg-purple-950/50 px-1.5 py-0.2 rounded border border-purple-200/80 dark:border-purple-800/60 shrink-0"
                            title={`Bundle package composed of ${bundleCount} component item(s)`}
                        >
                            <Layers className="w-2.5 h-2.5 text-purple-600 dark:text-purple-400" />
                            BUNDLE {bundleCount > 0 ? `(${bundleCount})` : ''}
                        </span>
                    )}
                    {!isBundle && bundleCount > 0 && (
                        <span
                            className="inline-flex items-center gap-0.5 text-[10px] text-amber-700 dark:text-amber-300 font-semibold bg-amber-50 dark:bg-amber-950/50 px-1.5 py-0.2 rounded border border-amber-200/80 dark:border-amber-800/60 shrink-0"
                            title={`Includes ${bundleCount} free bundled item(s)`}
                        >
                            <Gift className="w-2.5 h-2.5 text-amber-600 dark:text-amber-400" />
                            +{bundleCount} Free
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
