import { useCallback } from 'react';
import { ShoppingCart, Plus, ServerCrash } from "lucide-react";
import { useNavigate } from 'react-router-dom';

import { GridMetrics, SectionHeader } from "@/components";
import { Button } from "@/components/ui/button";
import { DataTableLayout } from '@/components/ui/data-table-layout';
import { EmptyState } from '@/components/ui/empty-state';
import { PATHS } from '@/routes';

import { useSalesPage } from "./hooks";
import { SaleTableToolbar } from "../../components";

/**
 * Renders the main refactored sales page with metrics, table toolbar filters, and a paginated table.
 * Consumes the useSalesPage custom hook to decouple rendering from state management.
 */
export function SalesPage() {
    const navigate = useNavigate();

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
