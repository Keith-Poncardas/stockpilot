
import { formatCurrency, formatNumber } from '@/lib/utils'

export interface PerformanceMetricsData {
    unitsSold: number;
    unitsSoldTrend: number;
    revenue: number;
    revenueTrend: number;
    transactions: number;
    avgPerSale: number;
    sellThroughRate: number;
}

interface PerformanceMetricsProps {
    data: PerformanceMetricsData;
}

function TrendIndicator({ value, label = "vs last month" }: { value: number, label?: string }) {
    if (value === 0) {
        return <p className="text-xs text-[#6B6960] font-medium mt-1">— {label}</p>
    }

    const isUp = value > 0;
    const colorClass = isUp ? "text-[#2F9E6E]" : "text-red-500";
    const arrow = isUp ? "↑" : "↓";

    return (
        <p className={`text-xs font-medium mt-1 ${colorClass}`}>
            {arrow} {Math.abs(value)}% {label}
        </p>
    )
}

export function PerformanceMetrics({ data }: PerformanceMetricsProps) {
    const {
        unitsSold,
        unitsSoldTrend,
        revenue,
        revenueTrend,
        transactions,
        avgPerSale,
        sellThroughRate
    } = data;

    return (
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl border border-[#E3E1DC] p-4">
                <p className="text-xs uppercase tracking-wide text-[#9C9A91] font-semibold">
                    Units Sold
                </p>
                <p className="font-display text-2xl font-semibold mt-1.5">{formatNumber(unitsSold)}</p>
                <TrendIndicator value={unitsSoldTrend} />
            </div>

            <div className="bg-white rounded-2xl border border-[#E3E1DC] p-4">
                <p className="text-xs uppercase tracking-wide text-[#9C9A91] font-semibold">
                    Revenue
                </p>
                <p className="font-display text-2xl font-semibold mt-1.5">{formatCurrency(revenue)}</p>
                <TrendIndicator value={revenueTrend} />
            </div>

            <div className="bg-white rounded-2xl border border-[#E3E1DC] p-4">
                <p className="text-xs uppercase tracking-wide text-[#9C9A91] font-semibold">
                    Transactions
                </p>
                <p className="font-display text-2xl font-semibold mt-1.5">{formatNumber(transactions)}</p>
                <p className="text-xs text-[#6B6960] font-medium mt-1">Avg {formatCurrency(avgPerSale)} / sale</p>
            </div>

            <div className="bg-white rounded-2xl border border-[#E3E1DC] p-4">
                <p className="text-xs uppercase tracking-wide text-[#9C9A91] font-semibold">
                    Sell-through
                </p>
                <p className="font-display text-2xl font-semibold mt-1.5">{sellThroughRate}%</p>
                <p className="text-xs text-[#6B6960] font-medium mt-1">of stock received</p>
            </div>
        </section>
    )
}
