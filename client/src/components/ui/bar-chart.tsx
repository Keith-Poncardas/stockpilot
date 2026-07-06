import {
    BarChart as RechartsBarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import { cn } from '@/lib/utils';

export interface BarChartDataPoint {
    label: string;
    value: number;
    /** If true, this bar is highlighted with the accent color */
    highlighted?: boolean;
}

interface BarChartProps {
    data: BarChartDataPoint[];
    /** Height of the chart area in px. Default: 160 */
    height?: number;
    /** Default bar color. Default: #E3E1DC */
    color?: string;
    /** Highlighted bar color. Default: #E8A33D */
    highlightColor?: string;
    /** Unit label shown in the tooltip (e.g. "units") */
    unit?: string;
    /** Show loading skeleton instead of data */
    loading?: boolean;
    className?: string;
}

interface TooltipPayloadEntry {
    value: number;
    payload: BarChartDataPoint;
}

function CustomTooltip({
    active,
    payload,
    unit,
}: {
    active?: boolean;
    payload?: TooltipPayloadEntry[];
    unit?: string;
}) {
    if (!active || !payload?.length) return null;
    const { label, value } = payload[0].payload;
    return (
        <div className="rounded-xl border border-[#E3E1DC] bg-white px-3 py-2 shadow-lg text-xs">
            <p className="font-semibold text-[#1A1915]">{label}</p>
            <p className="text-[#6B6960] mt-0.5">
                {value.toLocaleString()} {unit}
            </p>
        </div>
    );
}

function LoadingSkeleton({ height }: { height: number }) {
    const bars = [45, 60, 80, 35, 55, 70, 100];
    return (
        <div
            className="flex items-end gap-3"
            style={{ height }}
            aria-label="Loading chart"
        >
            {bars.map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                    <div
                        className="w-full rounded-t-md bg-[#E3E1DC] animate-pulse"
                        style={{ height: `${h}%` }}
                    />
                    <div className="h-3 w-5 rounded bg-[#E3E1DC] animate-pulse" />
                </div>
            ))}
        </div>
    );
}

export function BarChart({
    data,
    height = 160,
    color = '#E3E1DC',
    highlightColor = '#E8A33D',
    unit,
    loading = false,
    className,
}: BarChartProps) {
    if (loading) {
        return (
            <div className={cn('w-full', className)}>
                <LoadingSkeleton height={height} />
            </div>
        );
    }

    const chartData = data.map((d) => ({
        ...d,
        fill: d.highlighted ? highlightColor : color,
    }));

    return (
        <div className={cn('w-full', className)} style={{ height }}>
            <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart
                    data={chartData}
                    margin={{ top: 4, right: 0, left: 0, bottom: 0 }}
                    barCategoryGap="8%"
                >
                    <XAxis
                        dataKey="label"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 11, fill: '#9C9A91', fontFamily: 'monospace' }}
                    />
                    <YAxis hide />
                    <Tooltip
                        content={<CustomTooltip unit={unit} />}
                        cursor={{ fill: 'transparent' }}
                    />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]} />
                </RechartsBarChart>
            </ResponsiveContainer>
        </div>
    );
}
