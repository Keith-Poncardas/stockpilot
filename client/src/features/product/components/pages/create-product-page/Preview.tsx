import Barcode from 'react-barcode';
import { PhilippinePeso, Lightbulb, Hash, EyeOff, TrendingUp } from 'lucide-react';
import type { Control } from 'react-hook-form';
import { useProductPreview } from '@/features/product/hooks/useProductPreview';

interface PreviewProps {
    control: Control<any>;
}

export function Preview({ control }: PreviewProps) {
    const {
        displayName,
        displaySku,
        displayStatus,
        statusColorClass,
        displayPrice,
        displayQty,
        displayReorder,
        barcodeValue,
    } = useProductPreview(control);

    return (
        <aside className="lg:col-span-1 lg:sticky lg:top-24 flex flex-col gap-5">
            {/* Signature element: live product tag */}
            <div className="bg-white rounded-2xl border border-[#E3E1DC] p-5 sm:p-6">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-4">
                    Tag preview
                </p>
                <div className="relative rounded-xl bg-slate-900 text-white px-5 py-6 overflow-hidden">
                    <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-white/5" />
                    <div className="absolute right-3 top-3 w-3 h-3 rounded-full border-2 border-white/30" />
                    <p
                        id="previewName"
                        className="font-sans font-semibold text-lg leading-snug pr-8 wrap-break-word"
                    >
                        {displayName}
                    </p>
                    <p
                        id="previewSku"
                        className="font-mono text-xs text-white/50 mt-1 tracking-wide"
                    >
                        {displaySku}
                    </p>
                    <div className="flex items-end justify-between mt-6">
                        <div>
                            <p className="text-[10px] uppercase tracking-widest text-white/40 mb-0.5">
                                Price
                            </p>
                            <p id="previewPrice" className="font-mono text-2xl font-semibold flex items-center gap-0.5">
                                <PhilippinePeso size={20} strokeWidth={2.5} />
                                {displayPrice}
                            </p>
                        </div>
                        <span
                            id="previewStatus"
                            className={`text-[10px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full transition-colors duration-300 ${statusColorClass}`}
                        >
                            {displayStatus}
                        </span>
                    </div>
                    <div className="mt-5 pt-4 border-t border-white/10">
                        <div className="overflow-hidden flex justify-center">
                            <Barcode
                                value={barcodeValue}
                                width={1.2}
                                height={40}
                                displayValue={false}
                                background="transparent"
                                lineColor="rgba(255,255,255,0.7)"
                                margin={0}
                            />
                        </div>
                    </div>
                </div>
                <dl className="mt-4 grid grid-cols-2 gap-3">
                    <div className="rounded-lg bg-slate-50 px-3 py-2.5">
                        <dt className="text-[11px] font-medium text-slate-400 uppercase tracking-wide">
                            On hand
                        </dt>
                        <dd id="previewQty" className="font-mono text-sm font-semibold mt-0.5">
                            {displayQty}
                        </dd>
                    </div>
                    <div className="rounded-lg bg-slate-50 px-3 py-2.5">
                        <dt className="text-[11px] font-medium text-slate-400 uppercase tracking-wide">
                            Reorder at
                        </dt>
                        <dd
                            id="previewReorder"
                            className="font-mono text-sm font-semibold mt-0.5"
                        >
                            {displayReorder}
                        </dd>
                    </div>
                </dl>
            </div>
            {/* Tips */}
            <div className="bg-white rounded-2xl border border-[#E3E1DC] p-5 sm:p-6">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
                        <Lightbulb size={14} className="text-amber-500" strokeWidth={2.5} />
                    </div>
                    <p className="text-sm font-semibold text-slate-800">Before you save</p>
                </div>
                <ul className="flex flex-col gap-3">
                    <li className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                            <Hash size={12} className="text-slate-500" strokeWidth={2.5} />
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed">
                            SKUs <span className="font-medium text-slate-700">can't be changed</span> once a sale references them
                        </p>
                    </li>
                    <li className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                            <EyeOff size={12} className="text-slate-500" strokeWidth={2.5} />
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed">
                            <span className="font-medium text-slate-700">Draft products</span> stay hidden from checkout
                        </p>
                    </li>
                    <li className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                            <TrendingUp size={12} className="text-slate-500" strokeWidth={2.5} />
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed">
                            Set <span className="font-medium text-slate-700">cost price</span> to track margin on every sale
                        </p>
                    </li>
                </ul>
            </div>
        </aside>
    );
}

Preview.Skeleton = function PreviewSkeleton() {
    return (
        <aside className="lg:col-span-1 lg:sticky lg:top-24 flex flex-col gap-5">
            {/* Signature element: live product tag */}
            <div className="bg-white rounded-2xl border border-[#E3E1DC] p-5 sm:p-6">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-4">
                    Tag preview
                </p>
                <div className="relative rounded-xl bg-slate-900 px-5 py-6 overflow-hidden min-h-55">
                    <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-white/5" />
                    <div className="absolute right-3 top-3 w-3 h-3 rounded-full border-2 border-white/30" />

                    <div className="h-6 w-3/4 bg-slate-700/50 animate-pulse rounded mb-2" />
                    <div className="h-4 w-1/2 bg-slate-700/50 animate-pulse rounded mb-6" />

                    <div className="flex items-end justify-between mt-6">
                        <div className="space-y-2">
                            <div className="h-3 w-10 bg-slate-700/50 animate-pulse rounded" />
                            <div className="h-6 w-20 bg-slate-700/50 animate-pulse rounded" />
                        </div>
                        <div className="h-6 w-16 bg-slate-700/50 animate-pulse rounded-full" />
                    </div>
                    <div className="mt-5 pt-4 border-t border-white/10 flex justify-center">
                        <div className="h-10 w-32 bg-slate-700/50 animate-pulse rounded" />
                    </div>
                </div>
                <dl className="mt-4 grid grid-cols-2 gap-3">
                    <div className="rounded-lg bg-slate-50 px-3 py-2.5 space-y-2">
                        <div className="h-3 w-16 bg-gray-200 animate-pulse rounded" />
                        <div className="h-5 w-10 bg-gray-200 animate-pulse rounded" />
                    </div>
                    <div className="rounded-lg bg-slate-50 px-3 py-2.5 space-y-2">
                        <div className="h-3 w-20 bg-gray-200 animate-pulse rounded" />
                        <div className="h-5 w-10 bg-gray-200 animate-pulse rounded" />
                    </div>
                </dl>
            </div>

            {/* Tips skeleton */}
            <div className="bg-white rounded-2xl border border-[#E3E1DC] p-5 sm:p-6">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-7 h-7 rounded-lg bg-gray-200 animate-pulse shrink-0" />
                    <div className="h-5 w-24 bg-gray-200 animate-pulse rounded" />
                </div>
                <ul className="flex flex-col gap-3">
                    {[1, 2, 3].map((i) => (
                        <li key={i} className="flex items-start gap-3">
                            <div className="w-6 h-6 rounded-md bg-gray-200 animate-pulse shrink-0 mt-0.5" />
                            <div className="space-y-1.5 flex-1 pt-1">
                                <div className="h-3.5 w-full bg-gray-200 animate-pulse rounded" />
                                <div className="h-3.5 w-4/5 bg-gray-200 animate-pulse rounded" />
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </aside>
    );
};