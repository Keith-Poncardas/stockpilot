import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { PATHS } from '@/routes';
import { useQuery } from '@apollo/client';
import { Button } from '@/components/ui/button';
import { Users, UserPlus, TrendingUp, Repeat2, Filter, SlidersHorizontal, ServerCrash } from 'lucide-react';
import { columns } from '../customer.columns';
import { GET_CUSTOMERS, GET_CUSTOMER_METRICS } from '../operations';
import { useDebounce } from '@/hooks/useDebounce';
import { useDataTable } from '@/hooks/useDataTable';
import { DataTableLayout } from '@/components/ui/data-table-layout';
import { DataTableToolbar } from '@/components/ui/data-table-toolbar';
import { SelectFilter } from '@/components/ui/select-filter';
import { DatePicker } from '@/components/ui/date-picker';
import { MetricCard } from '@/components/MetricCard';
import { FilterPopover } from '@/components/FilterPopover';
import { EmptyState } from '@/components/ui/empty-state';
import SectionHeader from '@/components/SectionHeader';
import { formatCurrency } from '@/lib/utils';

const orderByOptions = [
    { value: 'createdAt', label: 'Date Registered' },
    { value: 'firstName', label: 'First Name' },
    { value: 'lastName',  label: 'Last Name' },
];

const orderDirectionOptions = [
    { value: 'desc', label: 'Latest First' },
    { value: 'asc',  label: 'Oldest First' },
];

