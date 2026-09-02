import * as React from 'react'
import { useQuery } from '@apollo/client'
import { Users } from 'lucide-react'
import { GET_USERS, GET_USER_METRICS } from '../operations/op.queries'
import { useDebounce } from '@/hooks/useDebounce'
import { usePaginatedQuery } from '@/hooks/usePaginatedQuery'
import { useDateRangeValidation } from '@/hooks/useDateRangeValidation'

import { DataTableLayout } from '@/components/ui/data-table-layout'
import SectionHeader from '@/components/SectionHeader'
import { EmptyState } from '@/components/ui/empty-state'
import { ServerCrash } from 'lucide-react';
import { MetricCard } from '@/components/MetricCard'
import {
    getFilterOptions,
    getMetricsCards,
    buildUserQueryFilter
} from '../user.options'
import type { UserFilters } from '../types'
import { columns } from '../user.columns'
import { UserTableToolbar } from '../components'

/**
 * Renders the main user management page.
 *
 * This component acts as the orchestrator for the user management feature.
 * It integrates the paginated data table, search and filtering toolbar,
 * and key performance indicator (KPI) metric cards. It manages the state
 * for user queries and handles the fetching logic using Apollo Client.
 *
 * @returns The rendered UserPage component.
 */
export function UserPage() {
    const [search, setSearch] = React.useState('')
    const debouncedSearch = useDebounce(search, 500);

    /**
     * Local state for managing active filters on the user table.
     */
    const [filters, setFilters] = React.useState<UserFilters>({
        role: '',
        status: '',
        approvalStatus: '',
        dateFrom: '',
        dateTo: '',
        acsDesc: '',
    });

    /**
     * Validates the date range and returns the validated dates.
     */
    const {
        dateError,
        dateFrom,
        dateTo
    } = useDateRangeValidation(filters.dateFrom, filters.dateTo);

    /**
     * Hooks into the usePaginatedQuery hook to fetch paginated data from the API.
     */
    const {
        table,
        loading,
        error,
        refetch,
        isEmpty,
    } = usePaginatedQuery({
        query: GET_USERS,
        columns,
        initialPageSize: 10,
        filters: {
            search: debouncedSearch,
            ...filters,
        },
        buildVariables: React
            .useCallback(({ queryParams, filters }: { queryParams: any; filters: UserFilters & { search: string } }) => ({
                args: {
                    page: queryParams.page,
                    limit: queryParams.limit,
                    filter: buildUserQueryFilter(
                        filters,
                        queryParams,
                        dateFrom ? String(dateFrom) : undefined,
                        dateTo ? String(dateTo) : undefined
                    )
                }
            }), [dateFrom, dateTo]),
    });

    /**
     * Hooks into the useQuery hook to fetch (KPI's / Metrics) data from the API.
     */
    const {
        data: userMetricsData,
        loading: isMetricsLoading,
    } = useQuery(GET_USER_METRICS, {
        variables: {},
        fetchPolicy: 'cache-first',
        notifyOnNetworkStatusChange: true,
    });

    /**
     * Refreshes the data in the table.
     */
    const refresh = React.useCallback(() => {
        refetch();
        setSearch('');
    }, [refetch]);

    /**
     * Resets the filters to their default values.
     */
    const handleReset = React.useCallback(() => {
        setFilters({
            role: '',
            status: '',
            approvalStatus: '',
            dateFrom: '',
            dateTo: '',
            acsDesc: '',
        })
        setSearch('')
    }, []);

    /**
     * Generates the filter options configuration for the DataTableToolbar.
     */
    const filterOptions = React.useMemo(() => getFilterOptions(
        filters,
        setFilters
    ), [filters, setFilters]);

    /**
     * Generates the metrics cards configuration for the MetricCard component.
     */
    const metrics = React.useMemo(() => getMetricsCards(
        userMetricsData
    ), [userMetricsData]);

    return (
        <>
            {/* Header section displaying page title and description */}
            <SectionHeader
                title="Users"
                subtitle="Manage your team members, roles, and access control"
                icon={Users}
            />

            {/* Metrics cards displaying total, active, and pending users */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {!isMetricsLoading ? metrics.map((metric, idx) => (
                    <MetricCard
                        key={idx}
                        value={metric.value}
                        label={metric.label}
                        icon={metric.icon}
                        iconContainerClass="bg-amber-50 text-amber-600"
                    />
                )) :
                    metrics.map((_, idx) => (
                        <MetricCard.Skeleton key={idx} />
                    ))
                }
            </div>

            {/* User table toolbar for filtering and searching users */}
            <UserTableToolbar
                search={search}
                setSearch={setSearch}
                filters={filters}
                setFilters={setFilters}
                filterOptions={filterOptions}
                dateError={dateError}
                onRefresh={refresh}
                onResetFilters={handleReset}
            />

            {/* Data table layout containing the data table */}
            <DataTableLayout
                table={table}
                isLoading={loading}
                error={error}
                isEmpty={isEmpty}
                errorState={
                    <EmptyState
                        title='Something went wrong'
                        description="Failed to load users"
                        icon={ServerCrash}
                    />
                }
            />
        </>
    )
};