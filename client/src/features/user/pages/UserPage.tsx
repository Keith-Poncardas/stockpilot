import * as React from 'react'
import { useQuery } from '@apollo/client'
import IconInput from '@/components/IconInput'
import { SearchIcon, Filter, Calendar, RotateCcw, Users } from 'lucide-react'
import { columns } from '../user.columns'
import { GET_USERS } from '../operations/op.queries'
import { useDebounce } from '@/hooks/useDebounce'
import { useDataTable } from '@/hooks/useDataTable'
import { DataTable } from '@/components/ui/data-table'
import { DataTablePagination } from '@/components/ui/data-table-pagination'
import { SelectFilter } from '@/components/ui/select-filter'
import { DatePicker } from '@/components/ui/date-picker'
import { Button } from '@/components/ui/button'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import SectionHeader from '@/components/SectionHeader'
import { EmptyState } from '@/components/ui/empty-state'
import { ServerCrash } from 'lucide-react';

const roleOptions = [
    { value: 'all', label: 'All Roles' },
    { value: 'SUPER_ADMIN', label: 'Super Admin' },
    { value: 'ADMIN', label: 'Admin' },
    { value: 'MANAGER', label: 'Manager' },
    { value: 'CASHIER', label: 'Cashier' },
]

const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'ACTIVE', label: 'Active' },
    { value: 'SUSPENDED', label: 'Suspended' },
    { value: 'TERMINATED', label: 'Terminated' },
]

const approvalStatusOptions = [
    { value: 'all', label: 'All Approval Statuses' },
    { value: 'PENDING', label: 'Pending' },
    { value: 'APPROVED', label: 'Approved' },
    { value: 'REJECTED', label: 'Rejected' },
]

const acsDescOptions = [
    { value: 'desc', label: 'Latest' },
    { value: 'asc', label: 'Oldest' }
]

