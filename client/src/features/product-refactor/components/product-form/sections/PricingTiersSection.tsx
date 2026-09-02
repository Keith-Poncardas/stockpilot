import { useState, useRef, useEffect, useMemo } from 'react';
import { Layers, Plus, Trash2, Gift, Search, Barcode } from 'lucide-react';
import { useFieldArray, useWatch, type Control } from 'react-hook-form';
import { FormSection } from '@/components/ui/form-section';
import { VirtualInfiniteList } from '@/components/ui/virtual-infinite-list';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { cn, formatCurrency } from '@/lib/utils';
import { useInfiniteProductSearch } from '../../../hooks';
import type { ProductFormValues } from '../../../validation';
import type { IProduct, IProductPricingTier } from '../../../types';

interface PricingTiersSectionProps {
    control: Control<ProductFormValues>;
    currentProductId?: string;
    initialPricingTiers?: IProductPricingTier[] | null;
}

export function PricingTiersSection({
    control,
    currentProductId,
    initialPricingTiers,
}: PricingTiersSectionProps) {
    const { fields, append, remove, update } = useFieldArray({
        control,
        name: 'pricingTiers',
    });

    const tiers = (useWatch({ control, name: 'pricingTiers' }) || []) as Array<{
        minQuantity: number;
        maxQuantity?: number | null;
        tierPrice: number;
        freeProductId?: string | null;
        freeQuantity?: number;
    }>;

    // State for active dropdown row when choosing free gift product
    const [activeGiftIndex, setActiveGiftIndex] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [freeProductDetailsMap, setFreeProductDetailsMap] = useState<Record<string, { name: string; sku: string; unitPrice?: number; stock?: number }>>({});
    const dropdownRef = useRef<HTMLDivElement>(null);

    const {
        items: products,
        loading,
        isFetchingMore,
        hasNextPage,
        loadMore,
    } = useInfiniteProductSearch(searchTerm);

    // Populate initial product details for pre-existing tiers
    useEffect(() => {
        if (!initialPricingTiers || initialPricingTiers.length === 0) return;
        setFreeProductDetailsMap((prev) => {
            let changed = false;
            const updated = { ...prev };
            initialPricingTiers.forEach((tier) => {
                if (tier.freeProductId && tier.freeProduct && !updated[tier.freeProductId]) {
                    updated[tier.freeProductId] = {
                        name: tier.freeProduct.name,
                        sku: tier.freeProduct.sku,
                        unitPrice: tier.freeProduct.unitPrice,
                        stock: (tier.freeProduct as any).inventory?.quantityOnHand,
                    };
                    changed = true;
                }
            });
            return changed ? updated : prev;
        });
    }, [initialPricingTiers]);

    // Close gift product dropdown on outside click
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setActiveGiftIndex(null);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredProducts = useMemo(() => {
        return products.filter((p) => p.id !== currentProductId);
    }, [products, currentProductId]);

    const handleAddTier = () => {
        const lastTier = tiers[tiers.length - 1];
        const lastMin = typeof lastTier?.minQuantity === 'number' ? lastTier.minQuantity : 1;
        const lastMax = typeof lastTier?.maxQuantity === 'number' ? lastTier.maxQuantity : null;
        const nextMin = lastMax !== null ? lastMax + 1 : lastMin + 1;

        append({
            minQuantity: nextMin,
            maxQuantity: null,
            tierPrice: '' as unknown as number,
            freeProductId: null,
            freeQuantity: 0,
        });
    };

    const handleSelectFreeProduct = (index: number, product: IProduct) => {
        const currentTier = tiers[index] || fields[index];
        setFreeProductDetailsMap((prev) => ({
            ...prev,
            [product.id]: {
                name: product.name,
                sku: product.sku,
                unitPrice: product.unitPrice,
                stock: product.inventory?.quantityOnHand,
            },
        }));
        const currentFreeQty = typeof currentTier?.freeQuantity === 'number' ? currentTier.freeQuantity : 0;
        update(index, {
            minQuantity: typeof currentTier?.minQuantity === 'number' ? currentTier.minQuantity : 1,
            maxQuantity: typeof currentTier?.maxQuantity === 'number' ? currentTier.maxQuantity : null,
            tierPrice: typeof currentTier?.tierPrice === 'number' ? currentTier.tierPrice : ('' as unknown as number),
            freeProductId: product.id,
            freeQuantity: currentFreeQty > 0 ? currentFreeQty : 1,
        });
        setActiveGiftIndex(null);
        setSearchTerm('');
    };

    const handleClearFreeProduct = (index: number) => {
        const currentTier = tiers[index] || fields[index];
        update(index, {
            minQuantity: typeof currentTier?.minQuantity === 'number' ? currentTier.minQuantity : 1,
            maxQuantity: typeof currentTier?.maxQuantity === 'number' ? currentTier.maxQuantity : null,
            tierPrice: typeof currentTier?.tierPrice === 'number' ? currentTier.tierPrice : ('' as unknown as number),
            freeProductId: null,
            freeQuantity: 0,
        });
    };

    return (
        <FormSection
            title="Volume Pricing & Free Gift Tiers"
            description="Set volume packages (e.g. 1 for ₱599 + 1 Free Coffee, 2 for ₱999 + 2 Free Coffee, 10 for ₱3,600 + 5 Free Coffee)."
            icon={<Layers className="w-4.5 h-4.5" strokeWidth={2} />}
            iconWrapperClassName="bg-purple-50 text-purple-700"
            className="overflow-visible"
            actions={
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddTier}
                    className="h-8 gap-1.5 border-purple-200 text-purple-700 hover:bg-purple-50 font-medium cursor-pointer"
                >
                    <Plus className="w-3.5 h-3.5" />
                    Add Volume Tier
                </Button>
            }
        >
            <div className="space-y-4 overflow-visible">
                {fields.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 py-8 px-4 text-center bg-slate-50/50">
                        <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center mb-2">
                            <Layers className="w-5 h-5" />
                        </div>
                        <p className="text-sm font-semibold text-slate-800">No volume pricing tiers configured</p>
                        <p className="text-xs text-slate-500 max-w-sm mt-1 mb-3">
                            Add tiered quantity pricing and complimentary free gifts to incentivize bulk purchases.
                        </p>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleAddTier}
                            className="h-8 gap-1.5 border-purple-200 text-purple-700 hover:bg-purple-50 cursor-pointer"
                        >
                            <Plus className="w-3.5 h-3.5" />
                            Add First Tier
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-3 overflow-visible">
                        {fields.map((field, index) => {
                            const tier = tiers[index] || field;
                            const freeProductId = typeof tier.freeProductId === 'string' ? tier.freeProductId : null;
                            const freeProduct = freeProductId ? freeProductDetailsMap[freeProductId] : null;
                            const isDropdownOpen = activeGiftIndex === index;
                            const minVal = typeof tier.minQuantity === 'number' ? tier.minQuantity : 1;
                            const maxVal = typeof tier.maxQuantity === 'number' ? tier.maxQuantity : null;
                            const tierPriceVal = typeof tier.tierPrice === 'number' ? tier.tierPrice : '';
                            const freeQtyVal = typeof tier.freeQuantity === 'number' ? tier.freeQuantity : 0;

                            return (
                                <div
                                    key={field.id}
                                    className={cn(
                                        "p-3.5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all shadow-xs space-y-3 relative overflow-visible",
                                        isDropdownOpen ? "z-30 ring-1 ring-purple-400 shadow-md" : "z-0"
                                    )}
                                >
                                    <div className="flex items-center justify-between gap-3">
                                        <div className="flex items-center gap-2">
                                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-purple-100 text-purple-800 font-mono text-xs font-bold">
                                                {index + 1}
                                            </span>
                                            <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                                                Tier {index + 1}
                                            </span>
                                        </div>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon-xs"
                                            onClick={() => remove(index)}
                                            className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                                            title="Remove tier"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </Button>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                                        {/* Min Quantity */}
                                        <div className="sm:col-span-3">
                                            <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                                                Min Qty <span className="text-rose-500">*</span>
                                            </label>
                                            <Input
                                                type="number"
                                                min={1}
                                                placeholder="e.g. 1"
                                                value={minVal}
                                                onChange={(e) =>
                                                    update(index, {
                                                        minQuantity: parseInt(e.target.value, 10) || 1,
                                                        maxQuantity: maxVal,
                                                        tierPrice: tierPriceVal as unknown as number,
                                                        freeProductId,
                                                        freeQuantity: freeQtyVal,
                                                    })
                                                }
                                                className="h-8.5 text-center font-mono font-bold text-sm"
                                            />
                                        </div>

                                        {/* Max Quantity */}
                                        <div className="sm:col-span-3">
                                            <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                                                Max Qty <span className="text-slate-400 font-normal">(optional)</span>
                                            </label>
                                            <Input
                                                type="number"
                                                min={minVal}
                                                placeholder="No max"
                                                value={maxVal ?? ''}
                                                onChange={(e) =>
                                                    update(index, {
                                                        minQuantity: minVal,
                                                        maxQuantity: e.target.value ? parseInt(e.target.value, 10) : null,
                                                        tierPrice: tierPriceVal as unknown as number,
                                                        freeProductId,
                                                        freeQuantity: freeQtyVal,
                                                    })
                                                }
                                                className="h-8.5 text-center font-mono text-sm"
                                            />
                                        </div>

                                        {/* Package / Tier Price */}
                                        <div className="sm:col-span-6">
                                            <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                                                Package Price (₱) <span className="text-rose-500">*</span>
                                            </label>
                                            <div className="relative">
                                                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
                                                    ₱
                                                </span>
                                                <Input
                                                    type="number"
                                                    min={0}
                                                    step="0.01"
                                                    placeholder="0.00"
                                                    value={tierPriceVal}
                                                    onChange={(e) =>
                                                        update(index, {
                                                            minQuantity: minVal,
                                                            maxQuantity: maxVal,
                                                            tierPrice: parseFloat(e.target.value) || 0,
                                                            freeProductId,
                                                            freeQuantity: freeQtyVal,
                                                        })
                                                    }
                                                    className="h-8.5 pl-6 font-mono font-bold text-sm text-slate-900"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Complimentary Free Gift Attachment */}
                                    <div className="pt-2 border-t border-slate-100 overflow-visible">
                                        <div className="flex items-center justify-between mb-1.5">
                                            <span className="text-[11px] font-semibold text-slate-600 flex items-center gap-1.5">
                                                <Gift className="w-3.5 h-3.5 text-amber-500" />
                                                Complimentary Free Gift <span className="text-slate-400 font-normal">(Optional)</span>
                                            </span>
                                            {freeProduct && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleClearFreeProduct(index)}
                                                    className="text-[11px] text-rose-500 hover:underline font-medium cursor-pointer"
                                                >
                                                    Remove Gift
                                                </button>
                                            )}
                                        </div>

                                        {freeProduct ? (
                                            <div className="flex items-center justify-between gap-3 p-2 rounded-lg bg-amber-50/60 border border-amber-200/80">
                                                <div className="flex items-center gap-2 min-w-0">
                                                    <span className="w-6 h-6 rounded bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                                                        <Gift className="w-3.5 h-3.5" />
                                                    </span>
                                                    <div className="min-w-0">
                                                        <p className="text-xs font-semibold text-slate-900 truncate">
                                                            {freeProduct.name}
                                                        </p>
                                                        <span className="text-[10px] font-mono text-slate-500">
                                                            {freeProduct.sku}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-1.5 shrink-0">
                                                    <span className="text-xs text-slate-500 font-medium">Qty:</span>
                                                    <Input
                                                        type="number"
                                                        min={1}
                                                        value={freeQtyVal || 1}
                                                        onChange={(e) =>
                                                            update(index, {
                                                                minQuantity: minVal,
                                                                maxQuantity: maxVal,
                                                                tierPrice: tierPriceVal as unknown as number,
                                                                freeProductId,
                                                                freeQuantity: parseInt(e.target.value, 10) || 1,
                                                            })
                                                        }
                                                        className="h-7 w-16 text-center font-bold text-xs"
                                                    />
                                                </div>
                                            </div>
                                        ) : (
                                            <div
                                                className="relative overflow-visible"
                                                ref={isDropdownOpen ? dropdownRef : undefined}
                                                onFocus={() => setActiveGiftIndex(index)}
                                                onBlur={(e) => {
                                                    if (!e.currentTarget.contains(e.relatedTarget)) {
                                                        setActiveGiftIndex(null);
                                                    }
                                                }}
                                            >
                                                <div className="relative">
                                                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                                                    <Input
                                                        placeholder="Search gift product (e.g. Coffee Sachet)..."
                                                        value={isDropdownOpen ? searchTerm : ''}
                                                        onFocus={() => {
                                                            setActiveGiftIndex(index);
                                                        }}
                                                        onClick={() => {
                                                            setActiveGiftIndex(index);
                                                        }}
                                                        onChange={(e) => setSearchTerm(e.target.value)}
                                                        className="h-8.5 pl-8 text-xs bg-slate-50/50"
                                                    />
                                                </div>

                                                {isDropdownOpen && (
                                                    <VirtualInfiniteList
                                                        items={filteredProducts}
                                                        loading={loading}
                                                        isFetchingMore={isFetchingMore}
                                                        hasNextPage={hasNextPage}
                                                        onLoadMore={loadMore}
                                                        estimateSize={58}
                                                        maxHeight="16rem"
                                                        className="z-50 shadow-2xl border border-slate-200 rounded-xl bg-white absolute top-full left-0 right-0 mt-1"
                                                        emptyMessage={
                                                            searchTerm
                                                                ? `No products found matching "${searchTerm}"`
                                                                : 'No products available'
                                                        }
                                                        aria-label="Free gift product search results"
                                                        renderItem={(p) => {
                                                            const inStock = p.inventory?.quantityOnHand ?? 0;
                                                            return (
                                                                <li
                                                                    key={p.id}
                                                                    role="option"
                                                                    aria-selected={false}
                                                                    onMouseDown={(e) => {
                                                                        e.preventDefault();
                                                                        handleSelectFreeProduct(index, p);
                                                                    }}
                                                                    className="flex items-center justify-between p-2.5 px-3 hover:bg-purple-50/80 cursor-pointer transition-colors border-b border-slate-100 last:border-b-0"
                                                                >
                                                                    <div className="flex items-center gap-2.5 min-w-0">
                                                                        <div className="w-7 h-7 rounded-md bg-purple-50 border border-purple-200/80 flex items-center justify-center shrink-0 text-purple-600">
                                                                            <Gift className="w-3.5 h-3.5" />
                                                                        </div>
                                                                        <div className="flex flex-col min-w-0">
                                                                            <span className="text-xs font-semibold text-slate-900 truncate">
                                                                                {p.name}
                                                                            </span>
                                                                            <div className="flex items-center gap-2 mt-0.5">
                                                                                {p.sku && (
                                                                                    <span className="inline-flex items-center gap-1 font-mono text-[10px] text-slate-500 bg-slate-100 px-1 py-0.2 rounded">
                                                                                        <Barcode className="w-2.5 h-2.5 text-slate-400" />
                                                                                        {p.sku}
                                                                                    </span>
                                                                                )}
                                                                                <span className="text-[11px] text-slate-400">
                                                                                    Stock: <span className="font-semibold text-slate-700">{inStock}</span>
                                                                                </span>
                                                                                {p.unitPrice !== undefined && (
                                                                                    <span className="font-mono text-[11px] font-semibold text-slate-600">
                                                                                        {formatCurrency(p.unitPrice)}
                                                                                    </span>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex items-center gap-1.5 shrink-0 ml-2">
                                                                        <Badge
                                                                            variant="outline"
                                                                            className="bg-amber-50 text-amber-800 border-amber-200 text-[10px] font-semibold px-1.5 py-0.5"
                                                                        >
                                                                            + Select Gift
                                                                        </Badge>
                                                                    </div>
                                                                </li>
                                                            );
                                                        }}
                                                    />
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </FormSection>
    );
}

PricingTiersSection.Skeleton = function PricingTiersSectionSkeleton() {
    return (
        <FormSection
            title="Volume Pricing & Free Gift Tiers"
            description="Set volume packages and complimentary free items."
            icon={<Layers className="w-4.5 h-4.5" strokeWidth={2} />}
            iconWrapperClassName="bg-purple-50 text-purple-700"
            className="overflow-visible"
        >
            <div className="space-y-3 animate-pulse">
                <div className="h-16 w-full bg-slate-100 rounded-xl" />
            </div>
        </FormSection>
    );
};
