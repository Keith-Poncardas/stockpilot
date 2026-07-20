import { useFormState, useWatch, type UseFormHandleSubmit, type Control } from "react-hook-form";
import { Button, ButtonLoading } from "@/components/ui/button";
import { MobileActionBar } from "@/components/ui/mobile-action-bar";
import { Header } from "../../Header";
import { BasicDetails, Pricing, InventorySetup } from "../create-product-page";
import Alert from "@/components/ui/alert";
import { ProductPreview } from "@/components/ProductPreview";

export interface ProductFormLayoutProps {
    title: string;
    subtitle: string;
    loading: boolean;
    error?: string | null;
    onCancel: () => void;
    onSubmit: (data: any) => void;
    handleSubmit: UseFormHandleSubmit<any>;
    control: Control<any>;
    submitText?: string;
    loadingText?: string;
    isEditMode?: boolean;
}

export function ProductFormLayout({
    title,
    subtitle,
    loading,
    error,
    onCancel,
    onSubmit,
    handleSubmit,
    control,
    submitText = "Save product",
    loadingText = "Saving...",
    isEditMode = false
}: ProductFormLayoutProps) {
    const { isDirty } = useFormState({ control });
    const isSubmitDisabled = loading || (isEditMode && !isDirty);

    const watched = useWatch({ control });
    const displayName = watched.name || 'New Product';
    const displaySku = watched.sku || 'SKU-***';
    const displayStatus = watched.status || 'DRAFT';
    const displayPrice = watched.unitPrice ? watched.unitPrice.toString() : '0.00';
    const displayQty = watched.quantityOnHand !== undefined && watched.quantityOnHand !== "" ? watched.quantityOnHand.toString() : '-';
    const displayReorder = watched.reorderLevel !== undefined && watched.reorderLevel !== "" ? watched.reorderLevel.toString() : '-';
    const barcodeValue = watched.sku || '123456789';

    return (
        <>
            <Header
                title={title}
                subtitle={subtitle}
                actions={
                    <>
                        <Button
                            type="button"
                            variant="glass"
                            size="lg"
                            onClick={onCancel}
                        >
                            Cancel
                        </Button>
                        <ButtonLoading
                            type="submit"
                            form="product-form"
                            size="lg"
                            loading={loading}
                            disabled={isSubmitDisabled}
                        >
                            {submitText}
                        </ButtonLoading>
                    </>
                }
            />

            <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                {error && (
                    <Alert variant="error">
                        {error}
                    </Alert>
                )}

                <form
                    id="product-form"
                    onSubmit={handleSubmit(onSubmit)}
                    className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start max-sm:mb-15"
                >

                    <div className="lg:col-span-2 flex flex-col gap-6">

                        <BasicDetails control={control as any} isEditMode={isEditMode} />
                        <Pricing control={control as any} />
                        <InventorySetup control={control as any} />

                    </div>

                    <ProductPreview
                        displayName={displayName}
                        displaySku={displaySku}
                        displayStatus={displayStatus}
                        displayPrice={displayPrice}
                        displayQty={displayQty}
                        displayReorder={displayReorder}
                        barcodeValue={barcodeValue}
                    />

                </form>

            </main>

            <MobileActionBar>
                <MobileActionBar.Secondary type="button" onClick={onCancel}>
                    Cancel
                </MobileActionBar.Secondary>
                <MobileActionBar.Primary type="submit" form="product-form" disabled={isSubmitDisabled}>
                    {loading ? loadingText : submitText}
                </MobileActionBar.Primary>
            </MobileActionBar>
        </>
    );
}