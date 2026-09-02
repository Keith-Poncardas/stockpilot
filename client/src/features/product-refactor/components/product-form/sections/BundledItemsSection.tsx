import { useState, useRef, useMemo, useEffect } from 'react';
import { useFieldArray, useWatch, type Control, type UseFormSetValue } from 'react-hook-form';
import { Gift, Search, Trash2, Package, Barcode } from 'lucide-react';

import { FormSection } from '@/components/ui/form-section';
import { VirtualInfiniteList } from '@/components/ui/virtual-infinite-list';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { getOptimizedImageUrl } from '@/lib/cloudinary';
import { useInfiniteProductSearch } from '../../../hooks/useInfiniteProductSearch';
import type { ProductFormValues } from '../../../validation';
import type { IProduct, IProductBundleItem } from '../../../types';

interface BundledItemsSectionProps {
    control: Control<ProductFormValues>;
    setValue?: UseFormSetValue<ProductFormValues>;
    currentProductId?: string;
    initialBundleItems?: IProductBundleItem[] | null;
}

export function BundledItemsSection({
    control,
    setValue,
    currentProductId,
    initialBundleItems,
}: BundledItemsSectionProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const { fields, append, remove, update } = useFieldArray({
        control,
        name: 'bundleItems',
    });

    const watchedBundleItems = useWatch({
        control,
        name: 'bundleItems',
    });

    const productType = useWatch({
        control,
        name: 'productType',
    });

    const isBundle = productType === 'BUNDLE';

    const {
        items: searchResults,
        loading: searchLoading,
        isFetchingMore,
        hasNextPage,
        loadMore,
    } = useInfiniteProductSearch(searchTerm);

    // Cache of product details for rendering selected bundle items
    const [productDetailsMap, setProductDetailsMap] = useState<Map<string, IProduct>>(() => {
        const initialMap = new Map<string, IProduct>();
        if (initialBundleItems) {
            initialBundleItems.forEach((b) => {
                if (b.product) {
                    initialMap.set(b.bundledProductId || b.product.id, b.product);
                }
            });
        }
        return initialMap;
    });

    useEffect(() => {
        if (initialBundleItems) {
            setProductDetailsMap((prev) => {
                const next = new Map(prev);
                let changed = false;
                initialBundleItems.forEach((b) => {
                    const id = b.bundledProductId || b.product?.id;
                    if (id && b.product && !next.has(id)) {
                        next.set(id, b.product);
                        changed = true;
                    }
                });
                return changed ? next : prev;
            });
        }
    }, [initialBundleItems]);

    // Update map with newly loaded search results
    useEffect(() => {
        if (searchResults.length > 0) {
            setProductDetailsMap((prev) => {
                let hasNew = false;
                searchResults.forEach((p) => {
                    if (!prev.has(p.id)) {
                        hasNew = true;
                    }
                });
                if (!hasNew) return prev;
                const next = new Map(prev);
                searchResults.forEach((p) => {
                    next.set(p.id, p);
                });
                return next;
            });
        }
    }, [searchResults]);

    const selectedProductIds = useMemo(() => {
        return new Set(fields.map((f) => f.productId));
    }, [fields]);

    const filteredSearchItems = useMemo(() => {
        return searchResults.filter(
            (p) => p.id !== currentProductId && !selectedProductIds.has(p.id)
        );
    }, [searchResults, currentProductId, selectedProductIds]);

    const totalComponentSum = useMemo(() => {
        return fields.reduce((sum, field, index) => {
            const prod = productDetailsMap.get(field.productId);
            const rawQty = watchedBundleItems?.[index]?.quantity ?? field.quantity ?? 1;
            const qty = typeof rawQty === 'number' ? rawQty : 1;
            return sum + (Number(prod?.unitPrice) || 0) * qty;
        }, 0);
    }, [fields, productDetailsMap, watchedBundleItems]);

    const totalCostSum = useMemo(() => {
        return fields.reduce((sum, field, index) => {
            const prod = productDetailsMap.get(field.productId);
            const rawQty = watchedBundleItems?.[index]?.quantity ?? field.quantity ?? 1;
            const qty = typeof rawQty === 'number' ? rawQty : 1;
            return sum + (Number(prod?.costPrice) || 0) * qty;
        }, 0);
    }, [fields, productDetailsMap, watchedBundleItems]);

    // Auto-sync regularPrice and costPrice when in BUNDLE mode
    useEffect(() => {
        if (isBundle && setValue) {
            if (totalComponentSum > 0) {
                setValue('regularPrice', totalComponentSum, { shouldDirty: true, shouldValidate: true });
            } else if (fields.length === 0) {
                setValue('regularPrice', undefined, { shouldDirty: true, shouldValidate: true });
            }

            if (totalCostSum > 0) {
                setValue('costPrice', totalCostSum, { shouldDirty: true, shouldValidate: true });
            }
        }
    }, [isBundle, totalComponentSum, totalCostSum, setValue, fields.length]);

    const handleSelectProduct = (product: IProduct) => {
        setProductDetailsMap((prev) => {
            const next = new Map(prev);
            next.set(product.id, product);
            return next;
        });

        append({
            productId: product.id,
            quantity: 1,
        });

        setSearchTerm('');
        setIsSearchOpen(false);
    };

    const handleQuantityChange = (index: number, newQuantity: number) => {
        const currentItem = fields[index];
        if (!currentItem) return;

        const val = Math.max(1, isNaN(newQuantity) ? 1 : newQuantity);
        update(index, {
            ...currentItem,
            quantity: val,
        });
    };

    return (
        <FormSection
            title={isBundle ? 'Bundle Component Products' : 'Included Free Items'}
            description={
                isBundle
                    ? 'Attach catalog products and quantities included in this combo package. Inventory will be deducted from each component upon sale.'
                    : 'Attach complimentary products bundled and deducted automatically from inventory upon sale.'
            }
            icon={
                isBundle ? (
                    <Package className="w-4.5 h-4.5" strokeWidth={2} />
                ) : (
                    <Gift className="w-4.5 h-4.5" strokeWidth={2} />
                )
            }
            iconWrapperClassName={isBundle ? 'bg-indigo-50 text-indigo-600' : 'bg-amber-50 text-amber-600'}
            className="overflow-visible"
        >
            <div className="space-y-4">
                {/* Search / Add Trigger */}
                <div
                    ref={containerRef}
                    className="relative"
                    onFocus={() => setIsSearchOpen(true)}
                    onBlur={(e) => {
                        if (!e.currentTarget.contains(e.relatedTarget)) {
                            setIsSearchOpen(false);
                        }
                    }}
                >
                    <div className="relative">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                        <Input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setIsSearchOpen(true);
                            }}
                            onFocus={() => setIsSearchOpen(true)}
                            onClick={() => setIsSearchOpen(true)}
                            placeholder={
                                isBundle
                                    ? 'Search catalog to add a bundle component product...'
                                    : 'Search catalog to add a free or bundled item...'
                            }
                            className="pl-10 pr-4 h-11 text-sm bg-white border-slate-200 focus:border-amber-500 focus:ring-amber-500/20"
                        />
                    </div>

                    {isSearchOpen && (
                        <VirtualInfiniteList
                            items={filteredSearchItems}
                            loading={searchLoading}
                            isFetchingMore={isFetchingMore}
                            hasNextPage={hasNextPage}
                            onLoadMore={loadMore}
                            estimateSize={58}
                            maxHeight="18rem"
                            className="z-50 shadow-xl border-slate-200 rounded-xl"
                            emptyMessage={
                                searchTerm
                                    ? `No products found matching "${searchTerm}"`
                                    : 'No more available products to attach'
                            }
                            aria-label="Bundled product search results"
                            renderItem={(p) => {
                                const inStock = p.inventory?.quantityOnHand ?? 0;
                                return (
                                    <li
                                        key={p.id}
                                        role="option"
                                        aria-selected={false}
                                        onMouseDown={(e) => {
                                            e.preventDefault();
                                            handleSelectProduct(p);
                                        }}
                                        className="flex items-center justify-between p-2.5 px-3.5 hover:bg-slate-50 cursor-pointer transition-colors border-b border-slate-100 last:border-b-0"
                                    >
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="w-9 h-9 rounded-lg bg-slate-100 border border-slate-200/80 flex items-center justify-center shrink-0 text-slate-500 overflow-hidden shadow-2xs">
                                                {p.imageUrl ? (
                                                    <img
                                                        src={getOptimizedImageUrl(p.imageUrl, { width: 72, height: 72, crop: 'fill' })}
                                                        alt={p.name}
                                                        className="w-full h-full object-cover"
                                                        loading="lazy"
                                                    />
                                                ) : (
                                                    <Package className="w-4 h-4" />
                                                )}
                                            </div>
                                            <div className="flex flex-col min-w-0">
                                                <span className="text-sm font-semibold text-slate-900 truncate">
                                                    {p.name}
                                                </span>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <span className="inline-flex items-center gap-1 font-mono text-[11px] text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200/60">
                                                        <Barcode className="w-3 h-3 text-slate-400" />
                                                        {p.sku}
                                                    </span>
                                                    <span className="text-xs text-slate-400">
                                                        Stock: <span className="font-semibold text-slate-700">{inStock}</span>
                                                    </span>
                                                    {p.unitPrice !== undefined && (
                                                        <span className="font-mono text-xs font-semibold text-slate-600">
                                                            ₱{Number(p.unitPrice).toFixed(2)}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0">
                                            <Badge
                                                variant="outline"
                                                className={
                                                    isBundle
                                                        ? 'bg-indigo-50 text-indigo-700 border-indigo-200 text-[11px] font-semibold'
                                                        : 'bg-amber-50 text-amber-700 border-amber-200 text-[11px] font-semibold'
                                                }
                                            >
                                                {isBundle ? '+ Include' : '+ Add Free'}
                                            </Badge>
                                        </div>
                                    </li>
                                );
                            }}
                        />
                    )}
                </div>

                {isBundle && fields.length > 0 && (
                    <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-indigo-50/70 border border-indigo-200/80">
                        <span className="text-xs font-semibold text-indigo-900">
                            Combined Components Value (Regular Price):
                        </span>
                        <span className="font-mono text-sm font-bold text-indigo-800">
                            ₱{totalComponentSum.toFixed(2)}
                        </span>
                    </div>
                )}

                {/* Selected Bundled Items List */}
                {fields.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-6 text-center">
                        <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 mx-auto flex items-center justify-center mb-2">
                            <Gift className="w-5 h-5" />
                        </div>
                        <p className="text-sm font-semibold text-slate-800">No free or bundled items attached</p>
                        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                            Search above to bundle complimentary products that will be included at zero cost and deducted on sale.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-2.5">
                        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-0.5">
                            Attached Bundled Items ({fields.length})
                        </div>
                        <div className="space-y-2">
                            {fields.map((field, index) => {
                                const prod = productDetailsMap.get(field.productId);
                                const quantity = watchedBundleItems?.[index]?.quantity ?? field.quantity ?? 1;
                                const inStock = prod?.inventory?.quantityOnHand ?? 0;

                                return (
                                    <div
                                        key={field.id}
                                        className="flex items-center justify-between gap-3 p-3 rounded-xl border border-slate-200 bg-white shadow-xs hover:border-slate-300 transition-colors"
                                    >
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div
                                                className={
                                                    isBundle
                                                        ? "w-11 h-11 rounded-lg bg-purple-50 border border-purple-200/80 flex items-center justify-center shrink-0 text-purple-700 overflow-hidden shadow-2xs"
                                                        : "w-11 h-11 rounded-lg bg-gradient-to-br from-amber-50 to-amber-100/60 border border-amber-200/80 flex items-center justify-center shrink-0 text-amber-600 overflow-hidden shadow-2xs"
                                                }
                                            >
                                                {prod?.imageUrl ? (
                                                    <img
                                                        src={getOptimizedImageUrl(prod.imageUrl, { width: 88, height: 88, crop: 'fill' })}
                                                        alt={prod.name}
                                                        className="w-full h-full object-cover"
                                                        loading="lazy"
                                                    />
                                                ) : isBundle ? (
                                                    <Package className="w-5 h-5" strokeWidth={2} />
                                                ) : (
                                                    <Gift className="w-5 h-5" strokeWidth={2} />
                                                )}
                                            </div>
                                            <div className="flex flex-col min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-bold text-slate-900 truncate">
                                                        {prod?.name || 'Attached Product'}
                                                    </span>
                                                    {isBundle ? (
                                                        <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-purple-50 text-purple-700 border-purple-200 font-bold">
                                                            COMPONENT
                                                        </Badge>
                                                    ) : (
                                                        <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-emerald-50 text-emerald-700 border-emerald-200 font-bold">
                                                            FREE
                                                        </Badge>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-2.5 mt-0.5 text-xs text-slate-500">
                                                    {prod?.sku && (
                                                        <span className="inline-flex items-center gap-1 font-mono text-[11px] text-slate-600 bg-slate-100 px-1.5 py-0.2 rounded">
                                                            <Barcode className="w-3 h-3 text-slate-400" />
                                                            {prod.sku}
                                                        </span>
                                                    )}
                                                    <span className="text-slate-400">
                                                        Available: <span className="font-semibold text-slate-700">{inStock}</span>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 shrink-0">
                                            <div className="flex items-center gap-1.5">
                                                <span className="text-xs text-slate-500 font-medium hidden sm:inline">
                                                    Qty / Sale:
                                                </span>
                                                <div className="w-20">
                                                    <Input
                                                        type="number"
                                                        min={1}
                                                        value={typeof quantity === 'number' ? quantity : 1}
                                                        onChange={(e) => handleQuantityChange(index, parseInt(e.target.value, 10))}
                                                        className="h-8 text-center font-bold text-sm"
                                                    />
                                                </div>
                                            </div>

                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => remove(index)}
                                                className="h-8 w-8 text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                                                title="Remove bundled item"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </FormSection>
    );
}

BundledItemsSection.Skeleton = function BundledItemsSectionSkeleton() {
    return (
        <FormSection
            title="Included Free Items"
            description="Attach complimentary products bundled and deducted automatically from inventory upon sale."
            icon={<Gift className="w-4.5 h-4.5" strokeWidth={2} />}
            iconWrapperClassName="bg-amber-50 text-amber-600"
        >
            <div className="space-y-4 animate-pulse">
                <div className="h-11 w-full bg-slate-200 rounded-lg" />
                <div className="h-20 w-full bg-slate-100 rounded-xl border border-dashed border-slate-200" />
            </div>
        </FormSection>
    );
};
