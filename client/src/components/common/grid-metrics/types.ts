import React from 'react';

/**
 * Represents a single metric card item's data structure.
 */
export interface GridMetricItem {
    /** The raw or formatted value to display. */
    value?: string | number | null;
    /** The descriptive label for the metric. */
    label: string;
    /** The actual Icon component to be rendered (e.g. ShoppingCart). */
    icon: React.ComponentType<{ className?: string }>;
    /** Optional tailwind container style classes for the icon. */
    iconContainerClass?: string;
}

/**
 * Props for the GridMetrics component.
 */
export interface GridMetricsProps {
    /** The list of metrics to render. */
    metrics?: GridMetricItem[];
    /** Whether the metrics are loading. */
    isLoading?: boolean;
    /** Optional number of grid columns on large screens (defaults to matching metrics count up to 4). */
    columns?: 1 | 2 | 3 | 4 | 5 | 6;
    /** Optional additional Tailwind CSS classes for the grid container. */
    className?: string;
}
