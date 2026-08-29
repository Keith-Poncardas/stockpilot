import { useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { GET_CUSTOMER_METRICS } from '@/features/customer-refactor';
import { buildMetricsCards } from '../../config/metrics-card-config';
import { formatCurrency } from '@/lib/utils';
import type { IUseCustomerMetricsReturn } from './types';

export function useCustomerMetrics(): IUseCustomerMetricsReturn {
    const { data: metricsData, loading: isMetricsLoading, error } = useQuery(GET_CUSTOMER_METRICS, {
        fetchPolicy: 'cache-and-network',
    });

    const cardMetrics = useMemo(() => buildMetricsCards(
        metricsData,
        formatCurrency
    ), [metricsData]);

    return useMemo(() => ({
        cardMetrics,
        isLoading: isMetricsLoading,
        error
    }), [cardMetrics, isMetricsLoading, error]);
}
