import React from 'react';
import { ShoppingCart, TrendingUp, BarChart2, RefreshCcw } from 'lucide-react';
import { cleanObject } from '@/lib/utils';
import type { ISaleFilters, ISaleQueryFilters } from './types';
import {
    saleStatusOptions,
    saleOrderByOptions,
    saleOrderDirectionOptions
} from './sale.constants';

/**
 * Options for filtering by payment methods in the system.
 */
export const paymentMethodOptions = [
    { value: '', label: 'All Payments' },
    { value: 'CASH', label: 'Cash' },
    { value: 'GCASH', label: 'GCash' },
    { value: 'BANK_TRANSFER', label: 'Bank Transfer' },
    { value: 'CREDIT_CARD', label: 'Credit Card' },
    { value: 'DEBIT_CARD', label: 'Debit Card' }
];

/**
 * Generates the filter options configuration for the DataTableToolbar.
 */
export const getFilterOptions = (
    filters: ISaleFilters,
    setFilters: React.Dispatch<React.SetStateAction<ISaleFilters>>
) => [
        {
            value: filters.status,
            onChange: (val: string) => setFilters(prev => ({ ...prev, status: val })),
            options: saleStatusOptions
        },
        {
            value: filters.paymentMethod,
            onChange: (val: string) => setFilters(prev => ({ ...prev, paymentMethod: val })),
            options: paymentMethodOptions
        },
        {
            value: filters.orderBy,
            onChange: (val: string) => setFilters(prev => ({ ...prev, orderBy: val })),
            options: saleOrderByOptions,
            defaultValue: 'saleDate'
        },
        {
            value: filters.orderDirection,
            onChange: (val: string) => setFilters(prev => ({ ...prev, orderDirection: val })),
            options: saleOrderDirectionOptions,
            defaultValue: 'desc'
        }
    ];

/**
 * Generates the metrics cards configuration.
 * Uses React.createElement to return icon components.
 */
export const getMetricsCards = (metricsData: any, formatCurrency: (val: number) => string) => {
    const metrics = metricsData?.getSalesMetrics || {};
    const { totalRevenue, totalTransactions, completedSales, refundedOrVoidedCount } = metrics;
    const className = 'w-5 h-5';

    return [
        {
            value: totalRevenue !== undefined ? formatCurrency(totalRevenue) : '—',
            label: 'Total Revenue',
            icon: React.createElement(TrendingUp, { className }),
            iconContainerClass: 'bg-emerald-50 text-emerald-600'
        },
        {
            value: totalTransactions?.toLocaleString() ?? '—',
            label: 'Total Transactions',
            icon: React.createElement(ShoppingCart, { className }),
            iconContainerClass: 'bg-blue-50 text-blue-600'
        },
        {
            value: completedSales?.toLocaleString() ?? '—',
            label: 'Completed Sales',
            icon: React.createElement(BarChart2, { className }),
            iconContainerClass: 'bg-violet-50 text-violet-600'
        },
        {
            value: refundedOrVoidedCount?.toLocaleString() ?? '—',
            label: 'Refunded / Voided',
            icon: React.createElement(RefreshCcw, { className }),
            iconContainerClass: 'bg-amber-50 text-amber-600'
        }
    ];
};

/**
 * Constructs the query filter object for the Apollo GraphQL query.
 */
export const buildSaleQueryFilter = (
    filters: ISaleQueryFilters,
    queryParams: any,
    dateFrom: string | undefined,
    dateTo: string | undefined
) => {
    return cleanObject({
        search: filters.search,
        status: filters.status,
        paymentMethod: filters.paymentMethod,
        dateFrom,
        dateTo,
        orderBy: filters.orderBy || queryParams.orderBy || 'saleDate',
        orderDirection: filters.orderDirection || queryParams.orderDirection || 'desc',
    });
};
