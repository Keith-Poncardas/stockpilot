import type { Row } from '@tanstack/react-table';
import { Package, Barcode, Layers } from 'lucide-react';
import { getOptimizedImageUrl } from '@/lib/cloudinary';

export interface ProductCellItem {
    name: string;
    sku?: string | null;
    imageUrl?: string | null;
    productType?: string | null;
}

export interface ProductCellProps {
    row?: Row<any>;
    product?: ProductCellItem | null;
    className?: string;
}

export function ProductCell({ row, product: propProduct, className }: ProductCellProps) {
    const raw = propProduct || row?.original?.product || row?.original;
    if (!raw) return null;

    const product: ProductCellItem = raw;
    const isBundle = product.productType === 'BUNDLE';

    return (
        <div className={`flex items-center gap-3 py-1 ${className ?? ''}`}>
            {/* Image / Thumbnail Placeholder */}
            <div className="w-10 h-10 rounded-lg border border-slate-200/80 bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center shrink-0 overflow-hidden shadow-2xs group-hover:border-slate-300 transition-colors">
                {product.imageUrl ? (
                    <img
                        src={getOptimizedImageUrl(product.imageUrl, { width: 80, height: 80, crop: 'fill' })}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                    />
                ) : isBundle ? (
                    <Layers className="w-4.5 h-4.5 text-purple-600" strokeWidth={1.75} />
                ) : (
                    <Package className="w-4.5 h-4.5 text-slate-400" strokeWidth={1.75} />
                )}
            </div>

            {/* Product Name & SKU */}
            <div className="flex flex-col min-w-0 max-w-[280px]">
                <span
                    className="text-sm font-semibold text-slate-900 leading-snug break-words whitespace-normal"
                    title={product.name}
                >
                    {product.name}
                </span>
                <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                    {product.sku && (
                        <span className="inline-flex items-center gap-1 font-mono text-[11px] text-slate-500 font-medium bg-slate-100/90 px-1.5 py-0.5 rounded border border-slate-200/70">
                            <Barcode className="w-3 h-3 text-slate-400 shrink-0" />
                            {product.sku}
                        </span>
                    )}

                    {isBundle && (
                        <span
                            className="inline-flex items-center gap-1 text-[10px] text-purple-700 font-semibold bg-purple-50 px-1.5 py-0.5 rounded border border-purple-200 shrink-0"
                            title="Product Bundle"
                        >
                            <Layers className="w-2.5 h-2.5 text-purple-600" />
                            Bundle
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
