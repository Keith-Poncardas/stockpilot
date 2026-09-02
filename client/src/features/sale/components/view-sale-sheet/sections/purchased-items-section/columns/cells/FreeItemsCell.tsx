import type { Row } from '@tanstack/react-table';
import { Gift, Package, Layers } from 'lucide-react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import type { SaleItem, ISalePricingTier, ISaleBundleItem } from '@/features/sale/types';

interface FreeItemsCellProps {
    row: Row<SaleItem>;
}

export function FreeItemsCell({ row }: FreeItemsCellProps) {
    const saleItem = row.original;
    const product = saleItem.product;
    const isBundle = product?.productType === 'BUNDLE';
    const bundleItems: ISaleBundleItem[] = product?.bundleItems || [];
    const pricingTiers: ISalePricingTier[] = product?.pricingTiers || [];
    const purchasedQty = saleItem.quantity || 1;

    // Check if a volume pricing tier matched this purchase quantity
    const matchedTier = pricingTiers.find((t: ISalePricingTier) => {
        if (purchasedQty < t.minQuantity) return false;
        if (t.maxQuantity && purchasedQty > t.maxQuantity) return false;
        return true;
    });

    const hasTierGift = Boolean(matchedTier?.freeProduct && matchedTier.freeQuantity && matchedTier.freeQuantity > 0);
    const hasBundles = bundleItems.length > 0;

    if (!hasBundles && !hasTierGift) {
        return (
            <div className="flex items-center text-slate-300 dark:text-slate-600 text-xs font-mono select-none">
                <span>—</span>
            </div>
        );
    }

    return (
        <TooltipProvider delayDuration={200}>
            <div className="flex items-center gap-1.5 py-1 flex-wrap">
                {/* Bundle Component Items Breakdown */}
                {isBundle && hasBundles && (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-purple-900 dark:text-purple-200 bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60 px-2 py-0.5 rounded-md cursor-pointer hover:bg-purple-100/80 transition-colors shadow-2xs">
                                <Layers className="w-3 h-3 text-purple-600 dark:text-purple-400 shrink-0" />
                                <span className="font-bold text-purple-700 dark:text-purple-300">
                                    {bundleItems.length} Components
                                </span>
                            </span>
                        </TooltipTrigger>
                        <TooltipContent
                            side="top"
                            align="start"
                            className="p-2.5 bg-slate-900 text-white rounded-lg shadow-xl border border-slate-800 text-xs space-y-1.5 max-w-xs"
                        >
                            <div className="text-[10px] font-semibold text-purple-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                                <Layers className="w-3 h-3" />
                                Bundle Components ({bundleItems.length})
                            </div>
                            <ul className="space-y-1.5">
                                {bundleItems.map((b: ISaleBundleItem) => {
                                    const totalQty = purchasedQty * (b.quantity || 1);
                                    return (
                                        <li
                                            key={b.id}
                                            className="flex items-center justify-between gap-3 text-slate-200 text-[11px]"
                                        >
                                            <div className="flex items-center gap-1.5 truncate">
                                                <Package className="w-3 h-3 text-slate-400 shrink-0" />
                                                <span className="truncate">
                                                    {b.product?.name || 'Component'}
                                                </span>
                                            </div>
                                            <span className="font-mono text-purple-300 font-bold shrink-0">
                                                {totalQty}x
                                            </span>
                                        </li>
                                    );
                                })}
                            </ul>
                        </TooltipContent>
                    </Tooltip>
                )}

                {/* Free Bundled Items on Simple Product */}
                {!isBundle && hasBundles && (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <span
                                className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-900 dark:text-amber-200 bg-amber-50/90 dark:bg-amber-950/40 border border-amber-200/90 dark:border-amber-800/60 px-2 py-0.5 rounded-md truncate max-w-[155px] shadow-2xs cursor-pointer hover:bg-amber-100 transition-colors"
                                title={`${purchasedQty * (bundleItems[0].quantity || 1)}x ${bundleItems[0].product?.name || 'Free Item'}`}
                            >
                                <Gift className="w-3 h-3 text-amber-600 dark:text-amber-400 shrink-0" strokeWidth={2} />
                                <span className="font-bold text-amber-700 dark:text-amber-300">
                                    {purchasedQty * (bundleItems[0].quantity || 1)}x
                                </span>
                                <span className="truncate">{bundleItems[0].product?.name || 'Free Item'}</span>
                                {bundleItems.length > 1 && (
                                    <span className="text-[10px] font-bold text-amber-800 bg-amber-200/80 px-1 rounded">
                                        +{bundleItems.length - 1}
                                    </span>
                                )}
                            </span>
                        </TooltipTrigger>
                        <TooltipContent
                            side="top"
                            align="start"
                            className="p-2.5 bg-slate-900 text-white rounded-lg shadow-xl border border-slate-800 text-xs space-y-1.5 max-w-xs"
                        >
                            <div className="text-[10px] font-semibold text-amber-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                                <Gift className="w-3 h-3" />
                                Included Free Items ({bundleItems.length})
                            </div>
                            <ul className="space-y-1.5">
                                {bundleItems.map((b: ISaleBundleItem) => {
                                    const totalFree = purchasedQty * (b.quantity || 1);
                                    return (
                                        <li
                                            key={b.id}
                                            className="flex items-center justify-between gap-3 text-slate-200 text-[11px]"
                                        >
                                            <div className="flex items-center gap-1.5 truncate">
                                                <Package className="w-3 h-3 text-slate-400 shrink-0" />
                                                <span className="truncate">
                                                    {b.product?.name || 'Free Product'}
                                                </span>
                                            </div>
                                            <span className="font-mono text-amber-300 font-bold shrink-0">
                                                {totalFree}x Free
                                            </span>
                                        </li>
                                    );
                                })}
                            </ul>
                        </TooltipContent>
                    </Tooltip>
                )}

                {/* Tier Complimentary Free Gift */}
                {hasTierGift && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-900 dark:text-amber-200 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 px-2 py-0.5 rounded-md shadow-2xs">
                        <Gift className="w-3 h-3 text-amber-600 dark:text-amber-400 shrink-0" />
                        <span className="font-bold text-amber-700 dark:text-amber-300">
                            +{matchedTier!.freeQuantity}x Free
                        </span>
                        <span className="truncate max-w-[120px]">
                            {matchedTier!.freeProduct?.name}
                        </span>
                    </span>
                )}
            </div>
        </TooltipProvider>
    );
}
