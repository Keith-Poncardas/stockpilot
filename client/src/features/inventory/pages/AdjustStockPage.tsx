import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { PATHS } from "@/routes";
import { useMutation, useQuery } from "@apollo/client";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal, AlertTriangle } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import Alert from "@/components/ui/alert";
import { handleGraphQLError } from "@/lib/utils";
import { ADJUST_STOCK, GET_INVENTORY } from "../operations";
import { ProductSummaryCard, AdjustmentTypeSection, ReasonReferenceSection, NotesSection, StockImpactPreview, PerformedBySection } from "../components/pages/adjust-stock-page";
import type { AdjustStockFormValues } from "../components/pages/adjust-stock-page";
import { AdjustStockPageSkeleton } from "../components";
import { MobileActionBar } from "@/components/ui/mobile-action-bar";

/** Maps the UI adjustment-type cards to the API MovementType enum */
const MOVEMENT_TYPE: Record<AdjustStockFormValues["adjustmentType"], "IN" | "OUT" | "ADJUSTMENT"> = {
    increase: "IN",
    decrease: "OUT",
    set: "ADJUSTMENT",
};

export function AdjustStockPage() {
    const { inventoryId } = useParams<{ inventoryId: string }>();
    const navigate = useNavigate();

    const [formError, setFormError] = useState<string | null>(null);

    const { control, handleSubmit } = useForm<AdjustStockFormValues>({
        defaultValues: {
            adjustmentType: "increase",
            quantity: 1,
        },
    });

    const { data, loading, error } = useQuery(GET_INVENTORY, {
        variables: { inventoryId },
        skip: !inventoryId,
    });

    const [adjustStock, { loading: mutationLoading }] = useMutation(ADJUST_STOCK, {
        refetchQueries: ["GetInventory", "GetInventories", "GetInventoryStatuses"],
        awaitRefetchQueries: true,
        onCompleted: () => navigate(PATHS.inventory.root),
    });

    const onSubmit = async (formData: AdjustStockFormValues) => {
        if (!inventoryId || !data?.getInventory) return;
        setFormError(null);

        const { reorderLevel, maxStock } = data.getInventory;

        try {
            await adjustStock({
                variables: {
                    input: {
                        inventoryId,
                        movement: {
                            movementType: MOVEMENT_TYPE[formData.adjustmentType],
                            quantity: Number(formData.quantity) || 0,
                            reorderLevel,
                            maxStock,
                            reason: formData.reason,
                            notes: formData.notes || undefined,
                        },
                    },
                },
            });
        } catch (err: unknown) {
            const message = handleGraphQLError(err);
            setFormError(message);
        }
    };

    function handleCancel() {
        navigate(PATHS.inventory.root);
    }

    if (loading) {
        return <AdjustStockPageSkeleton onCancel={handleCancel} control={control} />;
    }

    if (error || !data?.getInventory) {
        return (
            <EmptyState
                icon={AlertTriangle}
                title="Inventory not found"
                description={handleGraphQLError(error?.graphQLErrors[0]?.message ?? error?.networkError?.message)}
                showBackButton
            />
        );
    }

    const inventory = data.getInventory;
    const { product, author } = inventory;

    const authorName = `${author.firstName} ${author.lastName}`;
    const performedAt = new Date(Number(inventory.createdAt));

    return (
        <>
            <Header
                title="Adjust Stock"
                subtitle="Adjust the stock levels for the selected products"
                actions={
                    <div className="flex items-center space-x-3">
                        <Button type="button" variant="glass" onClick={handleCancel} size="lg" disabled={mutationLoading}>
                            Cancel
                        </Button>
                        <Button type="submit" form="adjust-form" size="lg" disabled={mutationLoading}>
                            <SlidersHorizontal />
                            {mutationLoading ? "Saving…" : "Adjust"}
                        </Button>
                    </div>
                }
            />

            <div className="w-full max-w-7xl mx-auto px-4 max-sm:pb-24 pb-6 mt-3 sm:px-6 lg:px-8">

                {formError && (
                    <Alert variant="error" className="mb-5" aria-live="polite">
                        {formError}
                    </Alert>
                )}

                <form
                    id="adjust-form"
                    onSubmit={handleSubmit(onSubmit)}
                    className="grid grid-cols-1 gap-6 lg:grid-cols-3 items-start"
                >

                    <div className="min-w-0 space-y-5 lg:col-span-2">

                        {/* Product summary — data from API */}
                        <ProductSummaryCard
                            name={product.name}
                            sku={product.sku}
                            status={product.status}
                            currentStock={inventory.quantityOnHand}
                            reorderLevel={inventory.reorderLevel}
                            maxStock={inventory.maxStock}
                        />

                        {/* Adjustment type + quantity — fully controlled & form-integrated */}
                        <AdjustmentTypeSection control={control} />

                        <ReasonReferenceSection control={control} />

                        <NotesSection control={control} />

                    </div>

                    <div className="min-w-0 space-y-6 lg:col-span-1">

                        <StockImpactPreview
                            control={control}
                            currentStock={inventory.quantityOnHand}
                            reorderLevel={inventory.reorderLevel}
                            maxStock={inventory.maxStock}
                        />

                        <PerformedBySection
                            name={authorName}
                            avatarRole={author.role}
                            fallback={author}
                            performedAt={performedAt}
                        />

                    </div>
                </form>


            </div>

            <MobileActionBar>
                <MobileActionBar.Secondary type="button" onClick={() => navigate(PATHS.inventory.root)}>
                    Cancel
                </MobileActionBar.Secondary>
                <MobileActionBar.Primary type="submit" form="adjust-form" disabled={mutationLoading}>
                    {mutationLoading ? "Adjusting..." : "Adjust"}
                </MobileActionBar.Primary>
            </MobileActionBar>
        </>
    );
}
