import { useParams, useNavigate } from 'react-router-dom';
import { PATHS } from '@/routes';
import { useQuery } from '@apollo/client';
import { Header } from "@/components/Header";
import { Button } from '@/components/ui/button';
import { InventoryHealth } from '@/components/InventoryHealth';
import { GET_STOCK_MOVEMENT } from '../../operations';
import { StockMovementDetailsLayout } from './StockMovementDetailsLayout';
import {
    InventoryValueImpact,
    MovementSummary,
    PerformedBy,
    ProductDetails,
    RecordInfo
} from '../../components';
import { StockMovementPageSkeleton } from './StockMovementPageSkeleton';
import { useEffect, useCallback, useMemo } from 'react';
import { extractInventoryHealthData } from './utils';

/**
 * Page component that displays the detailed information of a specific stock movement.
 * It fetches the movement details using the ID from the URL parameters and renders
 * various sections including the movement summary, product details, inventory health,
 * and the user who performed the movement.
 *
 * @returns {JSX.Element} The rendered stock movement details page.
 */
export function StockMovementDetailsPage() {
    const { stockMovementId } = useParams<{ stockMovementId: string }>();
    const navigate = useNavigate();

    const { data, loading, error } = useQuery(GET_STOCK_MOVEMENT, {
        variables: { movementId: stockMovementId },
        skip: !stockMovementId,
    });

    useEffect(() => {
        if (error || (!loading && !data?.getStockMovement)) {
            navigate(-1);
        }
    }, [error, data, loading, navigate]);

    const movement = data?.getStockMovement;
    const inventoryStatus = movement?.inventory;

    const handleViewProduct = useCallback(() => {
        if (movement?.productId) {
            navigate(PATHS.products.view(movement.productId));
        }
    }, [navigate, movement?.productId]);

    const inventoryHealthData = useMemo(() => {
        return extractInventoryHealthData(inventoryStatus);
    }, [inventoryStatus]);

    if (loading) {
        return (<StockMovementPageSkeleton />)
    };

    if (error || !movement) {
        return null;
    }

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
                            onClick={handleViewProduct}
                        >
                            View Product
                        </Button>
                    </>
                }
            />

            <StockMovementDetailsLayout
                leftContent={
                    <>
                        <MovementSummary movement={movement} />
                        <InventoryValueImpact movement={movement} />
                        <ProductDetails movement={movement} />
                    </>
                }
                rightContent={
                    <>
                        <PerformedBy movement={movement} />
                        <InventoryHealth
                            data={inventoryHealthData}
                        />
                        <RecordInfo movement={movement} />
                    </>
                }
            />
        </>
    );
}