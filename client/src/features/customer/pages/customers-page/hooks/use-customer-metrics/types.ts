import type { ApolloError } from '@apollo/client';
import type { GridMetricItem } from '@/components/common/grid-metrics/types';

export interface IUseCustomerMetricsReturn {
    cardMetrics: GridMetricItem[];
    isLoading: boolean;
    error?: ApolloError | null;
}
