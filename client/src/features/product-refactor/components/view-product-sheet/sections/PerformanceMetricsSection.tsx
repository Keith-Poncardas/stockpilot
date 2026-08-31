import { formatCurrency, formatNumber } from '@/lib/utils';

export interface PerformanceMetricsData {
    unitsSold: number;
    unitsSoldTrend: number;
    revenue: number;
    revenueTrend: number;
    transactions: number;
    avgPerSale: number;
    sellThroughRate: number;
}

interface PerformanceMetricsSectionProps {
    data: PerformanceMetricsData;
}

function TrendIndicator({ value, label = 'vs last month' }: { value: number; label?: string }) {
    if (value === 0) {
        return <p className="text-xs text-slate-400 font-medium mt-1">— {label}</p>;
    }

    const isUp = value > 0;
    const colorClass = isUp ? 'text-emerald-600' : 'text-red-500';
    const arrow = isUp ? '↑' : '↓';

    return (
        <p className={`text-xs font-medium mt-1 ${colorClass}`}>
            {arrow} {Math.abs(value)}% {label}
        </p>
    );
}

export function PerformanceMetricsSection({ data }: PerformanceMetricsSectionProps) {
    const {
        unitsSold,
        unitsSoldTrend,
        revenue,
        revenueTrend,
        transactions,
        avgPerSale,
        sellThroughRate,
    } = data;

    return (
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
                <p className="text-xs uppercase tracking-wide text-slate-400 font-semibold">
                    Units Sold
                </p>
                <p className="text-2xl font-bold text-slate-900 mt-1.5">{formatNumber(unitsSold)}</p>
                <TrendIndicator value={unitsSoldTrend} />
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
                <p className="text-xs uppercase tracking-wide text-slate-400 font-semibold">
                    Revenue
                </p>
                <p className="text-2xl font-bold text-slate-900 mt-1.5">{formatCurrency(revenue)}</p>
                <TrendIndicator value={revenueTrend} />
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
                <p className="text-xs uppercase tracking-wide text-slate-400 font-semibold">
                    Transactions
                </p>
                <p className="text-2xl font-bold text-slate-900 mt-1.5">{formatNumber(transactions)}</p>
                <p className="text-xs text-slate-500 font-medium mt-1">Avg {formatCurrency(avgPerSale)} / sale</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
                <p className="text-xs uppercase tracking-wide text-slate-400 font-semibold">
                    Sell-through
                </p>
                <p className="text-2xl font-bold text-slate-900 mt-1.5">{sellThroughRate}%</p>
                <p className="text-xs text-slate-500 font-medium mt-1">of stock received</p>
            </div>
        </section>
    );
}

PerformanceMetricsSection.Skeleton = function PerformanceMetricsSectionSkeleton() {
    return (
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((key) => (
                <div key={key} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs animate-pulse">
                    <div className="h-3 w-20 bg-slate-200 rounded" />
                    <div className="h-7 w-24 bg-slate-200 rounded mt-2.5" />
                    <div className="h-3 w-16 bg-slate-100 rounded mt-2" />
                </div>
            ))}
        </section>
    );
};
