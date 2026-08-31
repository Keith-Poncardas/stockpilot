import { memo } from 'react';
import { MetricCard } from '@/components';
import { cn } from '@/lib/utils';
import type { GridMetricsProps } from './types';

/**
 * Formats values: converts numbers using toLocaleString and falls back to '0'.
 */
const formatMetricValue = (val?: string | number | null): string => {
    if (val === undefined || val === null) return '0';
    if (typeof val === 'number') return val.toLocaleString();
    return String(val);
};

const getGridColsClass = (count: number, explicitCols?: number): string => {
    const targetCols = explicitCols || count;
    switch (targetCols) {
        case 1:
            return 'grid-cols-1';
        case 2:
            return 'grid-cols-1 sm:grid-cols-2';
        case 3:
            return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
        case 4:
            return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';
        case 5:
            return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5';
        case 6:
            return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6';
        default:
            return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';
    }
};

/**
 * GridMetrics component that renders a grid of metric cards.
 *
 * This component is used to display key metrics for any feature.
 * It supports dynamic column auto-fitting based on the number of metrics (e.g. 3 cards = 3 columns full-width).
 * Wrapped in React.memo to prevent unnecessary re-renders when props remain unchanged.
 *
 * @component
 * @param {GridMetricsProps} props - Component props.
 * @returns {React.ReactElement} The rendered GridMetrics component.
 */
export const GridMetrics = memo(function GridMetrics({
    metrics = [],
    isLoading = false,
    columns,
    className,
}: GridMetricsProps) {
    const cardCount = metrics.length || 4;
    const gridColsClass = getGridColsClass(metrics.length || 4, columns);

    return (
        <div className={cn('grid gap-4 w-full', gridColsClass, className)}>
            {isLoading
                ? Array.from({ length: cardCount }).map((_, idx) => (
                    <MetricCard.Skeleton key={`skeleton-${idx}`} />
                ))
                : metrics.map((metric, idx) => {
                    const IconComponent = metric.icon;
                    return (
                        <MetricCard
                            key={metric.label || idx}
                            value={formatMetricValue(metric.value)}
                            label={metric.label}
                            icon={<IconComponent className="w-5 h-5" />}
                            iconContainerClass={metric.iconContainerClass}
                        />
                    );
                })}
        </div>
    );
});
