import React from 'react';
import { useQuery } from '@apollo/client';
import { BarChart3 } from 'lucide-react';

import { BarChart, type BarChartDataPoint } from '@/components/ui/bar-chart';
import { FormSection } from '@/components/ui/form-section';
import { EmptyState } from '@/components/ui/empty-state';
import { cn } from '@/lib/utils';
import { GET_PRODUCT_SALES_OVERVIEW } from '../../../operations';

export interface SalesTrendChartSectionProps {
    productId?: string;
    unit?: string;
    className?: string;
}

const getDailyDescription = (): string => {
    const now = new Date();
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December',
    ];
    const currentMonth = months[now.getMonth()];
    const year = now.getFullYear();
    return `Daily product sales for ${currentMonth} ${year}`;
};

export function SalesTrendChartSection({
    productId,
    unit = 'PHP',
    className,
}: SalesTrendChartSectionProps) {
    const { data: queryData, loading } = useQuery(GET_PRODUCT_SALES_OVERVIEW, {
        variables: {
            period: 'DAILY',
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
            description={getDailyDescription()}
            icon={<BarChart3 className="w-5 h-5 text-amber-600" />}
            iconWrapperClassName="bg-amber-50"
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
