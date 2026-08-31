import * as React from 'react';
import { Users, UserPlus, ServerCrash } from 'lucide-react';
import { SectionHeader, GridMetrics } from '@/components';
import { Button } from '@/components/ui/button';
import { DataTableLayout } from '@/components/ui/data-table-layout';
import { EmptyState } from '@/components/ui/empty-state';
import type { Row } from '@tanstack/react-table';

import { useCustomersPage } from './hooks';
import { CustomerTableToolbar } from '../../components/common/customer-table-toolbar/CustomerTableToolbar';
import { useCreateCustomerSheet, useViewCustomerSheet } from '../../components';
import type { ICustomer } from '../../types';

export function CustomersPage() {
    const {
        globalFilter,
        setGlobalFilter,
        orderByFilter,
        setOrderByFilter,
        orderDirectionFilter,
        setOrderDirectionFilter,
        dateFrom,
        setDateFrom,
        dateTo,
        setDateTo,
        dateError,
        hasActiveFilters,
        refresh,
        resetFilters,
        table,
        loading,
        error,
        isEmpty,
        cardMetrics,
        metricsLoading,
    } = useCustomersPage();

    const { onOpen: onOpenCreateCustomer } = useCreateCustomerSheet();
    const { onOpen: onOpenViewCustomer } = useViewCustomerSheet();

    const handleNewCustomer = React.useCallback(() => {
        onOpenCreateCustomer();
    }, [onOpenCreateCustomer]);

    const handleViewClick = React.useCallback((row: Row<ICustomer>) => {
        onOpenViewCustomer(row.original.id);
    }, [onOpenViewCustomer]);

    return (
        <>
            <SectionHeader
                title="Customers"
                subtitle="Manage and monitor your customer base"
                icon={Users}
                actions={
                    <Button size="lg" onClick={handleNewCustomer}>
                        <UserPlus data-icon="inline-start" className="mr-2 h-4 w-4" />
                        Add Customer
                    </Button>
                }
            />

            <GridMetrics metrics={cardMetrics} isLoading={metricsLoading} />

            <CustomerTableToolbar
                globalFilter={globalFilter}
                setGlobalFilter={setGlobalFilter}
                orderByFilter={orderByFilter}
                setOrderByFilter={setOrderByFilter}
                orderDirectionFilter={orderDirectionFilter}
                setOrderDirectionFilter={setOrderDirectionFilter}
                dateFrom={dateFrom}
                setDateFrom={setDateFrom}
                dateTo={dateTo}
                setDateTo={setDateTo}
                dateError={dateError}
                hasActiveFilters={hasActiveFilters}
                onRefresh={refresh}
                onResetFilters={resetFilters}
            />

            <DataTableLayout
                table={table}
                isLoading={loading}
                error={error}
                isEmpty={isEmpty}
                onRowClick={handleViewClick}
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
