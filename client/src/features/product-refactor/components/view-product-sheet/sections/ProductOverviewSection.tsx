import { useState } from 'react';
import { Image, Gift, Barcode, Package, Layers, Tag, Percent, ZoomIn } from 'lucide-react';
import { formatCurrency, cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { getOptimizedImageUrl } from '@/lib/cloudinary';
import { ProductImageLightboxDialog } from '../ProductImageLightboxDialog';
import type { IProduct, IProductBundleItem, IProductPricingTier } from '../../../types';

interface ProductOverviewSectionProps {
    product: Pick<IProduct, 'name' | 'sku' | 'imageUrl' | 'description' | 'unitPrice' | 'costPrice' | 'regularPrice' | 'productType' | 'margin'> & {
        bundleItems?: IProductBundleItem[] | null;
        pricingTiers?: IProductPricingTier[] | null;
    };
}

export function ProductOverviewSection({ product }: ProductOverviewSectionProps) {
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const isBundle = product.productType === 'BUNDLE';
    const hasBundleItems = product.bundleItems && product.bundleItems.length > 0;
    const hasPricingTiers = product.pricingTiers && product.pricingTiers.length > 0;

    const numUnit = Number(product.unitPrice) || 0;
    const numRegular = Number(product.regularPrice) || 0;
    const savings = numRegular > numUnit ? numRegular - numUnit : 0;
    const discountPercent = numRegular > 0 && numRegular > numUnit
        ? ((numRegular - numUnit) / numRegular) * 100
        : 0;

    return (
        <section className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row gap-6">
                <div
                    onClick={() => product.imageUrl && setIsLightboxOpen(true)}
                    className={cn(
                        "w-full sm:w-36 sm:h-36 h-44 rounded-xl border border-slate-200 flex items-center justify-center shrink-0 overflow-hidden relative group",
                        product.imageUrl ? "cursor-pointer bg-slate-50 hover:border-blue-400 shadow-2xs" : "bg-slate-100"
                    )}
                    title={product.imageUrl ? "Click to view full size" : undefined}
                >
                    {product.imageUrl ? (
                        <>
                            <img
                                src={getOptimizedImageUrl(product.imageUrl, { width: 320, height: 320, crop: 'fill' })}
                                alt={product.name || 'Product'}
                                className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-white text-xs font-semibold backdrop-blur-[2px]">
                                <ZoomIn className="w-4 h-4" />
                                <span>View</span>
                            </div>
                        </>
                    ) : isBundle ? (
                        <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600">
                            <Layers className="w-7 h-7" strokeWidth={1.8} />
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-1 text-slate-400">
                            <Image className="w-8 h-8" strokeWidth={1.5} />
                            <span className="text-[11px] font-medium">No image</span>
                        </div>
                    )}
                </div>

                <div className="flex-1 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                                Product Description
                            </h3>
                            {isBundle && (
                                <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 font-bold text-[10px] px-1.5 py-0">
                                    PRODUCT BUNDLE (COMBO / KIT)
                                </Badge>
                            )}
                        </div>
                        <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                            {product.description || 'No description provided for this product.'}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5 pt-4 border-t border-slate-100">
                        {/* Column 1: Selling Price / Bundle Price */}
                        <div className="min-w-0">
                            <p className="text-xs uppercase tracking-wide text-slate-400 font-semibold truncate">
                                {isBundle ? 'Bundle SRP (VAT-Inc)' : numRegular > numUnit ? 'Discounted SRP (VAT-Inc)' : 'SRP (VAT-Inc)'}
                            </p>
                            <div className="flex flex-wrap items-baseline gap-1.5 mt-1">
                                <span className="text-xl font-bold text-slate-900 font-mono">
                                    {formatCurrency(product.unitPrice)}
                                </span>
                                {discountPercent > 0 && (
                                    <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] font-bold px-1.5 py-0">
                                        {discountPercent.toFixed(0)}% OFF
                                    </Badge>
                                )}
                            </div>
                        </div>

                        {/* Column 2: Regular Sum (if bundle) or Original Price (if discount) or Cost Price */}
                        {numRegular > 0 ? (
                            <div className="min-w-0">
                                <p className="text-xs uppercase tracking-wide text-slate-400 font-semibold truncate">
                                    {isBundle ? 'Regular Sum' : 'Original Price'}
                                </p>
                                <p className="text-xl font-semibold text-slate-400 line-through font-mono mt-1">
                                    {formatCurrency(numRegular)}
                                </p>
                            </div>
                        ) : (
                            <div className="min-w-0">
                                <p className="text-xs uppercase tracking-wide text-slate-400 font-semibold truncate">
                                    Cost Price
                                </p>
                                <p className="text-xl font-semibold text-slate-600 font-mono mt-1">
                                    {product.costPrice != null ? formatCurrency(product.costPrice) : '—'}
                                </p>
                            </div>
                        )}

                        {/* Column 3: Cost Price (if regular price shown) or Margin */}
                        {numRegular > 0 ? (
                            <div className="min-w-0">
                                <p className="text-xs uppercase tracking-wide text-slate-400 font-semibold truncate">
                                    Cost Price
                                </p>
                                <p className="text-xl font-semibold text-slate-600 font-mono mt-1">
                                    {product.costPrice != null ? formatCurrency(product.costPrice) : '—'}
                                </p>
                            </div>
                        ) : (
                            <div className="min-w-0">
                                <p className="text-xs uppercase tracking-wide text-slate-400 font-semibold truncate">
                                    Margin
                                </p>
                                <p className="text-xl font-semibold text-emerald-600 font-mono mt-1">
                                    {product.margin != null ? `${product.margin.toFixed(1)}%` : '—'}
                                </p>
                            </div>
                        )}

                        {/* Column 4: Savings (if discount) or Margin */}
                        {savings > 0 ? (
                            <div className="min-w-0">
                                <p className="text-xs uppercase tracking-wide text-emerald-600 font-semibold truncate flex items-center gap-1">
                                    <Percent className="w-3 h-3" />
                                    {isBundle ? 'Bundle Savings' : 'Discount Savings'}
                                </p>
                                <p className="text-xl font-bold text-emerald-600 font-mono mt-1">
                                    {formatCurrency(savings)}
                                </p>
                            </div>
                        ) : (
                            <div className="min-w-0">
                                <p className="text-xs uppercase tracking-wide text-slate-400 font-semibold truncate">
                                    Margin
                                </p>
                                <p className="text-xl font-semibold text-emerald-600 font-mono mt-1">
                                    {product.margin != null ? `${product.margin.toFixed(1)}%` : '—'}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Bundle Component Products (If BUNDLE) */}
            {isBundle && hasBundleItems && (
                <div className="pt-5 border-t border-slate-100">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="p-1 rounded-md bg-purple-50 text-purple-700">
                            <Layers className="w-4 h-4" />
                        </div>
                        <h3 className="text-xs uppercase tracking-wider text-purple-900 font-bold">
                            Bundle Components ({product.bundleItems!.length})
                        </h3>
                        <span className="text-xs text-slate-400 font-normal">
                            — Items included and deducted from inventory upon bundle purchase
                        </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {product.bundleItems!.map((b) => (
                            <div
                                key={b.id}
                                className="flex items-center justify-between p-3 rounded-xl border border-purple-200/80 bg-purple-50/30 gap-3"
                            >
                                <div className="flex items-center gap-2.5 min-w-0">
                                    <div className="w-9 h-9 rounded-lg bg-white border border-purple-200 flex items-center justify-center shrink-0 text-purple-700 overflow-hidden shadow-2xs">
                                        {b.product?.imageUrl ? (
                                            <img
                                                src={getOptimizedImageUrl(b.product.imageUrl, { width: 72, height: 72, crop: 'fill' })}
                                                alt={b.product.name}
                                                className="w-full h-full object-cover"
                                                loading="lazy"
                                            />
                                        ) : (
                                            <Package className="w-4 h-4" />
                                        )}
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                        <span className="text-xs font-bold text-slate-900 truncate">
                                            {b.product?.name || 'Bundle Component'}
                                        </span>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            {b.product?.sku && (
                                                <span className="inline-flex items-center gap-1 font-mono text-[10px] text-slate-500">
                                                    <Barcode className="w-2.5 h-2.5" />
                                                    {b.product.sku}
                                                </span>
                                            )}
                                            {b.product?.unitPrice != null && (
                                                <span className="font-mono text-[11px] text-slate-500">
                                                    {formatCurrency(b.product.unitPrice)}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <Badge variant="outline" className="bg-white border-purple-300 text-purple-800 text-[11px] font-bold shrink-0">
                                    {b.quantity}x Component
                                </Badge>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Included Free Items (If SIMPLE product has bundled free gifts) */}
            {!isBundle && hasBundleItems && (
                <div className="pt-5 border-t border-slate-100">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="p-1 rounded-md bg-amber-50 text-amber-600">
                            <Gift className="w-4 h-4" />
                        </div>
                        <h3 className="text-xs uppercase tracking-wider text-slate-700 font-bold">
                            Included Free Items ({product.bundleItems!.length})
                        </h3>
                        <span className="text-xs text-slate-400 font-normal">
                            — Complimentary items bundled with this product
                        </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {product.bundleItems!.map((b) => (
                            <div
                                key={b.id}
                                className="flex items-center justify-between p-3 rounded-xl border border-amber-200/80 bg-amber-50/40 gap-3"
                            >
                                <div className="flex items-center gap-2.5 min-w-0">
                                    <div className="w-9 h-9 rounded-lg bg-white border border-amber-200 flex items-center justify-center shrink-0 text-amber-600 overflow-hidden shadow-2xs">
                                        {b.product?.imageUrl ? (
                                            <img
                                                src={getOptimizedImageUrl(b.product.imageUrl, { width: 72, height: 72, crop: 'fill' })}
                                                alt={b.product.name}
                                                className="w-full h-full object-cover"
                                                loading="lazy"
                                            />
                                        ) : (
                                            <Gift className="w-4 h-4" />
                                        )}
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                        <span className="text-xs font-bold text-slate-900 truncate">
                                            {b.product?.name || 'Free Item'}
                                        </span>
                                        {b.product?.sku && (
                                            <span className="inline-flex items-center gap-1 font-mono text-[10px] text-slate-500">
                                                <Barcode className="w-2.5 h-2.5" />
                                                {b.product.sku}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <Badge variant="outline" className="bg-white border-amber-300 text-amber-800 text-[11px] font-bold shrink-0">
                                    {b.quantity}x Free
                                </Badge>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Volume Pricing Deals & Complimentary Free Gifts */}
            {hasPricingTiers && (
                <div className="pt-5 border-t border-slate-100">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="p-1 rounded-md bg-indigo-50 text-indigo-600">
                            <Tag className="w-4 h-4" />
                        </div>
                        <h3 className="text-xs uppercase tracking-wider text-slate-700 font-bold">
                            Volume Pricing & Free Gift Deals ({product.pricingTiers!.length})
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {product.pricingTiers!.map((tier, idx) => {
                            const qtyLabel = tier.maxQuantity
                                ? tier.minQuantity === tier.maxQuantity
                                    ? `${tier.minQuantity} items`
                                    : `${tier.minQuantity} - ${tier.maxQuantity} items`
                                : `${tier.minQuantity}+ items`;
                            const effectivePerUnit = Number(tier.tierPrice) / tier.minQuantity;

                            return (
                                <div
                                    key={tier.id || idx}
                                    className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 flex flex-col justify-between gap-3"
                                >
                                    <div className="flex items-center justify-between">
                                        <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200 text-[11px] font-bold">
                                            {qtyLabel}
                                        </Badge>
                                        <span className="text-sm font-bold text-slate-900 font-mono">
                                            {formatCurrency(tier.tierPrice)}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between text-xs text-slate-500">
                                        <span>Unit rate:</span>
                                        <span className="font-mono font-medium text-slate-700">
                                            {formatCurrency(effectivePerUnit)} / item
                                        </span>
                                    </div>

                                    {tier.freeProduct && tier.freeQuantity && tier.freeQuantity > 0 && (
                                        <div className="pt-2 border-t border-slate-200/70 flex items-center justify-between text-xs bg-amber-50/80 -mx-3.5 -mb-3.5 p-2 px-3 rounded-b-xl border-amber-200/80">
                                            <div className="flex items-center gap-1.5 truncate text-amber-900 font-medium">
                                                <Gift className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                                                <span className="truncate">{tier.freeProduct.name}</span>
                                            </div>
                                            <Badge variant="outline" className="bg-white border-amber-300 text-amber-800 text-[10px] font-bold shrink-0">
                                                {tier.freeQuantity}x Free
                                            </Badge>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            <ProductImageLightboxDialog
                isOpen={isLightboxOpen}
                onClose={() => setIsLightboxOpen(false)}
                imageUrl={product.imageUrl}
                productName={product.name}
                sku={product.sku}
                isBundle={isBundle}
            />
        </section>
    );
}

ProductOverviewSection.Skeleton = function ProductOverviewSectionSkeleton() {
    return (
        <section className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs animate-pulse">
            <div className="flex flex-col sm:flex-row gap-6">
                <div className="w-full sm:w-36 sm:h-36 h-44 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                    <Image className="w-10 h-10 text-slate-300" strokeWidth={1.5} />
                </div>
                <div className="flex-1 space-y-3">
                    <div className="h-4 w-32 bg-slate-200 rounded" />
                    <div className="h-4 w-full bg-slate-100 rounded" />
                    <div className="h-4 w-3/4 bg-slate-100 rounded" />
                    <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-slate-100">
                        <div className="h-10 bg-slate-100 rounded" />
                        <div className="h-10 bg-slate-100 rounded" />
                        <div className="h-10 bg-slate-100 rounded" />
                    </div>
                </div>
            </div>
        </section>
    );
};
