import type { Row } from '@tanstack/react-table';
import { Gift, Package, Layers, Tag } from 'lucide-react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { formatCurrency } from '@/lib/utils';
import { getOptimizedImageUrl } from '@/lib/cloudinary';

export interface BundledItemsCellProps {
    row?: Row<any>;
    product?: any;
    quantityMultiplier?: number;
    className?: string;
}

export function BundledItemsCell({
    row,
    product: propProduct,
    quantityMultiplier: propMultiplier,
    className,
}: BundledItemsCellProps) {
    const raw = propProduct || row?.original?.product || row?.original;
    if (!raw) {
        return (
            <div className="flex items-center text-slate-300 text-xs font-mono select-none">
                <span>—</span>
            </div>
        );
    }

    const product = raw;
    const isBundle = product.productType === 'BUNDLE';
    const bundleItems: any[] = product.bundleItems || [];
    const pricingTiers: any[] = product.pricingTiers || [];

    const quantityMultiplier =
        propMultiplier ??
        (row?.original?.quantity && typeof row.original.quantity === 'number'
            ? row.original.quantity
            : 1);

    const hasBundles = bundleItems.length > 0;
    const hasTiers = pricingTiers.length > 0;

    if (!hasBundles && !hasTiers) {
        return (
            <div className="flex items-center text-slate-300 text-xs font-mono select-none">
                <span>—</span>
            </div>
        );
    }

    return (
        <TooltipProvider delayDuration={200}>
            <div className={`flex flex-col items-start gap-1 py-1 ${className ?? ''}`}>
                {/* Bundle Component Items */}
                {isBundle && hasBundles && (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-purple-900 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-md cursor-pointer hover:bg-purple-100/80 transition-colors shadow-2xs">
                                <Layers className="w-3 h-3 text-purple-600 shrink-0" />
                                <span className="font-bold text-purple-700">{bundleItems.length} Components</span>
                            </span>
                        </TooltipTrigger>
                        <TooltipContent
                            side="top"
                            align="start"
                            className="flex flex-col items-start gap-1.5 w-max min-w-[240px] max-w-sm p-3 bg-slate-900 text-white rounded-xl shadow-xl border border-slate-800 text-xs text-left z-50"
                        >
                            <div className="text-[10px] font-semibold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                                <Layers className="w-3 h-3 shrink-0" />
                                Included Bundle Components ({bundleItems.length})
                            </div>
                            <ul className="space-y-1.5 w-full">
                                {bundleItems.map((b) => (
                                    <li
                                        key={b.id}
                                        className="flex items-center justify-between gap-3 text-slate-200 text-[11px] w-full"
                                    >
                                        <div className="flex items-center gap-2 min-w-0 flex-1">
                                            <div className="w-5 h-5 rounded bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 overflow-hidden">
                                                {b.product?.imageUrl ? (
                                                    <img
                                                        src={getOptimizedImageUrl(b.product.imageUrl, { width: 40, height: 40, crop: 'fill' })}
                                                        alt={b.product.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <Package className="w-3 h-3 text-slate-400 shrink-0" />
                                                )}
                                            </div>
                                            <span className="break-words whitespace-normal leading-snug">
                                                {b.product?.name || 'Component'}
                                            </span>
                                        </div>
                                        <span className="font-mono text-purple-300 font-bold shrink-0">
                                            {b.quantity * (quantityMultiplier > 1 ? quantityMultiplier : 1)}x
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </TooltipContent>
                    </Tooltip>
                )}

                {/* Free Bundled Items on Simple Product */}
                {!isBundle && hasBundles && (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-900 bg-amber-50/90 border border-amber-200/90 px-2 py-0.5 rounded-md cursor-pointer hover:bg-amber-100 transition-colors shadow-2xs truncate max-w-[155px]">
                                <Gift className="w-3 h-3 text-amber-600 shrink-0" />
                                <span className="font-bold text-amber-700">{bundleItems[0].quantity * (quantityMultiplier > 1 ? quantityMultiplier : 1)}x</span>
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
                            className="flex flex-col items-start gap-1.5 w-max min-w-[240px] max-w-sm p-3 bg-slate-900 text-white rounded-xl shadow-xl border border-slate-800 text-xs text-left z-50"
                        >
                            <div className="text-[10px] font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                                <Gift className="w-3 h-3 shrink-0" />
                                All Included Free Items ({bundleItems.length})
                            </div>
                            <ul className="space-y-1.5 w-full">
                                {bundleItems.map((b) => (
                                    <li
                                        key={b.id}
                                        className="flex items-center justify-between gap-3 text-slate-200 text-[11px] w-full"
                                    >
                                        <div className="flex items-center gap-2 min-w-0 flex-1">
                                            <div className="w-5 h-5 rounded bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 overflow-hidden">
                                                {b.product?.imageUrl ? (
                                                    <img
                                                        src={getOptimizedImageUrl(b.product.imageUrl, { width: 40, height: 40, crop: 'fill' })}
                                                        alt={b.product.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <Gift className="w-3 h-3 text-amber-400 shrink-0" />
                                                )}
                                            </div>
                                            <span className="break-words whitespace-normal leading-snug">
                                                {b.product?.name || 'Free Item'}
                                            </span>
                                        </div>
                                        <span className="font-mono text-amber-300 font-bold shrink-0">
                                            {b.quantity * (quantityMultiplier > 1 ? quantityMultiplier : 1)}x
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </TooltipContent>
                    </Tooltip>
                )}

                {/* Volume Tier Deals */}
                {hasTiers && (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-900 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md cursor-pointer hover:bg-blue-100 transition-colors shadow-2xs">
                                <Tag className="w-3 h-3 text-blue-600 shrink-0" />
                                <span className="font-bold text-blue-700">{pricingTiers.length} Volume Tiers</span>
                            </span>
                        </TooltipTrigger>
                        <TooltipContent
                            side="top"
                            align="start"
                            className="flex flex-col items-start gap-1.5 w-max min-w-[240px] max-w-sm p-3 bg-slate-900 text-white rounded-xl shadow-xl border border-slate-800 text-xs text-left z-50"
                        >
                            <div className="text-[10px] font-semibold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                                <Tag className="w-3 h-3 shrink-0" />
                                Configured Volume Deals ({pricingTiers.length})
                            </div>
                            <ul className="space-y-1.5 w-full">
                                {pricingTiers.map((t, idx) => (
                                    <li
                                        key={t.id || idx}
                                        className="flex flex-col gap-1 border-b border-slate-800 pb-1.5 last:border-0 last:pb-0 text-slate-200 text-[11px] w-full"
                                    >
                                        <div className="flex items-center justify-between gap-4 font-mono w-full">
                                            <span className="font-semibold text-white">
                                                {t.minQuantity}
                                                {t.maxQuantity ? ` - ${t.maxQuantity}` : '+'} units
                                            </span>
                                            <span className="text-emerald-400 font-bold">
                                                {formatCurrency(t.tierPrice)}
                                            </span>
                                        </div>
                                        {t.freeQuantity && t.freeQuantity > 0 && t.freeProduct && (
                                            <div className="flex items-center gap-1.5 text-amber-300 text-[10px]">
                                                <Gift className="w-2.5 h-2.5 shrink-0" />
                                                <span className="break-words whitespace-normal">
                                                    +{t.freeQuantity}x Free {t.freeProduct.name}
                                                </span>
                                            </div>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </TooltipContent>
                    </Tooltip>
                )}
            </div>
        </TooltipProvider>
    );
}
