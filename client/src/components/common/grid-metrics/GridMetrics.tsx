import React, { memo } from 'react';
import { MetricCard } from '@/components';
import type { GridMetricsProps } from './types';

/**
 * Formats values: converts numbers using toLocaleString and falls back to '0'.
 */
const formatMetricValue = (val?: string | number | null): string => {
    if (val === undefined || val === null) return '0';
    if (typeof val === 'number') return val.toLocaleString();
    return String(val);
};


/**
 * GridMetrics component that renders a grid of metric cards.
 *
 * This component is used to display key metrics for any feature.
 * It supports both loading and error states.
 * Wrapped in React.memo to prevent unnecessary re-renders when props remain unchanged.
 *
 * @component
 * @param {GridMetricsProps} props - Component props.
 * @returns {React.ReactElement} The rendered GridMetrics component.
 */
export const GridMetrics = memo(function GridMetrics({
    metrics = [],
    isLoading = false
}: GridMetricsProps) {
    const cardCount = metrics.length || 4;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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

