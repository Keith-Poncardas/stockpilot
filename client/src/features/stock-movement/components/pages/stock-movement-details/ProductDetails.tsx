import { FormSection } from '@/components/ui/form-section';
import { Package } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { StatusBadge } from '@/components/StatusBadge';
import type { IStockMovement } from '@/features/stock-movement/stock-movement.types';


interface ProductDetailsProps {
    movement: IStockMovement;
}

export function ProductDetails({ movement }: ProductDetailsProps) {
    const { product } = movement;

    return (
        <FormSection
            title="Product"
            description="Details of the product affected by this movement."
            icon={<Package className="w-4.5 h-4.5" strokeWidth={2} />}
            iconWrapperClassName="bg-blue-50 text-blue-600"
            link={{ to: `/products/${product.id}/view`, linkText: 'View full product' }}
        >
            {/* Product identity row */}
            <div className="flex items-center justify-between gap-4 mb-5">
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
            </div>

            {/* Pricing grid */}
            <dl className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-4">
                <div>
                    <dt className="text-xs text-slate-400 mb-1">Unit Price</dt>
                    <dd className="text-sm font-medium text-slate-900">
                        {formatCurrency(product.unitPrice)}
                    </dd>
                </div>
                <div>
                    <dt className="text-xs text-slate-400 mb-1">Cost Price</dt>
                    <dd className="text-sm font-medium text-slate-900">
                        {product.costPrice !== null
                            ? formatCurrency(product.costPrice)
                            : <span className="text-slate-400 italic font-normal">Not set</span>
                        }
                    </dd>
                </div>
            </dl>
        </FormSection>
    );
}

function ProductDetailsSkeleton() {
    return (
        <FormSection
            title="Product"
            description="Details of the product affected by this movement."
            icon={<Package className="w-4.5 h-4.5" strokeWidth={2} />}
            iconWrapperClassName="bg-blue-50 text-blue-600"
        >
            <div className="grid grid-cols-1 gap-5">
                {/* Product identity row skeleton */}
                <div className="flex items-center justify-between gap-4 mb-3">
                    <div className="flex items-center gap-4">
                        <div className="h-14 w-14 rounded-lg bg-slate-100 animate-pulse shrink-0" />
                        <div className="min-w-0">
                            <div className="h-8 w-48 bg-slate-100 animate-pulse rounded mb-1.5" />
                            <div className="h-5 w-24 bg-slate-100 animate-pulse rounded" />
                        </div>
                    </div>
                    <div className="h-8 w-20 bg-slate-100 animate-pulse rounded" />
                </div>

                {/* Pricing grid skeleton */}
                <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-3">
                    <div>
                        <div className="h-3 w-16 bg-slate-100 animate-pulse rounded mb-1" />
                        <div className="h-6 w-20 bg-slate-100 animate-pulse rounded" />
                    </div>
                    <div>
                        <div className="h-3 w-20 bg-slate-100 animate-pulse rounded mb-1" />
                        <div className="h-6 w-24 bg-slate-100 animate-pulse rounded" />
                    </div>
                </div>
            </div>
        </FormSection>
    );
}

ProductDetails.skeleton = ProductDetailsSkeleton;
