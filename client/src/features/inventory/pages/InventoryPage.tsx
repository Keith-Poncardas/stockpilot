import * as React from 'react'
import { useQuery } from '@apollo/client'
import {
    Warehouse,
    Filter,
    CheckCircle2,
    AlertTriangle,
    XCircle,
    ServerCrash,
    SlidersHorizontal,
    PackagePlus,
} from 'lucide-react'
import { columns } from '../inventory.columns'
import { GET_INVENTORIES, GET_INVENTORY_STATUSES } from '../operations'
import { useDebounce } from '@/hooks/useDebounce'
import { useDataTable } from '@/hooks/useDataTable'
import { DataTableLayout } from '@/components/ui/data-table-layout'
import { DataTableToolbar } from '@/components/ui/data-table-toolbar'
import { SelectFilter } from '@/components/ui/select-filter'
import SectionHeader from '@/components/SectionHeader'
import { FilterPopover } from '@/components/FilterPopover'
import { EmptyState } from '@/components/ui/empty-state'
import { MetricCard } from '@/components/MetricCard'
import type { IInventory } from '../inventory.types'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'

const stockStatusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'WELL_STOCKED', label: 'Well Stocked' },
    { value: 'LOW_STOCK', label: 'Low Stock' },
    { value: 'CRITICAL_OUT', label: 'Critical / Out of Stock' },
]

const orderByOptions = [
    { value: 'updatedAt', label: 'Last Updated' },
    { value: 'quantityOnHand', label: 'Quantity on Hand' },
    { value: 'reorderLevel', label: 'Reorder Level' },
]

const orderDirectionOptions = [
    { value: 'desc', label: 'Latest first' },
    { value: 'asc', label: 'Oldest first' },
]

