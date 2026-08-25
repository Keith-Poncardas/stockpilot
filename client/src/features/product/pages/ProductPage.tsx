import * as React from 'react'
import { useQuery } from '@apollo/client'
import { Box, Filter, Plus, ServerCrash, SlidersHorizontal, CheckCircle, FileText } from 'lucide-react'
import { columns } from '../product.columns'
import { GET_PRODUCTS, GET_PRODUCT_METRICS } from '../operations/op.queries'
import { useDebounce } from '@/hooks/useDebounce'
import { useDataTable } from '@/hooks/useDataTable'
import { DataTableLayout } from '@/components/ui/data-table-layout'
import { DataTableToolbar } from '@/components/ui/data-table-toolbar'
import { SelectFilter } from '@/components/ui/select-filter'
import { DatePicker } from '@/components/ui/date-picker'
import { Button } from '@/components/ui/button'
import SectionHeader from '@/components/SectionHeader'
import { FilterPopover } from '@/components/FilterPopover'
import { EmptyState } from '@/components/ui/empty-state'
import { MetricCard } from '@/components/MetricCard'
import { useNavigate } from 'react-router-dom'
import { PATHS } from '@/routes'

const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'ACTIVE', label: 'Active' },
    { value: 'INACTIVE', label: 'Inactive' },
    { value: 'DISCONTINUED', label: 'Discontinued' },
    { value: 'DRAFT', label: 'Draft' },
    { value: 'ARCHIVED', label: 'Archived' },
]

const orderByOptions = [
    { value: 'createdAt', label: 'Date Created' },
    { value: 'name', label: 'Name' },
    { value: 'unitPrice', label: 'Unit Price' },
]

const orderDirectionOptions = [
    { value: 'desc', label: 'Latest' },
    { value: 'asc', label: 'Oldest' },
]

