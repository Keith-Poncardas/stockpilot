import type { Row } from '@tanstack/react-table';
import { Package, Barcode } from 'lucide-react';
import type { IProduct } from '../../../../types';

interface ProductCellProps {
    row: Row<IProduct>;
}

export function ProductCell({ row }: ProductCellProps) {
    const product = row.original;
    return (
        <div className="flex items-center gap-3 py-1">
            {/* Image / Thumbnail Placeholder */}
            <div className="w-11 h-11 rounded-lg border border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center shrink-0 overflow-hidden shadow-xs group-hover:border-slate-300 transition-colors">
                {product.imageUrl ? (
                    <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <Package className="w-5 h-5 text-slate-400" strokeWidth={1.75} />
                )}
            </div>

            {/* Product Name & SKU Badge */}
            <div className="flex flex-col min-w-0">
                <span
                    className="text-sm font-bold text-slate-900 leading-snug truncate max-w-[220px]"
                    title={product.name}
                >
                    {product.name}
                </span>
                <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="inline-flex items-center gap-1 font-mono text-[11px] text-slate-500 font-medium bg-slate-100/90 px-1.5 py-0.5 rounded border border-slate-200/70">
                        <Barcode className="w-3 h-3 text-slate-400 shrink-0" />
                        {product.sku}
                    </span>
                </div>
            </div>
        </div>
    );
}
