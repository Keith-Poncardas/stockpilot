import type { Row } from '@tanstack/react-table';
import { Package, Barcode, Layers } from 'lucide-react';
import { getOptimizedImageUrl } from '@/lib/cloudinary';
import { useViewProductSheet } from '@/features/product/components/view-product-sheet';

export interface ProductCellItem {
    id?: string;
    name: string;
    sku?: string | null;
    imageUrl?: string | null;
    productType?: string | null;
}

export interface ProductCellProps {
    row?: Row<any>;
    product?: ProductCellItem | null;
    className?: string;
    enableViewSheet?: boolean;
}

export function ProductCell({ row, product: propProduct, className, enableViewSheet = false }: ProductCellProps) {
    const { onOpen: openViewProductSheet } = useViewProductSheet();

    const raw = propProduct || row?.original?.product || row?.original;
    if (!raw) return null;

    const product: ProductCellItem = raw;
    const productId = product.id || row?.original?.productId || row?.original?.product?.id;
    const isBundle = product.productType === 'BUNDLE';
    const canView = Boolean(enableViewSheet && productId);

    const handleClick = (e: React.MouseEvent) => {
        if (!canView || !productId) return;
        e.stopPropagation();
        openViewProductSheet(productId);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!canView || !productId) return;
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            e.stopPropagation();
            openViewProductSheet(productId);
        }
    };

    return (
        <div
            className={`flex items-center gap-3 py-1 ${canView ? 'cursor-pointer group text-left' : ''} ${className ?? ''}`}
            onClick={canView ? handleClick : undefined}
            onKeyDown={canView ? handleKeyDown : undefined}
            role={canView ? 'button' : undefined}
            tabIndex={canView ? 0 : undefined}
            title={canView ? `View details for ${product.name}` : undefined}
            aria-label={canView ? `View details for ${product.name}` : undefined}
        >
            {/* Image / Thumbnail Placeholder */}
            <div
                className={`w-10 h-10 rounded-lg border border-slate-200/80 bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center shrink-0 overflow-hidden shadow-2xs transition-all ${canView ? 'group-hover:border-blue-400/80 group-hover:shadow-xs' : ''
                    }`}
            >
                {product.imageUrl ? (
                    <img
                        src={getOptimizedImageUrl(product.imageUrl, { width: 80, height: 80, crop: 'fill' })}
                        alt={product.name}
                        className={`w-full h-full object-cover transition-transform duration-200 ${canView ? 'group-hover:scale-105' : ''
                            }`}
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
                    className={`text-sm font-semibold text-slate-900 leading-snug break-words whitespace-normal transition-colors ${canView ? 'group-hover:text-blue-600' : ''
                        }`}
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
