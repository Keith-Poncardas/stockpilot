import React, { useState } from "react";
import { BarChart, type BarChartDataPoint } from "@/components/ui/bar-chart";
import { FormSection } from "@/components/ui/form-section";
import { SelectFilter, type SelectFilterOption } from "@/components/ui/select-filter";
import { BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

export type TimeRange = "daily" | "weekly" | "monthly";

export interface SalesOverviewChartProps {
    /** Data points to display on the bar chart */
    data?: BarChartDataPoint[];
    /** Currently selected time range */
    timeRange?: TimeRange;
    /** Callback when time range dropdown changes (ready for API queries) */
    onTimeRangeChange?: (range: TimeRange) => void;
    /** Loading state for API integration */
    loading?: boolean;
    /** Unit label for tooltips */
    unit?: string;
    /** Optional custom description */
    description?: string;
    className?: string;
}

const TIME_RANGE_OPTIONS: SelectFilterOption[] = [
    { value: "daily", label: "Daily" },
    { value: "weekly", label: "Weekly" },
    { value: "monthly", label: "Monthly" },
];

const DUMMY_DAILY_DATA: BarChartDataPoint[] = [
    { label: "Jun 1", value: 12500 },
    { label: "Jun 5", value: 18200 },
    { label: "Jun 10", value: 15400 },
    { label: "Jun 15", value: 24800, highlighted: true },
    { label: "Jun 20", value: 19600 },
    { label: "Jun 25", value: 22100 },
    { label: "Jun 30", value: 28400 },
];

const DUMMY_WEEKLY_DATA: BarChartDataPoint[] = [
    { label: "Week 1", value: 68500 },
    { label: "Week 2", value: 82300 },
    { label: "Week 3", value: 94100, highlighted: true },
    { label: "Week 4", value: 78900 },
];

const DUMMY_MONTHLY_DATA: BarChartDataPoint[] = [
    { label: "Jan", value: 210000 },
    { label: "Feb", value: 245000 },
    { label: "Mar", value: 290000 },
    { label: "Apr", value: 275000 },
    { label: "May", value: 310000 },
    { label: "Jun", value: 345000, highlighted: true },
];

export function SalesOverviewChart({
    data,
    timeRange,
    onTimeRangeChange,
    loading = false,
    unit = "PHP",
    description,
    className,
}: SalesOverviewChartProps) {
    const [internalRange, setInternalRange] = useState<TimeRange>(timeRange || "daily");
    const currentRange = timeRange ?? internalRange;

    const handleRangeChange = (val: string) => {
        const newRange = val as TimeRange;
        setInternalRange(newRange);
        onTimeRangeChange?.(newRange);
    };

    const getDummyData = (range: TimeRange): BarChartDataPoint[] => {
        switch (range) {
            case "weekly":
                return DUMMY_WEEKLY_DATA;
            case "monthly":
                return DUMMY_MONTHLY_DATA;
            case "daily":
            default:
                return DUMMY_DAILY_DATA;
        }
    };

    const getDefaultDescription = (range: TimeRange): string => {
        const now = new Date();
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const currentMonth = months[now.getMonth()];
        const year = now.getFullYear();
        switch (range) {
            case "weekly":
                return `Weekly sales for ${currentMonth} ${year}`;
            case "monthly":
                return `Monthly sales for ${year}`;
            case "daily":
            default:
                return `Daily sales for ${currentMonth} ${year}`;
        }
    };

    const displayData = React.useMemo(() => {
        const rawData = data ?? getDummyData(currentRange);
        if (!data) return rawData;

        const now = new Date();
        const monthsShort = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const currentMonthLabel = monthsShort[now.getMonth()];
        const currentDayLabel = `${currentMonthLabel} ${String(now.getDate()).padStart(2, "0")}`;

        return rawData.map((point, index) => {
            let highlighted = false;
            if (currentRange === "monthly") {
                highlighted = point.label === currentMonthLabel;
            } else if (currentRange === "daily") {
                highlighted = point.label === currentDayLabel || index === rawData.length - 1;
            } else if (currentRange === "weekly") {
                highlighted = index === rawData.length - 1;
            }
            return {
                ...point,
                highlighted,
            };
        });
    }, [data, currentRange]);

    return (
        <FormSection
            title="Sales Overview"
            description={description ?? getDefaultDescription(currentRange)}
            icon={<BarChart3 className="w-5 h-5" />}
            iconWrapperClassName="bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400"
            actions={
                <SelectFilter
                    value={currentRange}
                    onChange={handleRangeChange}
                    options={TIME_RANGE_OPTIONS}
                    className="w-28 text-xs"
                />
            }
            className={cn("h-full", className)}
        >
            <div className="pt-2">
                <BarChart
                    data={displayData}
                    height={220}
                    unit={unit}
                    loading={loading}
                    color="#E3E1DC"
                    highlightColor="#F59E0B"
                />
            </div>
        </FormSection>
    );
}

export default SalesOverviewChart;
