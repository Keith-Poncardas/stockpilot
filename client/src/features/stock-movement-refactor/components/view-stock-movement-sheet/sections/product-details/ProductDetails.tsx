import { useMemo, useState } from 'react';
import { FormSection } from '@/components/ui/form-section';
import { Package } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { getOptimizedImageUrl } from '@/lib/cloudinary';
import { StatusBadge } from '@/components/StatusBadge';
import type { ProductDetailsProps } from './types';
import { ProductDetailsLayout } from './ProductDetailsLayout';
import { ProductDetailsSkeleton } from './ProductDetailsSkeleton';
import { useViewStockMovementSheet } from '../../hooks';
import { useViewProductSheet } from '@/features/product/components/view-product-sheet';

export function ProductDetails({ movement }: ProductDetailsProps) {
    const { product } = movement;
    const [imageError, setImageError] = useState(false);
    const { onClose: closeStockMovementSheet } = useViewStockMovementSheet();
    const { onOpen: openProductSheet } = useViewProductSheet();

    const handleViewProduct = () => {
        if (product?.id) {
            closeStockMovementSheet();
            openProductSheet(product.id);
        }
    };

    const formattedUnitPrice = useMemo(() => formatCurrency(product.unitPrice), [product.unitPrice]);

    const formattedCostPrice = useMemo(() => {
        return product.costPrice !== null ? formatCurrency(product.costPrice) : null;
    }, [product.costPrice]);

    const hasImage = Boolean(product.imageUrl) && !imageError;
    const optimizedImage = hasImage && product.imageUrl
        ? getOptimizedImageUrl(product.imageUrl, { width: 112, height: 112, crop: 'fill' })
        : null;

    return (
        <FormSection
            title="Product"
            description="Details of the product affected by this movement."
            icon={<Package className="w-4.5 h-4.5" strokeWidth={2} />}
            iconWrapperClassName="bg-blue-50 text-blue-600"
            actions={
                <button
                    type="button"
                    onClick={handleViewProduct}
                    className="text-xs font-medium text-indigo-600 hover:text-indigo-500 transition-colors cursor-pointer"
                >
                    View full product →
                </button>
            }
        >
            <ProductDetailsLayout
                identityRow={
                    <>
                        <div className='flex items-center gap-4'>
                            <div className="h-14 w-14 rounded-lg bg-slate-100 border border-slate-200/80 flex items-center justify-center text-slate-400 shrink-0 overflow-hidden shadow-2xs">
                                {optimizedImage ? (
                                    <img
                                        src={optimizedImage}
                                        alt={product.name}
                                        className="w-full h-full object-cover"
                                        onError={() => setImageError(true)}
                                        loading="lazy"
                                    />
                                ) : (
                                    <Package className="w-5 h-5" strokeWidth={2} />
                                )}
                            </div>
                            <div className="min-w-0">
                                <p className="font-semibold text-slate-900 truncate">{product.name}</p>
                                <p className="text-sm text-slate-500 font-mono">{product.sku}</p>
                            </div>
                        </div>
                        <StatusBadge value={product.status} />
                    </>
                }
                pricingGrid={
                    <>
                        <div>
                            <div className="text-xs text-slate-400 mb-1">Unit Price</div>
                            <div className="text-sm font-medium text-slate-900">
                                {formattedUnitPrice}
                            </div>
                        </div>
                        <div>
                            <div className="text-xs text-slate-400 mb-1">Cost Price</div>
                            <div className="text-sm font-medium text-slate-900">
                                {formattedCostPrice !== null
                                    ? formattedCostPrice
                                    : <span className="text-slate-400 italic font-normal">Not set</span>
                                }
                            </div>
                        </div>
                    </>
                }
            />
        </FormSection>
    );
}

ProductDetails.Skeleton = ProductDetailsSkeleton;
