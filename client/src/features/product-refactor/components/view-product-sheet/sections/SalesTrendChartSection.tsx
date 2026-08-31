import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { BarChart3 } from 'lucide-react';

import { BarChart, type BarChartDataPoint } from '@/components/ui/bar-chart';
import { FormSection } from '@/components/ui/form-section';
import { EmptyState } from '@/components/ui/empty-state';
import { SelectFilter, type SelectFilterOption } from '@/components/ui/select-filter';
import { cn } from '@/lib/utils';
import { GET_PRODUCT_SALES_OVERVIEW } from '../../../operations';

export type ProductSalesTimeRange = 'daily' | 'weekly' | 'monthly';

export interface SalesTrendChartSectionProps {
    productId?: string;
    timeRange?: ProductSalesTimeRange;
    onTimeRangeChange?: (range: ProductSalesTimeRange) => void;
    unit?: string;
    className?: string;
}

const TIME_RANGE_OPTIONS: SelectFilterOption[] = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
];

const rangeToPeriod = (range: ProductSalesTimeRange): string => {
    switch (range) {
        case 'weekly':
            return 'WEEKLY';
        case 'monthly':
            return 'MONTHLY';
        case 'daily':
        default:
            return 'DAILY';
    }
};

const getDefaultDescription = (range: ProductSalesTimeRange): string => {
    const now = new Date();
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December',
    ];
    const currentMonth = months[now.getMonth()];
    const year = now.getFullYear();
    switch (range) {
        case 'weekly':
            return `Weekly product sales for ${currentMonth} ${year}`;
        case 'monthly':
            return `Monthly product sales for ${year}`;
        case 'daily':
        default:
            return `Daily product sales for ${currentMonth} ${year}`;
    }
};

export function SalesTrendChartSection({
    productId,
    timeRange = 'daily',
    onTimeRangeChange,
    unit = 'PHP',
    className,
}: SalesTrendChartSectionProps) {
    const [internalRange, setInternalRange] = useState<ProductSalesTimeRange>(timeRange);
    const currentRange = timeRange ?? internalRange;

    const handleRangeChange = (val: string) => {
        const newRange = val as ProductSalesTimeRange;
        setInternalRange(newRange);
        onTimeRangeChange?.(newRange);
    };

    const { data: queryData, loading } = useQuery(GET_PRODUCT_SALES_OVERVIEW, {
        variables: {
            period: rangeToPeriod(currentRange),
            productId,
        },
        skip: !productId,
        fetchPolicy: 'cache-and-network',
    });

    const overviewItems = queryData?.getSalesOverview ?? [];

    const displayData: BarChartDataPoint[] = React.useMemo(() => {
        return overviewItems.map((point: any) => ({
            label: point.label,
            value: Number(point.sales) || 0,
            highlighted: point.isActive,
        }));
    }, [overviewItems]);

    return (
        <FormSection
            title="Sales Overview"
            description={getDefaultDescription(currentRange)}
            icon={<BarChart3 className="w-5 h-5 text-amber-600" />}
            iconWrapperClassName="bg-amber-50"
            actions={
                <SelectFilter
                    value={currentRange}
                    onChange={handleRangeChange}
                    options={TIME_RANGE_OPTIONS}
                    className="w-28 text-xs"
                />
            }
            className={cn('h-full', className)}
        >
            {!loading && displayData.length === 0 ? (
                <div className="mt-2 flex-1 flex flex-col min-h-55">
                    <EmptyState
                        icon={BarChart3}
                        title="No sales data"
                        description="Sales chart will appear here once transactions for this product are recorded."
                        className="flex-1 h-full"
                    />
                </div>
            ) : (
                <div className="pt-2">
                    <BarChart
                        data={displayData}
                        height={200}
                        unit={unit}
                        loading={loading}
                        color="#E3E1DC"
                        highlightColor="#F59E0B"
                    />
                </div>
            )}
        </FormSection>
    );
}

SalesTrendChartSection.Skeleton = function SalesTrendChartSectionSkeleton() {
    return (
        <FormSection
            title="Sales Overview"
            description="Loading product sales trend..."
            icon={<BarChart3 className="w-5 h-5 text-amber-600" />}
            iconWrapperClassName="bg-amber-50"
            className="animate-pulse"
        >
            <BarChart data={[]} loading={true} height={200} />
        </FormSection>
    );
};