export function ProductPage() {
    // 1. Search state
    const [globalFilter, setGlobalFilter] = React.useState('')
    const debouncedSearch = useDebounce(globalFilter, 500)

    // 2. Filter states
    const [statusFilter, setStatusFilter] = React.useState<string>('')
    const [orderByFilter, setOrderByFilter] = React.useState<string>('')
    const [orderDirectionFilter, setOrderDirectionFilter] = React.useState<string>('')
    const [dateFrom, setDateFrom] = React.useState<string>('')
    const [dateTo, setDateTo] = React.useState<string>('')
    const [minPrice, setMinPrice] = React.useState<string>('')
    const [maxPrice, setMaxPrice] = React.useState<string>('')

    const debouncedMinPrice = useDebounce(minPrice, 500)
    const debouncedMaxPrice = useDebounce(maxPrice, 500)

    const dateError = dateFrom && dateTo && new Date(dateFrom) > new Date(dateTo)
        ? "Start Date must be before or equal to End Date"
        : null;

    const priceError = debouncedMinPrice && debouncedMaxPrice && Number(debouncedMinPrice) > Number(debouncedMaxPrice)
        ? "Min price must be less than or equal to max price"
        : null;

    // 3. Extract query parameters from our generic hook
    const { table, queryParams, setQueryData, setPagination } = useDataTable({
        columns,
        initialPageSize: 10,
    })

    // Reset pagination when filters change
    React.useEffect(() => {
        setPagination(prev => ({ ...prev, pageIndex: 0 }))
    }, [debouncedSearch, statusFilter, dateFrom, dateTo, debouncedMinPrice, debouncedMaxPrice, orderByFilter, orderDirectionFilter, setPagination])

    // 4. API Request
    const { loading, error, refetch, data } = useQuery(GET_PRODUCTS, {
        variables: {
            args: {
                page: queryParams.page,
                limit: queryParams.limit,
                filter: {
                    search: debouncedSearch || undefined,
                    status: statusFilter || undefined,
                    dateFrom: dateError ? undefined : (dateFrom || undefined),
                    dateTo: dateError ? undefined : (dateTo || undefined),
                    minPrice: priceError ? undefined : (debouncedMinPrice ? Number(debouncedMinPrice) : undefined),
                    maxPrice: priceError ? undefined : (debouncedMaxPrice ? Number(debouncedMaxPrice) : undefined),
                    orderBy: orderByFilter || (queryParams.orderBy || 'createdAt'),
                    orderDirection: orderDirectionFilter || (queryParams.orderDirection || 'desc'),
                }
            }
        },
        fetchPolicy: 'cache-and-network',
        notifyOnNetworkStatusChange: true,
    })

    const { data: productMetricsData } = useQuery(GET_PRODUCT_METRICS, {
        fetchPolicy: 'cache-and-network',
        notifyOnNetworkStatusChange: true,
    });

    React.useEffect(() => {
        if (data?.getProducts) {
            setQueryData({
                data: data.getProducts.data,
                meta: data.getProducts.meta,
            });
        }
    }, [data, setQueryData])

    const isEmpty = !loading && !error && table.getRowModel().rows?.length === 0;

    function refresh() {
        refetch();
        setGlobalFilter('');
    }

    const hasActiveFilters = !!(statusFilter || dateFrom || dateTo || minPrice || maxPrice || orderByFilter || orderDirectionFilter || globalFilter);

    function resetFilters() {
        setStatusFilter('')
        setOrderByFilter('')
        setOrderDirectionFilter('')
        setDateFrom('')
        setDateTo('')
        setMinPrice('')
        setMaxPrice('')
        setGlobalFilter('')
    }

    const navigate = useNavigate();

    function handleAddProduct() {
        navigate(PATHS.products.new);
    }

    return (
        <>
            <SectionHeader
                title="Products"
                subtitle="Manage your product catalog, pricing, and stock levels"
                icon={Box}
                actions={
                    <Button size="lg" onClick={handleAddProduct}>
                        <Plus data-icon="inline-start" />
                        Add Product
                    </Button>
                }
            />

            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <MetricCard
                    value={productMetricsData?.getProductMetrics?.total?.toLocaleString() ?? '-'}
                    label="Total Products"
                    icon={<Box className="w-5 h-5" />}
                    iconContainerClass="bg-blue-50 text-blue-600"
                />
                <MetricCard
                    value={productMetricsData?.getProductMetrics?.active?.toLocaleString() ?? '-'}
                    label="Active Products"
                    icon={<CheckCircle className="w-5 h-5" />}
                    iconContainerClass="bg-green-50 text-green-600"
                />
                <MetricCard
                    value={productMetricsData?.getProductMetrics?.draft?.toLocaleString() ?? '-'}
                    label="Draft Products"
                    icon={<FileText className="w-5 h-5" />}
                    iconContainerClass="bg-gray-100 text-gray-600"
                />
            </div>

            {/* filters */}
            <DataTableToolbar
                searchQuery={globalFilter}
                setSearchQuery={setGlobalFilter}
                searchPlaceholder="Search products..."
                onRefresh={refresh}
                hasActiveFilters={hasActiveFilters}
                onResetFilters={resetFilters}
            >
                <FilterPopover
                    title="Status & Sort"
                    description="Filter products by status and sort order."
                    icon={Filter}
                    contentClassName="w-96 p-4"
                >
                    <div className="grid grid-cols-2 gap-3">
                        <SelectFilter
                            value={statusFilter}
                            onChange={setStatusFilter}
                            options={statusOptions}
                            className="w-full h-8 text-xs lg:h-9 lg:text-sm border-slate-200"
                        />
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
                            className="w-full h-8 text-xs lg:h-9 lg:text-sm border-slate-200 col-span-2"
                        />
                    </div>
                </FilterPopover>

                <FilterPopover
                    title="Date & Price Range"
                    description="Filter products by date created and unit price."
                    icon={SlidersHorizontal}
                    contentClassName="w-80 p-4"
                >
                    {/* Date Range */}
                    <div className="flex flex-col gap-1.5">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Date Created</p>
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
                        {dateError && <p className="text-xs text-red-500 font-medium">{dateError}</p>}
                    </div>

                    {/* Price Range */}
                    <div className="flex flex-col gap-1.5">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Unit Price</p>
                        <div className="grid grid-cols-2 gap-2">
                            <input
                                type="number"
                                min={0}
                                value={minPrice}
                                onChange={(e) => setMinPrice(e.target.value)}
                                placeholder="Min ($)"
                                className="w-full h-8 lg:h-9 rounded-md border border-slate-200 px-3 text-xs lg:text-sm focus:outline-none focus:ring-1 focus:ring-slate-300"
                            />
                            <input
                                type="number"
                                min={0}
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(e.target.value)}
                                placeholder="Max ($)"
                                className="w-full h-8 lg:h-9 rounded-md border border-slate-200 px-3 text-xs lg:text-sm focus:outline-none focus:ring-1 focus:ring-slate-300"
                            />
                        </div>
                        {priceError && <p className="text-xs text-red-500 font-medium">{priceError}</p>}
                    </div>
                </FilterPopover>
            </DataTableToolbar>

            <DataTableLayout
                table={table}
                isLoading={loading}
                error={error}
                isEmpty={isEmpty}
                errorState={<EmptyState title='Something went wrong' description="Failed to load products" icon={ServerCrash} />}
            />
        </>
    )
}