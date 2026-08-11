import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { AlertTriangle } from 'lucide-react';
import { Header } from '@/features/product/components';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { handleGraphQLError } from '@/lib/utils';
import { InventoryValueImpact, MovementSummary, ProductDetails, PerformedBy, RecordInfo, StockMovementPageSkeleton } from '../components';
import { GET_STOCK_MOVEMENT } from '../operations';
import { InventoryHealth } from '@/components/InventoryHealth';

export function StockMovementDetailsPage() {
    const { stockMovementId } = useParams<{ stockMovementId: string }>();
    const navigate = useNavigate();

    const { data, loading, error } = useQuery(GET_STOCK_MOVEMENT, {
        variables: { movementId: stockMovementId },
        skip: !stockMovementId,
    });

    if (loading) {
        return (<StockMovementPageSkeleton />)
    }

    if (error || !data?.getStockMovement) {
        return (
            <EmptyState
                icon={AlertTriangle}
                title="Stock movement not found"
                description={handleGraphQLError(
                    error?.graphQLErrors[0]?.message ?? error?.networkError?.message
                )}
                showBackButton
            />
        );
    }

    const movement = data.getStockMovement;
    const inventoryStatus = movement.inventory;

    return (
        <>
            <Header
                title="Stock Movement"
                subtitle="Stock movement details"
                actions={
                    <>
                        <Button variant="glass" className="px-3.5 py-2 font-semibold" disabled>
                            Print
                        </Button>
                        <Button
                            className="px-3.5 py-2"
                            onClick={() => navigate(`/products/${movement.productId}`)}
                        >
                            View Product
                        </Button>
                    </>
                }
            />

            <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6 max-sm:mb-15">

                <div className="lg:col-span-2 flex flex-col gap-6">

                    <MovementSummary movement={movement} />

                    <InventoryValueImpact movement={movement} />

                    <ProductDetails movement={movement} />

                </div>

                <div className="flex flex-col gap-6">

                    <PerformedBy movement={movement} isLoading={loading} />

                    <InventoryHealth
                        data={{
                            onHand: inventoryStatus?.quantityOnHand ?? 0,
                            reorderLevel: inventoryStatus?.reorderLevel ?? 0,
                            maxStock: inventoryStatus?.maxStock ?? 0,
                            lastRestockDate: inventoryStatus?.lastRestockDate || undefined,
                            estimatedDaysOfStock: inventoryStatus?.estimatedDaysOfStock ?? 0,
                        }}
                    />

                    <RecordInfo movement={movement} />

                </div>

            </main>
        </>
    );
}