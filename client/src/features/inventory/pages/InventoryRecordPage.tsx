import { Header } from "@/features/product/components";
import { Button, ButtonLoading } from "@/components/ui/button";
import { useForm, useWatch } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@apollo/client";
import { ProductSearchSection } from "../components/pages/inventory-record-page";
import { ProductPreview } from "@/components/ProductPreview";
import { useFetchedProductPreview } from "@/hooks/useProductPreview";
import { FormSection } from "@/components/ui/form-section";
import { QuantityInputFields } from "@/components";
import { Package, Plus } from "lucide-react";
import { InventoryHealth } from "@/components/InventoryHealth";
import { inventoryRecordSchema, type InventoryRecordFormValues, type InventoryRecordFormInput } from "../validation";
import { CREATE_INVENTORY } from "../operations/op.queries";
import Alert from "@/components/ui/alert";
import { useState } from "react";
import { MobileActionBar } from "@/components/ui/mobile-action-bar";

export function InventoryRecordPage() {
    const navigate = useNavigate();
    const [formError, setFormError] = useState<string | null>(null);

    const [createInventory, { loading: mutationLoading }] = useMutation(CREATE_INVENTORY, {
        refetchQueries: ["GetInventories", "GetInventoryStatuses"],
        awaitRefetchQueries: true,
        onCompleted: () => navigate(-1),
    });

    const { control, handleSubmit } = useForm<InventoryRecordFormInput, any, InventoryRecordFormValues>({
        resolver: zodResolver(inventoryRecordSchema),
        defaultValues: {
            productId: "",
            searchQuery: "",
            quantityOnHand: 0,
            reorderLevel: 0,
            maxStock: 0,
        },
    });

    const [productId, quantityOnHand, reorderLevel, maxStock] = useWatch({
        control,
        name: ["productId", "quantityOnHand", "reorderLevel", "maxStock"],
    });

    const {
        displayName,
        displaySku,
        displayStatus,
        displayPrice,
        displayQty: fetchedDisplayQty,
        displayReorder: fetchedDisplayReorder,
        barcodeValue,
        loading: productLoading,
    } = useFetchedProductPreview(productId);

    const rawQty = parseInt(String(quantityOnHand), 10);
    const displayQty = isNaN(rawQty) ? fetchedDisplayQty : `${rawQty} units`;

    const rawReorder = parseInt(String(reorderLevel), 10);
    const displayReorder = isNaN(rawReorder) ? fetchedDisplayReorder : `${rawReorder} units`;

    const onSubmit = async (data: InventoryRecordFormValues) => {
        setFormError(null);
        try {
            await createInventory({
                variables: {
                    input: {
                        productId: data.productId,
                        quantityOnHand: data.quantityOnHand,
                        reorderLevel: data.reorderLevel,
                        maxStock: data.maxStock,
                    },
                },
            });
        } catch (err: any) {
            const message = err?.graphQLErrors?.[0]?.message ?? "Failed to create inventory record. Please try again.";
            setFormError(message);
        }
    };

    return (
        <>
            <Header
                title="New inventory record"
                subtitle="Create a new inventory record."
                actions={
                    <>
                        <Button
                            type="button"
                            variant="glass"
                            size="lg"
                            onClick={() => navigate(-1)}
                        >
                            Cancel
                        </Button>
                        <ButtonLoading
                            type="submit"
                            form="inventory-form"
                            size="lg"
                            loading={mutationLoading}
                            disabled={!productId || mutationLoading}
                        >
                            <Plus />
                            Create record
                        </ButtonLoading>
                    </>
                }
            />

            <main className="w-full max-w-7xl mx-auto px-4 max-sm:pb-24 pb-6 mt-3 sm:px-6 lg:px-8">

                {formError && (
                    <Alert variant="error" className="mb-4">
                        {formError}
                    </Alert>
                )}

                <form
                    id="inventory-form"
                    onSubmit={handleSubmit(onSubmit)}
                    className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start"
                >

                    <div className="lg:col-span-2 space-y-6 order-2 lg:order-1">

                        <ProductSearchSection control={control} />

                        <FormSection
                            title="Stock Levels"
                            description="Set initial stock levels and reorder thresholds for this product."
                            icon={<Package className="w-4.5 h-4.5" strokeWidth={2} />}
                            iconWrapperClassName="bg-blue-50 text-blue-600"
                        >
                            <QuantityInputFields control={control} />
                        </FormSection>

                    </div>

                    <aside
                        className="lg:col-span-1 order-1 lg:order-2 lg:sticky lg:top-24 flex flex-col gap-5"
                    >
                        {productLoading ? (
                            <ProductPreview.Skeleton showTips={false} isSticky={false} />
                        ) : (
                            <ProductPreview
                                displayName={displayName}
                                displaySku={displaySku}
                                displayStatus={displayStatus}
                                displayPrice={displayPrice}
                                displayQty={displayQty}
                                displayReorder={displayReorder}
                                barcodeValue={barcodeValue}
                                showTips={false}
                                isSticky={false}
                            />
                        )}

                        <InventoryHealth
                            data={{
                                onHand: Number(quantityOnHand) || 0,
                                reorderLevel: Number(reorderLevel) || 0,
                                maxStock: Number(maxStock) || 0,
                            }}
                        />

                    </aside>

                </form>

            </main>

            <MobileActionBar>
                <MobileActionBar.Secondary type="button" onClick={() => navigate(-1)}>
                    Cancel
                </MobileActionBar.Secondary>
                <MobileActionBar.Primary type="submit" form="inventory-form" disabled={mutationLoading || !productId}>
                    {mutationLoading ? "Creating..." : "Create record"}
                </MobileActionBar.Primary>
            </MobileActionBar>

        </>
    );
}

