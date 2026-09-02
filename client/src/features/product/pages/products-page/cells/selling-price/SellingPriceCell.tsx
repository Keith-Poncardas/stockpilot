import type { Row } from '@tanstack/react-table';
import { formatCurrency } from '@/lib/utils';
import type { IProduct } from '../../../../types';

interface SellingPriceCellProps {
    row: Row<IProduct>;
}

export function SellingPriceCell({ row }: SellingPriceCellProps) {
    const product = row.original;
    const hasDiscount = Boolean(
        product.regularPrice != null &&
        Number(product.regularPrice) > 0 &&
        Number(product.regularPrice) > Number(product.unitPrice)
    );

    return (
        <div className="flex flex-col text-left py-1">
            <div className="flex items-center gap-1.5 flex-wrap">
                {hasDiscount && (
                    <span className="text-xs font-medium text-slate-400 line-through font-mono">
                        {formatCurrency(product.regularPrice!)}
                    </span>
                )}
                <span
                    className={`text-sm font-bold ${hasDiscount ? 'text-emerald-700' : 'text-slate-900'}`}
                    style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}
                >
                    {formatCurrency(product.unitPrice)}
                </span>
                {hasDiscount && (
                    <span className="text-[10px] font-bold text-white bg-emerald-600 px-1.5 py-0.5 rounded shrink-0">
                        Sale
                    </span>
                )}
            </div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                {product.productType === 'BUNDLE' ? 'Bundle SRP' : 'SRP'}
            </span>
        </div>
    );
}
