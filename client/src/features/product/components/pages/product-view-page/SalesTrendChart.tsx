import { BarChart, type BarChartDataPoint } from '@/components/ui/bar-chart';

export interface SalesTrendDataPoint {
    /** Display label for the x-axis (e.g. "Mon", "Tue", or a date string) */
    label: string;
    /** Number of units sold */
    unitsSold: number;
    /** If true, renders this bar in the accent/highlight color */
    isToday?: boolean;
}

interface SalesTrendChartProps {
    /** Chart data from the API */
    data?: SalesTrendDataPoint[];
    /** Shows loading skeleton when true */
    loading?: boolean;
    /** Section title. Default: "Sales — Last 7 Days" */
    title?: string;
    /** Subtitle / unit label. Default: "units sold / day" */
    unit?: string;
    /** Height of the chart area in px. Default: 160 */
    chartHeight?: number;
}

function toBarChartData(data: SalesTrendDataPoint[]): BarChartDataPoint[] {
    return data.map((d) => ({
        label: d.label,
        value: d.unitsSold,
        highlighted: d.isToday,
    }));
}

export function SalesTrendChart({
    data,
    loading = false,
    title = 'Sales — Last 7 Days',
    unit = 'units sold / day',
    chartHeight = 160,
}: SalesTrendChartProps) {
    const chartData: BarChartDataPoint[] = data ? toBarChartData(data) : [];

    return (
        <section className="bg-white rounded-2xl border border-[#E3E1DC] p-5 sm:p-6">
            <div className="flex items-center justify-between mb-5">
                <h2 className="font-display font-semibold text-lg">{title}</h2>
                <span className="text-xs font-mono text-[#9C9A91]">{unit}</span>
            </div>

            <BarChart
                data={chartData}
                height={chartHeight}
                unit="units"
                loading={loading || (!data && !loading)}
            />
        </section>
    );
}

SalesTrendChart.Skeleton = function SalesTrendChartSkeleton() {
    return (
        <section className="bg-white rounded-2xl border border-[#E3E1DC] p-5 sm:p-6">
            <div className="flex items-center justify-between mb-5">
                <div className="h-6 w-48 bg-[#F0EFEA] animate-pulse rounded-md" />
                <div className="h-4 w-28 bg-[#F0EFEA] animate-pulse rounded-md" />
            </div>

            <BarChart data={[]} loading={true} height={160} />
        </section>
    );
}
