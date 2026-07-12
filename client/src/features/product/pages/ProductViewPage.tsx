import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { Header, ProductOverview, InventoryHealth, PerformanceMetrics, ProductBarcode, SalesTrendChart, ProductRecordDetails, ProductViewPageSkeleton } from '../components';
import { GET_PRODUCT } from '../operations';
import { AlertTriangle } from 'lucide-react';
import { EmptyState } from '@/components/ui/empty-state';
import { StockMovementLedger } from '@/components/ui/stock-movement-ledger';
import { handleGraphQLError } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { MobileActionBar } from '@/components/ui/mobile-action-bar';
import { ProductStatus } from '../product.constants';

const dummySalesTrend = [
    { date: '2026-07-01T00:00:00.000Z', label: 'Wed', unitsSold: 30, isToday: false },
    { date: '2026-07-02T00:00:00.000Z', label: 'Thu', unitsSold: 35, isToday: false },
    { date: '2026-07-03T00:00:00.000Z', label: 'Fri', unitsSold: 32, isToday: false },
    { date: '2026-07-04T00:00:00.000Z', label: 'Sat', unitsSold: 40, isToday: false },
    { date: '2026-07-05T00:00:00.000Z', label: 'Sun', unitsSold: 45, isToday: false },
    { date: '2026-07-06T00:00:00.000Z', label: 'Mon', unitsSold: 42, isToday: false },
    { date: '2026-07-07T00:00:00.000Z', label: 'Tue', unitsSold: 48, isToday: true },
];

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

    function handleEditPage() {
        navigate(`/products/${productId}/edit`);
    }

    const { productInfo, inventoryStatus, salesSummary } = data.getProduct;

    const isNotEditable = data.getProduct.productInfo?.status === ProductStatus.DISCONTINUED.a;

    return (
        <>
            <Header
                title={productInfo.name}
                subtitle={productInfo.sku}
                status={productInfo.status}
                actions={
                    <>
                        <Button variant="glass" className="px-3.5 py-2 font-semibold">
                            Print Barcode
                        </Button>
                        <Button variant="glass" className="px-3.5 py-2 font-semibold">
                            Adjust Stock
                        </Button>
                        <Button className="px-3.5 py-2" onClick={handleEditPage} disabled={isNotEditable}>
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
                        data={dummySalesTrend || data.getProduct.salesTrend}
                        loading={loading}
                    />

                    <StockMovementLedger
                        data={[
                            {
                                id: '1',
                                type: 'IN',
                                description: 'Received from supplier',
                                reference: 'PO-2026-0447',
                                date: '2026-06-28T00:00:00.000Z',
                                quantity: 50,
                            },
                            {
                                id: '2',
                                type: 'OUT',
                                description: 'Sale deduction',
                                reference: 'SALE-88213',
                                date: '2026-06-30T00:00:00.000Z',
                                quantity: -12,
                            },
                            {
                                id: '3',
                                type: 'OUT',
                                description: 'Sale deduction',
                                reference: 'SALE-88250',
                                date: '2026-07-01T00:00:00.000Z',
                                quantity: -8,
                            },
                            {
                                id: '4',
                                type: 'ADJUSTMENT',
                                description: 'Damaged units removed — stocktake',
                                reference: 'STOCKTAKE-Q2',
                                date: '2026-07-02T00:00:00.000Z',
                                quantity: -2,
                            },
                            {
                                id: '5',
                                type: 'OUT',
                                description: 'Sale deduction',
                                reference: 'SALE-88301',
                                date: '2026-07-03T00:00:00.000Z',
                                quantity: -12,
                            },
                        ]}
                        viewAllTo={`/products/${productId}/movements`}
                    />

                </div>

                <div className="flex flex-col gap-6">

                    <InventoryHealth
                        data={{
                            onHand: inventoryStatus.quantityOnHand,
                            reorderLevel: inventoryStatus.reorderLevel,
                            maxStock: inventoryStatus.maxStock,
                            lastRestockDate: inventoryStatus.lastRestockDate ?? new Date().toISOString(),
                            estimatedDaysOfStock: inventoryStatus.estimatedDaysOfStock,
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
                <MobileActionBar.Action type="button">
                    Adjust Stock
                </MobileActionBar.Action>
                <MobileActionBar.Primary type="button">
                    Edit Product
                </MobileActionBar.Primary>
            </MobileActionBar>
        </>
    );
}