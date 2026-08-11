import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { Header, ProductOverview, PerformanceMetrics, ProductBarcode, SalesTrendChart, ProductRecordDetails, ProductViewPageSkeleton } from '../components';
import { InventoryHealth } from '@/components/InventoryHealth';
import { GET_PRODUCT } from '../operations';
import { AlertTriangle } from 'lucide-react';
import { EmptyState } from '@/components/ui/empty-state';
import { StockMovementLedger } from '@/components/ui/stock-movement-ledger';
import { handleGraphQLError } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { MobileActionBar } from '@/components/ui/mobile-action-bar';
import { ProductStatus } from '../product.constants';

export function ProductViewPage() {
    const { productId } = useParams<{ productId: string }>();
    const navigate = useNavigate();

    const { data, loading, error } = useQuery(GET_PRODUCT, {
        variables: { productId },
        skip: !productId,
    });

    if (loading) return <ProductViewPageSkeleton />;

    if (error || !data?.getProduct) {
        return (
            <EmptyState
                icon={AlertTriangle}
                title="Product not found"
                description={handleGraphQLError(error?.graphQLErrors[0]?.message ?? error?.networkError?.message)}
                showBackButton
            />
        );
    }

    function handleEditPage(routeTo: string, id: string) {
        switch (routeTo) {
            case 'product':
                navigate(`/products/${id}/edit`);
                break;
            case 'adjust-stock':
                navigate(`/inventory/${id}/adjust`);
                break;
            default:
                break;
        }
    }

    const productInfo = data.getProduct;
    const inventoryStatus = data.getProduct.inventory;

    // Fallback data for properties not currently exposed via GraphQL GET_PRODUCT
    const salesSummary = {
        unitsSoldMonth: 0,
        revenueMonth: 0,
        transactions: 0,
        avgPerSale: 0,
        sellThroughRate: 0,
    };
    const salesTrend: any[] = [];
    const stockMovementLedger: any[] = [];

    const isNotEditable = data.getProduct.status === ProductStatus.DISCONTINUED.a;

    return (
        <>
            <Header
                title={productInfo.name}
                subtitle={productInfo.sku}
                status={productInfo.status}
                actions={
                    <>
                        <Button variant="glass" className="px-3.5 py-2 font-semibold" disabled>
                            Print Barcode
                        </Button>
                        <Button
                            variant="glass"
                            className="px-3.5 py-2 font-semibold"
                            onClick={() =>
                                handleEditPage(
                                    'adjust-stock',
                                    inventoryStatus?.id || ''
                                )
                            }
                            disabled={isNotEditable || !inventoryStatus}
                        >
                            Adjust Stock
                        </Button>
                        <Button className="px-3.5 py-2" onClick={() => handleEditPage('product', productInfo.id)} disabled={isNotEditable}>
                            Edit Product
                        </Button>
                    </>
                }
            />

            <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6 max-sm:mb-15">

                <div className="lg:col-span-2 flex flex-col gap-6">

                    <ProductOverview
                        product={{
                            description: productInfo.description,
                            unitPrice: productInfo.unitPrice,
                            costPrice: productInfo.costPrice ?? 0,
                            margin: productInfo.grossMargin ?? undefined,
                        }}
                    />

                    <PerformanceMetrics
                        data={{
                            unitsSold: salesSummary.unitsSoldMonth,
                            unitsSoldTrend: 0,
                            revenue: salesSummary.revenueMonth,
                            revenueTrend: 0,
                            transactions: salesSummary.transactions,
                            avgPerSale: salesSummary.avgPerSale,
                            sellThroughRate: salesSummary.sellThroughRate,
                        }}
                    />

                    <SalesTrendChart
                        data={salesTrend}
                        loading={loading}
                    />

                    <StockMovementLedger
                        data={stockMovementLedger}
                        viewAllTo={`/products/${productId}/movements`}
                    />

                </div>

                <div className="flex flex-col gap-6">

                    <InventoryHealth
                        data={{
                            onHand: inventoryStatus?.quantityOnHand ?? 0,
                            reorderLevel: inventoryStatus?.reorderLevel ?? 0,
                            maxStock: inventoryStatus?.maxStock ?? 0,
                            lastRestockDate: inventoryStatus?.lastRestockDate ?? new Date().toISOString(),
                            estimatedDaysOfStock: inventoryStatus?.estimatedDaysOfStock ?? 0,
                        }}
                    />

                    <ProductBarcode value={productInfo.sku} />

                    <ProductRecordDetails
                        status={productInfo.status}
                        createdAt={productInfo.createdAt}
                        updatedAt={productInfo.updatedAt}
                    />

                </div>

            </main>

            <MobileActionBar>
                <MobileActionBar.Action type="button">
                    Print Barcode
                </MobileActionBar.Action>
                <MobileActionBar.Action type="button" onClick={() => handleEditPage('adjust-stock', inventoryStatus?.id || '')}>
                    Adjust Stock
                </MobileActionBar.Action>
                <MobileActionBar.Primary type="button" onClick={() => handleEditPage('product', productInfo.id)} disabled={isNotEditable}>
                    Edit Product
                </MobileActionBar.Primary>
            </MobileActionBar>
        </>
    );
}