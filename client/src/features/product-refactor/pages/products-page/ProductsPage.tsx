import * as React from 'react';
import { Box, Plus, ServerCrash } from 'lucide-react';
import { SectionHeader, GridMetrics } from '@/components';
import { Button } from '@/components/ui/button';
import { DataTableLayout } from '@/components/ui/data-table-layout';
import { EmptyState } from '@/components/ui/empty-state';
import type { Row } from '@tanstack/react-table';

import { useProductsPage } from './hooks';
import { ProductTableToolbar } from '../../components/common';
import { useCreateProductSheet, useViewProductSheet } from '../../components';
import type { IProduct } from '../../types';

export function ProductsPage() {
    const {
        globalFilter,
        setGlobalFilter,
        statusFilter,
        setStatusFilter,
        productTypeFilter,
        setProductTypeFilter,
        orderByFilter,
        setOrderByFilter,
        orderDirectionFilter,
        setOrderDirectionFilter,
        dateFrom,
        setDateFrom,
        dateTo,
        setDateTo,
        dateError,
        minPrice,
        setMinPrice,
        maxPrice,
        setMaxPrice,
        priceError,
        hasActiveFilters,
        refresh,
        resetFilters,
        table,
        loading,
        error,
        isEmpty,
        cardMetrics,
        metricsLoading,
    } = useProductsPage();

    const { onOpen: onOpenCreateProduct } = useCreateProductSheet();
    const { onOpen: onOpenViewProduct } = useViewProductSheet();

    const handleNewProduct = React.useCallback(() => {
        onOpenCreateProduct();
    }, [onOpenCreateProduct]);

    const handleViewClick = React.useCallback(
        (row: Row<IProduct>) => {
            onOpenViewProduct(row.original.id);
        },
        [onOpenViewProduct]
    );

    return (
        <>
            <SectionHeader
                title="Products"
                subtitle="Manage your product catalog, pricing, and stock levels"
                icon={Box}
                actions={
                    <Button size="lg" onClick={handleNewProduct}>
                        <Plus data-icon="inline-start" className="mr-2 h-4 w-4" />
                        Add Product
                    </Button>
                }
            />

            <GridMetrics metrics={cardMetrics} isLoading={metricsLoading} />

            <ProductTableToolbar
                globalFilter={globalFilter}
                setGlobalFilter={setGlobalFilter}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                productTypeFilter={productTypeFilter}
                setProductTypeFilter={setProductTypeFilter}
                orderByFilter={orderByFilter}
                setOrderByFilter={setOrderByFilter}
                orderDirectionFilter={orderDirectionFilter}
                setOrderDirectionFilter={setOrderDirectionFilter}
                dateFrom={dateFrom}
                setDateFrom={setDateFrom}
                dateTo={dateTo}
                setDateTo={setDateTo}
                dateError={dateError}
                minPrice={minPrice}
                setMinPrice={setMinPrice}
                maxPrice={maxPrice}
                setMaxPrice={setMaxPrice}
                priceError={priceError}
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
                        description="Failed to load products"
                        icon={ServerCrash}
                    />
                }
            />
        </>
    );
}
