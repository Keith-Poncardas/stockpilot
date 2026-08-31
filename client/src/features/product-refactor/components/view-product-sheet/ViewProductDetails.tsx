import { useQuery } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Box, DollarSign, PackageCheck, Layers, SquarePen, SlidersHorizontal } from 'lucide-react';

import { MetricCard } from '@/components';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { handleGraphQLError, formatCurrency, formatNumber } from '@/lib/utils';
import { PATHS } from '@/routes';

import { GET_PRODUCT } from '../../operations';
import type { IProduct } from '../../types';
import { useEditProductSheet } from '../edit-product-sheet';
import { useViewProductSheet } from './hooks';
import { ViewProductDetailsLayout } from './layout';
import { ViewProductSheetSkeleton } from './skeleton';
import {
    ProductOverviewSection,
    PerformanceMetricsSection,
    SalesTrendChartSection,
    ProductBarcodeSection,
    ProductRecordDetailsSection,
    InventoryHealthSection,
} from './sections';

interface ViewProductDetailsProps {
    productId: string;
}

export function ViewProductDetails({ productId }: ViewProductDetailsProps) {
    const navigate = useNavigate();
    const { onOpen: onOpenEdit } = useEditProductSheet();
    const { onClose: onCloseView } = useViewProductSheet();

    const { data, loading, error } = useQuery(GET_PRODUCT, {
        variables: { productId },
        skip: !productId,
        fetchPolicy: 'cache-and-network',
    });

    if (loading) {
        return <ViewProductSheetSkeleton />;
    }

    if (error || !data?.getProduct) {
        return (
            <div className="py-6 h-full flex flex-col justify-center">
                <EmptyState
                    icon={AlertCircle}
                    title="Product not found"
                    description={handleGraphQLError(error)}
                    iconClassName="text-red-500"
                    iconWrapperClassName="bg-red-50"
                />
            </div>
        );
    }

    const product: IProduct = data.getProduct;
    const inventory = product.inventory;

    const isNotEditable = product.status === 'DISCONTINUED';

    const handleEditClick = () => {
        onCloseView();
        onOpenEdit(product.id);
    };

    const handleAdjustStock = () => {
        if (inventory?.id) {
            onCloseView();
            navigate(PATHS.inventory.adjust(inventory.id));
        }
    };

    const computedMargin =
        product.costPrice != null && product.unitPrice > 0
            ? Number((((product.unitPrice - product.costPrice) / product.unitPrice) * 100).toFixed(1))
            : null;

    const performanceMetrics = product.performanceMetrics ?? {
        unitsSold: 0,
        unitsSoldTrend: 0,
        revenue: 0,
        revenueTrend: 0,
        transactions: 0,
        avgPerSale: 0,
        sellThroughRate: 0,
    };

    const metricsHeader = (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
                value={formatCurrency(product.unitPrice)}
                label="Selling Price"
                icon={<DollarSign className="w-5 h-5" />}
                iconContainerClass="bg-emerald-50 text-emerald-600"
            />
            <MetricCard
                value={product.costPrice != null ? formatCurrency(product.costPrice) : '—'}
                label="Cost Price"
                icon={<Box className="w-5 h-5" />}
                iconContainerClass="bg-blue-50 text-blue-600"
            />
            <MetricCard
                value={formatNumber(inventory?.quantityOnHand ?? 0)}
                label="Current Stock"
                icon={<PackageCheck className="w-5 h-5" />}
                iconContainerClass="bg-violet-50 text-violet-600"
            />
            <MetricCard
                value={formatNumber(inventory?.reorderLevel ?? 0)}
                label="Reorder Level"
                icon={<Layers className="w-5 h-5" />}
                iconContainerClass="bg-amber-50 text-amber-600"
            />
        </div>
    );

    return (
        <ViewProductDetailsLayout
            metrics={metricsHeader}
            mainContent={
                <>
                    <ProductOverviewSection
                        product={{
                            description: product.description,
                            unitPrice: product.unitPrice,
                            costPrice: product.costPrice,
                            margin: computedMargin ?? product.margin ?? product.grossMargin,
                        }}
                    />
                    <PerformanceMetricsSection data={performanceMetrics} />
                    <SalesTrendChartSection productId={product.id} />
                </>
            }
            sidebarContent={
                <>
                    <InventoryHealthSection inventory={inventory} />
                    <ProductBarcodeSection value={product.sku} />
                    <ProductRecordDetailsSection
                        status={product.status}
                        createdAt={product.createdAt}
                        updatedAt={product.updatedAt}
                    />
                </>
            }
            actions={
                <>
                    {inventory && (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleAdjustStock}
                            disabled={isNotEditable}
                            className="font-semibold text-sm h-11 px-6"
                        >
                            <SlidersHorizontal data-icon="inline-start" className="mr-2 h-4 w-4" />
                            Adjust Stock
                        </Button>
                    )}
                    <Button
                        type="button"
                        variant="default"
                        onClick={handleEditClick}
                        disabled={isNotEditable}
                        className="font-semibold text-sm h-11 px-6"
                    >
                        <SquarePen data-icon="inline-start" className="mr-2 h-4 w-4" />
                        Edit Product
                    </Button>
                </>
            }
        />
    );
}
