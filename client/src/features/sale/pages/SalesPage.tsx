import * as React from 'react';
import { useQuery } from '@apollo/client';
import {
    ShoppingCart,
    TrendingUp,
    BarChart2,
    RefreshCcw,
    Filter,
    SlidersHorizontal,
    ServerCrash,
} from 'lucide-react';
import { columns } from '../sale.columns';
import { GET_SALES, GET_SALE_METRICS } from '../operations';
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
import {
    saleStatusOptions,
    saleOrderByOptions,
    saleOrderDirectionOptions,
} from '../sale.constants';

export function SalesPage() {

    // ── 1. Search state ────────────────────────────────────────────────────────
    const [globalFilter, setGlobalFilter] = React.useState('');
    const debouncedSearch = useDebounce(globalFilter, 500);

    // ── 2. Filter states ───────────────────────────────────────────────────────
    const [statusFilter,         setStatusFilter]         = React.useState('');
    const [paymentMethodFilter,  setPaymentMethodFilter]  = React.useState('');
    const [orderByFilter,        setOrderByFilter]        = React.useState('');
    const [orderDirectionFilter, setOrderDirectionFilter] = React.useState('');
    const [dateFrom,             setDateFrom]             = React.useState('');
    const [dateTo,               setDateTo]               = React.useState('');

    const dateError =
        dateFrom && dateTo && new Date(dateFrom) > new Date(dateTo)
            ? 'Start Date must be before or equal to End Date'
            : null;

    // ── 3. Data table hook ─────────────────────────────────────────────────────
    const { table, queryParams, setQueryData, setPagination } = useDataTable({
        columns,
        initialPageSize: 20,
    });

    // Reset to page 1 whenever any filter changes
    React.useEffect(() => {
        setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    }, [
        debouncedSearch,
        statusFilter,
        paymentMethodFilter,
        dateFrom,
        dateTo,
        orderByFilter,
        orderDirectionFilter,
        setPagination,
    ]);

    // ── 4. Sales list query (paginated) ────────────────────────────────────────
    const { loading, error, refetch, data } = useQuery(GET_SALES, {
        variables: {
            args: {
                page:  queryParams.page,
                limit: queryParams.limit,
                filter: {
                    search:         debouncedSearch       || undefined,
                    status:         statusFilter          || undefined,
                    paymentMethod:  paymentMethodFilter   || undefined,
                    dateFrom:       dateError ? undefined : (dateFrom || undefined),
                    dateTo:         dateError ? undefined : (dateTo   || undefined),
                    orderBy:        orderByFilter         || (queryParams.orderBy        || 'saleDate'),
                    orderDirection: orderDirectionFilter  || (queryParams.orderDirection || 'desc'),
                },
            },
        },
        fetchPolicy: 'cache-and-network',
        notifyOnNetworkStatusChange: true,
    });

    // ── 5. KPI metrics query (independent — loads regardless of table state) ──
    const { data: metricsData, loading: metricsLoading } = useQuery(GET_SALE_METRICS, {
        variables: {
            filter: {
                dateFrom: dateError ? undefined : (dateFrom || undefined),
                dateTo:   dateError ? undefined : (dateTo   || undefined),
            },
        },
        fetchPolicy: 'cache-and-network',
        notifyOnNetworkStatusChange: true,
    });

    // ── 6. Push API data into the table ───────────────────────────────────────
    React.useEffect(() => {
        if (data?.getSales) {
            setQueryData({
                data: data.getSales.data,
                meta: data.getSales.meta,
            });
        }
    }, [data, setQueryData]);

    // ── 7. Derived state ──────────────────────────────────────────────────────
    const isEmpty = !loading && !error && table.getRowModel().rows?.length === 0;
    const metrics = metricsData?.getSalesMetrics;

    const hasActiveFilters = !!(
        globalFilter       ||
        statusFilter       ||
        paymentMethodFilter||
        dateFrom           ||
        dateTo             ||
        orderByFilter      ||
        orderDirectionFilter
    );

    // ── 8. Handlers ───────────────────────────────────────────────────────────
    function refresh() {
        refetch();
        setGlobalFilter('');
    }

    function resetFilters() {
        setStatusFilter('');
        setPaymentMethodFilter('');
        setOrderByFilter('');
        setOrderDirectionFilter('');
        setDateFrom('');
        setDateTo('');
        setGlobalFilter('');
    }

    // ── Render ────────────────────────────────────────────────────────────────
    return (
        <>
            <SectionHeader
                title="Sales"
                subtitle="Track transactions, monitor revenue, and review sales performance"
                icon={ShoppingCart}
            />

            {/* ── KPI Cards ──────────────────────────────────────────────────── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {metricsLoading ? (
                    <>
                        <MetricCard.Skeleton />
                        <MetricCard.Skeleton />
                        <MetricCard.Skeleton />
                        <MetricCard.Skeleton />
                    </>
                ) : (
                    <>
                        <MetricCard
                            value={
                                metrics?.totalRevenue !== undefined
                                    ? formatCurrency(metrics.totalRevenue)
                                    : '—'
                            }
                            label="Total Revenue"
                            icon={<TrendingUp className="w-5 h-5" />}
                            iconContainerClass="bg-emerald-50 text-emerald-600"
                        />
                        <MetricCard
                            value={metrics?.totalTransactions?.toLocaleString() ?? '—'}
                            label="Total Transactions"
                            icon={<ShoppingCart className="w-5 h-5" />}
                            iconContainerClass="bg-blue-50 text-blue-600"
                        />
                        <MetricCard
                            value={
                                metrics?.averageOrderValue !== undefined
                                    ? formatCurrency(metrics.averageOrderValue)
                                    : '—'
                            }
                            label="Avg. Order Value"
                            icon={<BarChart2 className="w-5 h-5" />}
                            iconContainerClass="bg-violet-50 text-violet-600"
                        />
                        <MetricCard
                            value={metrics?.refundedOrVoidedCount?.toLocaleString() ?? '—'}
                            label="Refunded / Voided"
                            icon={<RefreshCcw className="w-5 h-5" />}
                            iconContainerClass="bg-amber-50 text-amber-600"
                        />
                    </>
                )}
            </div>

            {/* ── Toolbar ────────────────────────────────────────────────────── */}
            <DataTableToolbar
                searchQuery={globalFilter}
                setSearchQuery={setGlobalFilter}
                searchPlaceholder="Search by customer or cashier…"
                onRefresh={refresh}
                hasActiveFilters={hasActiveFilters}
                onResetFilters={resetFilters}
            >
                {/* Status & Sort popover */}
                <FilterPopover
                    title="Status & Sort"
                    description="Filter sales by status and sort order."
                    icon={Filter}
                    contentClassName="w-96 p-4"
                >
                    <div className="grid grid-cols-2 gap-3">
                        <SelectFilter
                            value={statusFilter}
                            onChange={setStatusFilter}
                            options={saleStatusOptions}
                            className="w-full h-8 text-xs lg:h-9 lg:text-sm border-slate-200"
                        />
                        <SelectFilter
                            value={orderByFilter}
                            onChange={setOrderByFilter}
                            options={saleOrderByOptions}
                            defaultValue="saleDate"
                            className="w-full h-8 text-xs lg:h-9 lg:text-sm border-slate-200"
                        />
                        <SelectFilter
                            value={orderDirectionFilter}
                            onChange={setOrderDirectionFilter}
                            options={saleOrderDirectionOptions}
                            defaultValue="desc"
                            className="w-full h-8 text-xs lg:h-9 lg:text-sm border-slate-200 col-span-2"
                        />
                    </div>
                </FilterPopover>

                {/* Date range popover */}
                <FilterPopover
                    title="Date Range"
                    description="Filter sales by transaction date."
                    icon={SlidersHorizontal}
                    contentClassName="w-80 p-4"
                >
                    <div className="flex flex-col gap-1.5">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                            Sale Date
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

            {/* ── Table ──────────────────────────────────────────────────────── */}
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