export function UserPage() {
    // 1. Search state
    const [globalFilter, setGlobalFilter] = React.useState('')
    const debouncedSearch = useDebounce(globalFilter, 500)

    // 2. Filter states
    const [roleFilter, setRoleFilter] = React.useState<string>('')
    const [statusFilter, setStatusFilter] = React.useState<string>('')
    const [dateFrom, setDateFrom] = React.useState<string>('')
    const [dateTo, setDateTo] = React.useState<string>('')
    const [acsDescFilter, setAcsDescFilter] = React.useState<string>('')
    const [approvalStatusFilter, setApprovalStatusFilter] = React.useState<string>('')

    const dateError = dateFrom && dateTo && new Date(dateFrom) > new Date(dateTo)
        ? "Start Date must be before or equal to End Date"
        : null;

    // 3. Extract query parameters from our generic hook
    const { table, queryParams, setQueryData } = useDataTable({
        columns,
        initialPageSize: 10,
    })

    // Reset pagination when filters change
    React.useEffect(() => {
        table.setPageIndex(0)
    }, [debouncedSearch, roleFilter, statusFilter, dateFrom, dateTo, acsDescFilter, table])

    // 4. API Request using the extracted queryParams
    const { loading, error, refetch, data } = useQuery(GET_USERS, {
        variables: {
            args: {
                page: queryParams.page,
                limit: queryParams.limit,
                filter: {
                    search: debouncedSearch || undefined,
                    role: roleFilter || undefined,
                    status: statusFilter || undefined,
                    dateFrom: dateError ? undefined : (dateFrom || undefined),
                    dateTo: dateError ? undefined : (dateTo || undefined),
                    orderBy: acsDescFilter ? 'createdAt' : (queryParams.orderBy || 'createdAt'),
                    orderDirection: acsDescFilter ? (acsDescFilter as any) : (queryParams.orderDirection || 'desc'),
                    approvalStatus: approvalStatusFilter || undefined,
                }
            }
        },
        fetchPolicy: 'network-only',
        notifyOnNetworkStatusChange: true,
    })

    React.useEffect(() => {
        if (data?.getUsers) {
            setQueryData({
                data: data.getUsers.data,
                meta: data.getUsers.meta,
            });
        }
    }, [data, setQueryData])

    const isEmpty = !loading && !error && table.getRowModel().rows?.length === 0;

    function refresh() {
        refetch();
        setGlobalFilter('');
    }

    return (
        <>
            <SectionHeader
                title="Users"
                subtitle="Manage all system users and their roles"
                icon={Users}
            />

            {/* filters */}
            <div className="p-4 bg-white border border-gray-200 rounded-sm flex items-center gap-2">
                <div className="max-w-xs flex-1">
                    <IconInput
                        placeholder="Search users..."
                        startAddon={<SearchIcon className="text-muted-foreground w-4 h-4 lg:w-4 lg:h-4" />}
                        value={globalFilter}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        className="h-8 text-xs lg:h-9 lg:text-sm"
                    />
                </div>

                <Button variant="outline" size="icon" className="h-8 w-8 lg:h-9 lg:w-9 border-slate-200" onClick={refresh}>
                    <RotateCcw className="h-4 w-4 text-muted-foreground" strokeWidth={2} />
                </Button>

                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline" size="icon" className="h-8 w-8 lg:h-9 lg:w-9 border-slate-200">
                            <Filter className="h-4 w-4 text-muted-foreground" strokeWidth={2} />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-96 p-4" align="start">
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <h4 className="font-medium leading-none">Role & Status</h4>
                                    <p className="text-sm text-muted-foreground">
                                        Filter users by role and status.
                                    </p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <SelectFilter
                                    value={roleFilter}
                                    onChange={setRoleFilter}
                                    options={roleOptions}
                                    className="w-full h-8 text-xs lg:h-9 lg:text-sm border-slate-200"
                                />
                                <SelectFilter
                                    value={statusFilter}
                                    onChange={setStatusFilter}
                                    options={statusOptions}
                                    className="w-full h-8 text-xs lg:h-9 lg:text-sm border-slate-200"
                                />
                                <SelectFilter
                                    value={approvalStatusFilter}
                                    onChange={setApprovalStatusFilter}
                                    options={approvalStatusOptions}
                                    className="w-full h-8 text-xs lg:h-9 lg:text-sm border-slate-200"
                                />
                                <SelectFilter
                                    value={acsDescFilter}
                                    onChange={setAcsDescFilter}
                                    options={acsDescOptions}
                                    defaultValue="desc"
                                    className="w-full h-8 text-xs lg:h-9 lg:text-sm border-slate-200"
                                />
                            </div>
                        </div>
                    </PopoverContent>
                </Popover>

                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline" size="icon" className="h-8 w-8 lg:h-9 lg:w-9 border-slate-200">
                            <Calendar className="h-4 w-4 text-muted-foreground" strokeWidth={2} />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 p-4" align="start">
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <h4 className="font-medium leading-none">Date Range</h4>
                                    <p className="text-sm text-muted-foreground">
                                        Filter users by creation date.
                                    </p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2 items-center">
                                <DatePicker
                                    value={dateFrom}
                                    onChange={setDateFrom}
                                    placeholder="Start Date"
                                    className="w-full h-8 text-xs lg:h-9 lg:text-sm border-slate-200"
                                />
                                <DatePicker
                                    value={dateTo}
                                    onChange={setDateTo}
                                    placeholder="Oldest"
                                    className="w-full h-8 text-xs lg:h-9 lg:text-sm border-slate-200"
                                />
                            </div>
                            {dateError && <p className="text-xs text-red-500 font-medium">{dateError}</p>}
                        </div>
                    </PopoverContent>
                </Popover>

                {(roleFilter || statusFilter || dateFrom || dateTo || acsDescFilter || approvalStatusFilter) && (
                    <Button
                        onClick={() => {
                            setRoleFilter('')
                            setStatusFilter('')
                            setDateFrom('')
                            setDateTo('')
                            setAcsDescFilter('')
                            setApprovalStatusFilter('')
                        }}
                        className="h-8 lg:h-9 px-3 lg:px-4 text-xs lg:text-sm bg-red-500 hover:bg-red-600 text-white"
                    >
                        Reset
                    </Button>
                )}
            </div>

            <div className='bg-white border border-gray-200 rounded-md overflow-hidden'>

                {/* users table UI */}
                {!error && !isEmpty && <DataTable table={table} isLoading={loading} />}

                {/* empty state */}
                {isEmpty && <EmptyState />}

                {error && <EmptyState title='Something went wrong' description="Failed to load users" icon={ServerCrash} />}

                {/* table pagination UI */}
                {!error && !isEmpty && <DataTablePagination table={table} />}
            </div>
        </>
    )
}
