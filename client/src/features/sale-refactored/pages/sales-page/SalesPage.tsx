import { useCallback } from 'react';
import { ShoppingCart, Plus, ServerCrash, Calculator } from "lucide-react";

import { GridMetrics, SectionHeader } from "@/components";
import { Button } from "@/components/ui/button";
import { DataTableLayout } from '@/components/ui/data-table-layout';
import { EmptyState } from '@/components/ui/empty-state';
import { useSheet } from '@/providers';

import { useSalesPage } from "./hooks";
import { SaleTableToolbar, ViewSaleDetails, PointOfSale } from "../../components";

/**
 * Renders the main refactored sales page with metrics, table toolbar filters, and a paginated table.
 * Consumes the useSalesPage custom hook to decouple rendering from state management.
 */
export function SalesPage() {
    const { openSheet } = useSheet();

    const {
        search,
        setSearch,
        filters,
        setFilters,
        dateError,
        cardMetrics,
        isLoading,
        filterOptions,
        refresh,
        handleReset,
        table,
        loading,
        error,
        isEmpty,
    } = useSalesPage();

    const handleNewSale = useCallback(() => {
        openSheet({
            title: "Point of Sale",
            description: "Process new transactions, select products, and complete sales.",
            icon: Calculator,
            content: <PointOfSale />,
            className: "w-[95vw] max-w-none sm:max-w-[600px] md:max-w-[768px] lg:max-w-[800px] !sm:max-w-3xl",
        });
    }, [openSheet]);

    const handleRowClick = useCallback((row: any) => {
        openSheet({
            title: "Sale Details",
            description: "Comprehensive overview of the transaction, including purchased items and customer details.",
            icon: ShoppingCart,
            content: <ViewSaleDetails saleId={row.original.id} />,
            className: "w-[95vw] max-w-none sm:max-w-[600px] md:max-w-[768px] lg:max-w-[780px] !sm:max-w-3xl",
        });
    }, [openSheet]);

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

            <GridMetrics metrics={cardMetrics} isLoading={isLoading} />

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
                onRowClick={handleRowClick}
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
};
