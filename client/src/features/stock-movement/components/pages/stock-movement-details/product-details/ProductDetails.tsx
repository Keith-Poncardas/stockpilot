import { memo, useMemo } from 'react';
import { FormSection } from '@/components/ui/form-section';
import { Package } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { StatusBadge } from '@/components/StatusBadge';
import type { ProductDetailsProps } from './types';
import { ProductDetailsLayout } from './ProductDetailsLayout';
import { ProductDetailsSkeleton } from './ProductDetailsSkeleton';
import { PATHS } from '@/routes';

/**
 * Product details component for displaying information about the product
 * affected by the stock movement.
 *
 * @param {ProductDetailsProps} props - The properties for the product details component.
 * @param {import("@/features/stock-movement/types").IStockMovementWithRelations} props.movement - The stock movement object containing product information.
 * @returns {JSX.Element} The rendered product details component.
 */
const ProductDetailsComponent = memo(function ProductDetails({ movement }: ProductDetailsProps) {
    const { product } = movement;

    const formattedUnitPrice = useMemo(() => formatCurrency(product.unitPrice), [product.unitPrice]);

    const formattedCostPrice = useMemo(() => {
        return product.costPrice !== null ? formatCurrency(product.costPrice) : null;
    }, [product.costPrice]);

    return (
        <FormSection
            title="Product"
            description="Details of the product affected by this movement."
            icon={<Package className="w-4.5 h-4.5" strokeWidth={2} />}
            iconWrapperClassName="bg-blue-50 text-blue-600"
            link={{
                to: PATHS.products.view(product.id),
                linkText: 'View full product →'
            }}
        >
            <ProductDetailsLayout
                identityRow={
                    <>
                        <div className='flex items-center gap-4'>
                            <div className="h-14 w-14 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 shrink-0">
                                <Package className="w-5 h-5" strokeWidth={2} />
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
});

export const ProductDetails = Object.assign(ProductDetailsComponent, {
    Skeleton: ProductDetailsSkeleton
});
