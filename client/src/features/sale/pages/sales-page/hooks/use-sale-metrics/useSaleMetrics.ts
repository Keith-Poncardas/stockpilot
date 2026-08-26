import { useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { GET_SALE_METRICS } from '../../../../operations';
import { buildMetricsCards } from '../../config';
import { formatCurrency } from '@/lib/utils';

/**
 * Custom hook to fetch and format sales metrics for the Sales Page.
 * Returns the card metrics configuration, loading status, and any query errors.
 */
export function useSaleMetrics() {
    const {
        data: metricsData,
        loading: isMetricsLoading,
        error
    } = useQuery(GET_SALE_METRICS, {
        fetchPolicy: 'cache-first',
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
};
