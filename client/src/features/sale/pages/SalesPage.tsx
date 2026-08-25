import * as React from 'react';
import { useQuery } from '@apollo/client';
import { ShoppingCart, ServerCrash, Plus } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';
import { usePaginatedQuery } from '@/hooks/usePaginatedQuery';
import { useDateRangeValidation } from '@/hooks/useDateRangeValidation';
import { DataTableLayout } from '@/components/ui/data-table-layout';
import SectionHeader from '@/components/SectionHeader';
import { EmptyState } from '@/components/ui/empty-state';
import { MetricCard } from '@/components/MetricCard';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { PATHS } from '@/routes';

import { columns } from '../sale.columns';
import { GET_SALES, GET_SALE_METRICS } from '../operations';
import { SaleTableToolbar } from '../components';
import { getFilterOptions, getMetricsCards, buildSaleQueryFilter } from '../sale.options';
import type { ISaleFilters } from '../types';

/**
 * Renders the main sales page with metric cards, search toolbar, and a paginated table.
 *
 * This component acts as the orchestrator for the sales log feature, integrating
 * metrics visualization, advanced search, state filters, andTanStack table results.
 *
 * @returns {JSX.Element} The rendered SalesPage component.
 */
export function SalesPage() {
    const [search, setSearch] = React.useState('');
    const debouncedSearch = useDebounce(search, 500);

    const [filters, setFilters] = React.useState<ISaleFilters>({
        status: '',
        paymentMethod: '',
        orderBy: '',
        orderDirection: '',
        dateFrom: '',
        dateTo: '',
    });

    const {
        dateError,
        dateFrom,
        dateTo
    } = useDateRangeValidation(filters.dateFrom, filters.dateTo);

    const {
        table,
        loading,
        error,
        refetch,
        isEmpty,
    } = usePaginatedQuery({
        query: GET_SALES,
        columns,
        initialPageSize: 10,
        filters: {
            search: debouncedSearch,
            ...filters,
        },
        buildVariables: React.useCallback(({ queryParams, filters }) => ({
            args: {
                page: queryParams.page,
                limit: queryParams.limit,
                filter: buildSaleQueryFilter(
                    filters,
                    queryParams,
                    dateFrom,
                    dateTo
                ),
            }
        }), [dateFrom, dateTo]),
    });

    const {
        data: metricsData,
        loading: isMetricsLoading
    } = useQuery(GET_SALE_METRICS, {
        fetchPolicy: 'cache-and-network',
        notifyOnNetworkStatusChange: true,
    });

    const refresh = React.useCallback(() => {
        refetch();
        setSearch('');
    }, [refetch]);

    const handleReset = React.useCallback(() => {
        setFilters({
            status: '',
            paymentMethod: '',
            orderBy: '',
            orderDirection: '',
            dateFrom: '',
            dateTo: '',
        });
        setSearch('');
    }, []);

    const filterOptions = React.useMemo(() => getFilterOptions(filters, setFilters), [filters, setFilters]);

    const metrics = React.useMemo(() => getMetricsCards(metricsData, formatCurrency), [metricsData]);

    const navigate = useNavigate();

    const handleNewSale = React.useCallback(() => {
        navigate(PATHS.sales.pos);
    }, [navigate]);

    return (
        <>
            <SectionHeader
                title="Sales"
                subtitle="Track transactions, monitor revenue, and review sales performance"
                icon={ShoppingCart}
                actions={
                    <Button size="lg" onClick={handleNewSale}>
                        <Plus className="w-4 h-4 mr-2" />
                        New Sale
                    </Button>
                }
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {!isMetricsLoading ? metrics.map((metric, idx) => (
                    <MetricCard
                        key={idx}
                        value={metric.value}
                        label={metric.label}
                        icon={metric.icon}
                        iconContainerClass={metric.iconContainerClass}
                    />
                )) :
                    metrics.map((_, idx) => (
                        <MetricCard.Skeleton key={idx} />
                    ))
                }
            </div>

            <SaleTableToolbar
                search={search}
                setSearch={setSearch}
                filters={filters}
                setFilters={setFilters}
                filterOptions={filterOptions}
                dateError={dateError}
                onRefresh={refresh}
                onResetFilters={handleReset}
            />

            <DataTableLayout
                table={table}
                isLoading={loading}
                error={error}
                isEmpty={isEmpty}
                errorState={
                    <EmptyState
                        title="Something went wrong"
                        description="Failed to load sales"
                        icon={ServerCrash}
                    />
                }
            />
        </>
    );
}
