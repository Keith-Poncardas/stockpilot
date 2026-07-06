
import { Image } from 'lucide-react'
import type { IProduct } from '@/features/product/product.types'
import { formatCurrency } from '@/lib/utils'

interface ProductOverviewProps {
    product: Pick<IProduct, 'description' | 'unitPrice' | 'costPrice' | 'margin'>
}

export function ProductOverview({ product }: ProductOverviewProps) {

    return (
        <section className="bg-white rounded-2xl border border-[#E3E1DC] p-5 sm:p-6">
            <div className="flex flex-col sm:flex-row gap-6">
                <div className="w-full sm:w-40 sm:h-40 h-48 rounded-xl bg-[#F0EFEA] border border-[#E3E1DC] flex items-center justify-center shrink-0">
                    <Image className="w-12 h-12 text-[#B7B4AC]" strokeWidth={1.5} />
                </div>
                <div className="flex-1">
                    <p className="text-sm text-[#6B6960] leading-relaxed">
                        {product.description || 'No description available.'}
                    </p>
                    <div className="grid grid-cols-3 gap-4 mt-5">
                        <div>
                            <p className="text-xs uppercase tracking-wide text-[#9C9A91] font-semibold">
                                Unit Price
                            </p>
                            <p className="font-display text-2xl font-semibold mt-1">{formatCurrency(product.unitPrice)}</p>
                        </div>
                        <div>
                            <p className="text-xs uppercase tracking-wide text-[#9C9A91] font-semibold">
                                Cost Price
                            </p>
                            <p className="font-display text-2xl font-semibold mt-1 text-[#6B6960]">
                                {formatCurrency(product.costPrice)}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs uppercase tracking-wide text-[#9C9A91] font-semibold">
                                Margin
                            </p>
                            <p className="font-display text-2xl font-semibold mt-1 text-[#2F9E6E]">
                                {product.margin ?? 0}%
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
