import { Header } from "@/features/product/components";
import { useForm, useWatch } from "react-hook-form";
import { ProductSearchSection } from "../components/pages/inventory-record-page";
import { ProductPreview } from "@/components/ProductPreview";
import { useFetchedProductPreview } from "@/hooks/useProductPreview";
import { FormSection } from "@/components/ui/form-section";
import { InventoryQuantityFields } from "@/components/InventoryQuantityFields";
import { Package } from "lucide-react";

import { InventoryHealth } from "@/components/InventoryHealth";

export function InventoryRecordPage() {
    const { control } = useForm({
        defaultValues: {
            productId: "",
            searchQuery: "",
            quantityOnHand: 0,
            reorderLevel: 0,
            maxStock: 0
        }
    });

    const [productId, quantityOnHand, reorderLevel, maxStock] = useWatch({
        control,
        name: ["productId", "quantityOnHand", "reorderLevel", "maxStock"]
    });
    const {
        displayName,
        displaySku,
        displayStatus,
        displayPrice,
        displayQty,
        displayReorder,
        barcodeValue,
        loading: productLoading
    } = useFetchedProductPreview(productId);

    return (
        <>
            <Header
                title="New inventory record"
                subtitle="Create a new inventory record."
            />

            <main className="w-full max-w-7xl mx-auto px-4 pb-32 mt-3 sm:px-6 lg:px-8 lg:pb-12">

                <form
                    id="inventory-form"
                    className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8"
                >

                    <div className="lg:col-span-2 space-y-6 order-2 lg:order-1">

                        <ProductSearchSection control={control} />

                        <FormSection
                            title="Stock Levels"
                            description="Set initial stock levels and reorder thresholds for this product."
                            icon={<Package className="w-4.5 h-4.5" strokeWidth={2} />}
                            iconWrapperClassName="bg-blue-50 text-blue-600"
                        >
                            <InventoryQuantityFields control={control} />
                        </FormSection>

                    </div>

                    <aside
                        className="lg:col-span-1 order-1 lg:order-2 lg:sticky lg:top-24 flex flex-col gap-5"
                    >
                        {productLoading ? (
                            <ProductPreview.Skeleton showTips={false} />
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
                            />
                        )}

                        <InventoryHealth
                            data={{
                                onHand: Number(quantityOnHand) || 0,
                                reorderLevel: Number(reorderLevel) || 0,
                                maxStock: Number(maxStock) || 0,
                                lastRestockDate: new Date().toISOString(),
                                estimatedDaysOfStock: 0,
                            }}
                        />
                    </aside>


                </form>

            </main>

        </>
    )
}
