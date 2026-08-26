import type { Dispatch, SetStateAction } from 'react';
import type { Table } from '@tanstack/react-table';
import type { ApolloError } from '@apollo/client';
import type { IUseCustomerFilterOptionsReturn } from '../use-customer-filter-options';
import type { GridMetricItem } from '@/components/common/grid-metrics/types';

export interface IUseCustomersPageReturn extends IUseCustomerFilterOptionsReturn {
    globalFilter: string;
    setGlobalFilter: Dispatch<SetStateAction<string>>;
    dateError: string | null;
    hasActiveFilters: boolean;

    refresh: () => void;
    resetFilters: () => void;

    table: Table<any> | null;
    loading: boolean;
    error?: ApolloError | null;
    isEmpty: boolean;

    cardMetrics: GridMetricItem[];
    metricsLoading: boolean;
}
