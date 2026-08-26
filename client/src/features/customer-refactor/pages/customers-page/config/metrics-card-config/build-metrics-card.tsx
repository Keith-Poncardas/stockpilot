import { Users, UserPlus, DollarSign, UserCheck } from 'lucide-react';
import type { GridMetricItem } from '@/components/common/grid-metrics/types';

export const buildMetricsCards = (
    metricsData: any,
    formatCurrency: (val: number) => string
): GridMetricItem[] => {
    const metrics = metricsData?.getCustomerMetrics || {};

    const {
        totalCustomers,
        newCustomers,
        totalRevenue,
        returningCustomers
    } = metrics;

    const formattedCurrency = totalRevenue !== undefined ? formatCurrency(totalRevenue) : '—';

    return [
        {
            value: totalCustomers?.toLocaleString() ?? '—',
            label: 'Total Customers',
            icon: Users,
            iconContainerClass: 'bg-emerald-50 text-emerald-600'
        },
        {
            value: newCustomers?.toLocaleString() ?? '—',
            label: 'New This Month',
            icon: UserPlus,
            iconContainerClass: 'bg-blue-50 text-blue-600'
        },
        {
            value: formattedCurrency,
            label: 'Customer Revenue',
            icon: DollarSign,
            iconContainerClass: 'bg-violet-50 text-violet-600'
        },
        {
            value: returningCustomers?.toLocaleString() ?? '—',
            label: 'Returning Customers',
            icon: UserCheck,
            iconContainerClass: 'bg-amber-50 text-amber-600'
        }
    ];
};
