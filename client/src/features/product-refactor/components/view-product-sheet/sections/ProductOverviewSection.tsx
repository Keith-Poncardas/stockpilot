import { Image } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import type { IProduct } from '../../../types';

interface ProductOverviewSectionProps {
    product: Pick<IProduct, 'description' | 'unitPrice' | 'costPrice' | 'margin'>;
}

export function ProductOverviewSection({ product }: ProductOverviewSectionProps) {
    return (
        <section className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row gap-6">
                <div className="w-full sm:w-36 sm:h-36 h-44 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                    <Image className="w-10 h-10 text-slate-400" strokeWidth={1.5} />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                    <div>
                        <h3 className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-2">
                            Product Description
                        </h3>
                        <p className="text-sm text-slate-600 leading-relaxed">
                            {product.description || 'No description provided for this product.'}
                        </p>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mt-5 pt-4 border-t border-slate-100">
                        <div>
                            <p className="text-xs uppercase tracking-wide text-slate-400 font-semibold">
                                Unit Price
                            </p>
                            <p className="text-xl font-bold text-slate-900 mt-1">
                                {formatCurrency(product.unitPrice)}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs uppercase tracking-wide text-slate-400 font-semibold">
                                Cost Price
                            </p>
                            <p className="text-xl font-semibold text-slate-600 mt-1">
                                {product.costPrice != null ? formatCurrency(product.costPrice) : '—'}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs uppercase tracking-wide text-slate-400 font-semibold">
                                Margin
                            </p>
                            <p className="text-xl font-semibold text-emerald-600 mt-1">
                                {product.margin != null ? `${product.margin.toFixed(1)}%` : '—'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
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
