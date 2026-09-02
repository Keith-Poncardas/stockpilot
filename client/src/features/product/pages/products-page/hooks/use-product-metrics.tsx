import { useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { Box, CheckCircle, FileText } from 'lucide-react';
import { GET_PRODUCT_METRICS } from '../../../operations';
import type { IProductMetrics } from '../../../types';
import type { GridMetricItem } from '@/components';

export function useProductMetrics() {
    const { data: metricsData, loading: isMetricsLoading, error } = useQuery<{
        getProductMetrics: IProductMetrics;
    }>(GET_PRODUCT_METRICS, {
        fetchPolicy: 'cache-and-network',
    });

    const metrics = metricsData?.getProductMetrics;

    const cardMetrics: GridMetricItem[] = useMemo(() => [
        {
            value: metrics?.total != null ? metrics.total.toLocaleString() : '—',
            label: 'Total Products',
            icon: Box,
            iconContainerClass: 'bg-blue-50 text-blue-600',
        },
        {
            value: metrics?.active != null ? metrics.active.toLocaleString() : '—',
            label: 'Active Products',
            icon: CheckCircle,
            iconContainerClass: 'bg-emerald-50 text-emerald-600',
        },
        {
            value: metrics?.draft != null ? metrics.draft.toLocaleString() : '—',
            label: 'Draft Products',
            icon: FileText,
            iconContainerClass: 'bg-amber-50 text-amber-600',
        },
    ], [metrics]);

    return {
        cardMetrics,
        isLoading: isMetricsLoading,
        error,
    };
}
