import { ArrowUpDown, ServerCrash } from "lucide-react";
import { DataTableLayout } from "@/components/ui/data-table-layout";
import SectionHeader from "@/components/SectionHeader";
import { EmptyState } from "@/components/ui/empty-state";
import { MetricCard } from "@/components/MetricCard";
import { StockMovementTableToolbar } from "@/features/stock-movement-refactor/components";
import { useStockMovementPage } from "./hooks";

export function StockMovementPage() {
    const {
        globalFilter,
        setGlobalFilter,
        filters,
        setFilters,
        dateError,
        qtyError,
        table,
        loading,
        error,
        isEmpty,
        metricsLoading,
        filterOptions,
        metricCards,
        refresh,
        resetFilters,
    } = useStockMovementPage();

    return (
        <>

            {/* Page Header */}
            <SectionHeader
                title="Stock Movements"
                subtitle="Manage and track all stock adjustments in your warehouse."
                icon={ArrowUpDown}
            />

            {/* Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {!metricsLoading
                    ? metricCards.map(card => (
                        <MetricCard
                            key={card.id}
                            value={card.value}
                            label={card.label}
                            icon={card.icon}
                            iconContainerClass={card.iconContainerClass}
                        />
                    ))
                    : metricCards.map(card => (
                        <MetricCard.Skeleton key={card.id} />
                    ))}
            </div>

            {/* Toolbar & Filters */}
            <StockMovementTableToolbar
                search={globalFilter}
                setSearch={setGlobalFilter}
                filters={filters}
                setFilters={setFilters}
                filterOptions={filterOptions}
                dateError={dateError}
                qtyError={qtyError}
                onRefresh={refresh}
                onResetFilters={resetFilters}
            />

            {/* Data Table */}
            <DataTableLayout
                table={table}
                isLoading={loading}
                error={error}
                isEmpty={isEmpty}
                errorState={
                    <EmptyState
                        title="Something went wrong"
                        description="Failed to load stock movements"
                        icon={ServerCrash}
                    />
                }
            />
        </>
    );
}