export function CustomerPage() {

    // 1. Search state
    const [globalFilter, setGlobalFilter] = React.useState('');
    const debouncedSearch = useDebounce(globalFilter, 500);

    // 2. Filter states
    const [orderByFilter,        setOrderByFilter]        = React.useState('');
    const [orderDirectionFilter, setOrderDirectionFilter] = React.useState('');
    const [dateFrom,             setDateFrom]             = React.useState('');
    const [dateTo,               setDateTo]               = React.useState('');

    const dateError =
        dateFrom && dateTo && new Date(dateFrom) > new Date(dateTo)
            ? 'Start Date must be before or equal to End Date'
            : null;

    // 3. Data table hook
    const { table, queryParams, setQueryData, setPagination } = useDataTable({
        columns,
        initialPageSize: 10,
    });

    // Reset to page 1 whenever filters change
    React.useEffect(() => {
        setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    }, [debouncedSearch, dateFrom, dateTo, orderByFilter, orderDirectionFilter, setPagination]);

    // 4. Customers query (paginated)
    const { loading, error, refetch, data } = useQuery(GET_CUSTOMERS, {
        variables: {
            args: {
                page:  queryParams.page,
                limit: queryParams.limit,
                filter: {
                    search:         debouncedSearch || undefined,
                    dateFrom:       dateError ? undefined : (dateFrom || undefined),
                    dateTo:         dateError ? undefined : (dateTo   || undefined),
                    orderBy:        orderByFilter        || (queryParams.orderBy        || 'createdAt'),
                    orderDirection: orderDirectionFilter || (queryParams.orderDirection || 'desc'),
                },
            },
        },
        fetchPolicy: 'cache-and-network',
        notifyOnNetworkStatusChange: true,
    });

    // 5. Dashboard metrics query
    const { data: metricsData } = useQuery(GET_CUSTOMER_METRICS, {
        fetchPolicy: 'cache-and-network',
        notifyOnNetworkStatusChange: true,
    });

    React.useEffect(() => {
        if (data?.getCustomers) {
            setQueryData({
                data: data.getCustomers.data,
                meta: data.getCustomers.meta,
            });
        }
    }, [data, setQueryData]);

    const isEmpty = !loading && !error && table.getRowModel().rows?.length === 0;

    const metrics = metricsData?.getCustomerMetrics;

    function refresh() {
        refetch();
        setGlobalFilter('');
    }

    const hasActiveFilters = !!(
        dateFrom || dateTo || orderByFilter || orderDirectionFilter || globalFilter
    );

    function resetFilters() {
        setOrderByFilter('');
        setOrderDirectionFilter('');
        setDateFrom('');
        setDateTo('');
        setGlobalFilter('');
    }

    const navigate = useNavigate();

    function handleAddCustomer() {
        navigate(PATHS.customers.new);
    }

    return (
        <>
            <SectionHeader
                title="Customers"
                subtitle="Manage and monitor your customer base"
                icon={Users}
                actions={
                    <Button size="lg" onClick={handleAddCustomer}>
                        <UserPlus data-icon="inline-start" />
                        Add Customer
                    </Button>
                }
            />

            {/* ── Dashboard Metrics ─────────────────────────────────────────── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard
                    value={metrics?.totalCustomers?.toLocaleString() ?? '—'}
                    label="Total Customers"
                    icon={<Users className="w-5 h-5" />}
                    iconContainerClass="bg-blue-50 text-blue-600"
                />
                <MetricCard
                    value={metrics?.newCustomers?.toLocaleString() ?? '—'}
                    label="New This Month"
                    icon={<UserPlus className="w-5 h-5" />}
                    iconContainerClass="bg-emerald-50 text-emerald-600"
                />
                <MetricCard
                    value={
                        metrics?.totalRevenue !== undefined
                            ? formatCurrency(metrics.totalRevenue)
                            : '—'
                    }
                    label="Customer Revenue"
                    icon={<TrendingUp className="w-5 h-5" />}
                    iconContainerClass="bg-violet-50 text-violet-600"
                />
                <MetricCard
                    value={metrics?.returningCustomers?.toLocaleString() ?? '—'}
                    label="Returning Customers"
                    icon={<Repeat2 className="w-5 h-5" />}
                    iconContainerClass="bg-amber-50 text-amber-600"
                />
            </div>

            {/* ── Filters & Search ──────────────────────────────────────────── */}
            <DataTableToolbar
                searchQuery={globalFilter}
                setSearchQuery={setGlobalFilter}
                searchPlaceholder="Search customers…"
                onRefresh={refresh}
                hasActiveFilters={hasActiveFilters}
                onResetFilters={resetFilters}
            >
                {/* Sort */}
                <FilterPopover
                    title="Sort"
                    description="Sort customers by field and direction."
                    icon={Filter}
                    contentClassName="w-80 p-4"
                >
                    <div className="grid grid-cols-2 gap-3">
                        <SelectFilter
                            value={orderByFilter}
                            onChange={setOrderByFilter}
                            options={orderByOptions}
                            defaultValue="createdAt"
                            className="w-full h-8 text-xs lg:h-9 lg:text-sm border-slate-200"
                        />
                        <SelectFilter
                            value={orderDirectionFilter}
                            onChange={setOrderDirectionFilter}
                            options={orderDirectionOptions}
                            defaultValue="desc"
                            className="w-full h-8 text-xs lg:h-9 lg:text-sm border-slate-200"
                        />
                    </div>
                </FilterPopover>

                {/* Date range */}
                <FilterPopover
                    title="Date Range"
                    description="Filter customers by their registration date."
                    icon={SlidersHorizontal}
                    contentClassName="w-72 p-4"
                >
                    <div className="flex flex-col gap-1.5">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                            Customer Since
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                            <DatePicker
                                value={dateFrom}
                                onChange={setDateFrom}
                                placeholder="Start Date"
                                className="w-full h-8 text-xs lg:h-9 lg:text-sm border-slate-200"
                            />
                            <DatePicker
                                value={dateTo}
                                onChange={setDateTo}
                                placeholder="End Date"
                                className="w-full h-8 text-xs lg:h-9 lg:text-sm border-slate-200"
                            />
                        </div>
                        {dateError && (
                            <p className="text-xs text-red-500 font-medium">{dateError}</p>
                        )}
                    </div>
                </FilterPopover>
            </DataTableToolbar>

            {/* ── Table ────────────────────────────────────────────────────── */}
            <DataTableLayout
                table={table}
                isLoading={loading}
                error={error}
                isEmpty={isEmpty}
                errorState={
                    <EmptyState
                        title="Something went wrong"
                        description="Failed to load customers"
                        icon={ServerCrash}
                    />
                }
            />
        </>
    );
}