export function InventoryPage() {
    const [globalFilter, setGlobalFilter] = React.useState('')
    const debouncedSearch = useDebounce(globalFilter, 500)

    const [stockStatusFilter, setStockStatusFilter] = React.useState('')
    const [orderByFilter, setOrderByFilter] = React.useState('')
    const [orderDirectionFilter, setOrderDirectionFilter] = React.useState('')
    const [minQty, setMinQty] = React.useState('')
    const [maxQty, setMaxQty] = React.useState('')

    const debouncedMinQty = useDebounce(minQty, 500)
    const debouncedMaxQty = useDebounce(maxQty, 500)

    const qtyError =
        debouncedMinQty && debouncedMaxQty && Number(debouncedMinQty) > Number(debouncedMaxQty)
            ? 'Min qty must be less than or equal to max qty'
            : null

    const { table, queryParams, setQueryData, setPagination } = useDataTable<IInventory, unknown>({
        columns,
        initialPageSize: 10,
    })

    React.useEffect(() => {
        setPagination((prev) => ({ ...prev, pageIndex: 0 }))
    }, [
        debouncedSearch,
        stockStatusFilter,
        debouncedMinQty,
        debouncedMaxQty,
        orderByFilter,
        orderDirectionFilter,
        setPagination,
    ])

    const { loading, error, refetch, data } = useQuery(GET_INVENTORIES, {
        variables: {
            input: {
                page: queryParams.page,
                limit: queryParams.limit,
                filter: {
                    search: debouncedSearch || undefined,
                    stockStatus: stockStatusFilter || undefined,
                    minQty: qtyError ? undefined : (debouncedMinQty ? Number(debouncedMinQty) : undefined),
                    maxQty: qtyError ? undefined : (debouncedMaxQty ? Number(debouncedMaxQty) : undefined),
                    orderBy: orderByFilter || 'updatedAt',
                    orderDirection: orderDirectionFilter || 'desc',
                },
            },
        },
        fetchPolicy: 'cache-and-network',
        notifyOnNetworkStatusChange: true,
    })

    const { data: statusData } = useQuery(GET_INVENTORY_STATUSES, {
        fetchPolicy: 'cache-and-network',
        notifyOnNetworkStatusChange: true,
    })

    const statuses = statusData?.getInventoryStatuses

    React.useEffect(() => {
        if (data?.getInventories) {
            setQueryData({
                data: data.getInventories.data,
                meta: data.getInventories.meta,
            })
        }
    }, [data, setQueryData])

    const isEmpty = !loading && !error && table.getRowModel().rows?.length === 0

    function refresh() {
        refetch()
        setGlobalFilter('')
    }

    const hasActiveFilters = !!(
        stockStatusFilter ||
        minQty ||
        maxQty ||
        orderByFilter ||
        orderDirectionFilter ||
        globalFilter
    )

    function resetFilters() {
        setStockStatusFilter('')
        setOrderByFilter('')
        setOrderDirectionFilter('')
        setMinQty('')
        setMaxQty('')
        setGlobalFilter('')
    }

    const navigate = useNavigate();

    function handleRecordInventory() {
        navigate('/inventory/record')
    }

    function handleStockMovementLog() {
        navigate('/stock-movement')
    }

    return (
        <>
            <SectionHeader
                title="Inventory"
                subtitle="Monitor real-time stock levels, movements, and track reorder alerts"
                icon={Warehouse}
                actions={
                    <div className="flex items-center gap-2">
                        <Button onClick={handleStockMovementLog} size='lg' variant='outline' className='bg-transparent text-muted-foreground'>
                            <PackagePlus className="mr-1" />
                            Stock Movement Log
                        </Button>
                        <Button onClick={handleRecordInventory} size='lg'>
                            <PackagePlus className="mr-1" />
                            Record Inventory
                        </Button>
                    </div>
                }
            />

            {/* ── Metric Cards ─────────────────────────────────────────────── */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <MetricCard
                    value={statuses?.wellStocked?.toLocaleString() ?? '—'}
                    label="Well Stocked"
                    icon={<CheckCircle2 className="w-5 h-5" />}
                    iconContainerClass="bg-emerald-50 text-emerald-600"
                />
                <MetricCard
                    value={statuses?.lowStock?.toLocaleString() ?? '—'}
                    label="Low Stock"
                    icon={<AlertTriangle className="w-5 h-5" />}
                />
                <MetricCard
                    value={statuses?.criticalOut?.toLocaleString() ?? '—'}
                    label="Critical / Out of Stock"
                    icon={<XCircle className="w-5 h-5" />}
                    iconContainerClass="bg-red-50 text-red-600"
                />
            </div>

            {/* ── Toolbar ──────────────────────────────────────────────────── */}
            <DataTableToolbar
                searchQuery={globalFilter}
                setSearchQuery={setGlobalFilter}
                searchPlaceholder="Search by product name or SKU..."
                onRefresh={refresh}
                hasActiveFilters={hasActiveFilters}
                onResetFilters={resetFilters}
            >
                <FilterPopover
                    title="Status & Sort"
                    description="Filter inventory by stock status and sort order."
                    icon={Filter}
                    contentClassName="w-96 p-4"
                >
                    <div className="grid grid-cols-2 gap-3">
                        <SelectFilter
                            value={stockStatusFilter}
                            onChange={setStockStatusFilter}
                            options={stockStatusOptions}
                            className="w-full h-8 text-xs lg:h-9 lg:text-sm border-slate-200 col-span-2"
                        />
                        <SelectFilter
                            value={orderByFilter}
                            onChange={setOrderByFilter}
                            options={orderByOptions}
                            defaultValue="updatedAt"
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

                <FilterPopover
                    title="Quantity Range"
                    description="Filter by quantity on hand."
                    icon={SlidersHorizontal}
                    contentClassName="w-72 p-4"
                >
                    <div className="flex flex-col gap-1.5">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                            Qty on Hand
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                            <input
                                type="number"
                                min={0}
                                value={minQty}
                                onChange={(e) => setMinQty(e.target.value)}
                                placeholder="Min"
                                className="w-full h-8 lg:h-9 rounded-md border border-slate-200 px-3 text-xs lg:text-sm focus:outline-none focus:ring-1 focus:ring-slate-300"
                            />
                            <input
                                type="number"
                                min={0}
                                value={maxQty}
                                onChange={(e) => setMaxQty(e.target.value)}
                                placeholder="Max"
                                className="w-full h-8 lg:h-9 rounded-md border border-slate-200 px-3 text-xs lg:text-sm focus:outline-none focus:ring-1 focus:ring-slate-300"
                            />
                        </div>
                        {qtyError && (
                            <p className="text-xs text-red-500 font-medium">{qtyError}</p>
                        )}
                    </div>
                </FilterPopover>
            </DataTableToolbar>

            {/* ── Data Table ───────────────────────────────────────────────── */}
            <DataTableLayout
                table={table}
                isLoading={loading}
                error={error}
                isEmpty={isEmpty}
                errorState={
                    <EmptyState
                        title="Something went wrong"
                        description="Failed to load inventory"
                        icon={ServerCrash}
                    />
                }
            />
        </>
    )
}
