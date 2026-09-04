import { useState, useEffect } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@apollo/client';
import { toast } from 'sonner';

import { BaseSheetLayout } from '@/components/ui/base-sheet';
import { Button, ButtonLoading } from '@/components/ui/button';
import Alert from '@/components/ui/alert';
import { handleGraphQLError } from '@/lib/utils';

import { ADJUST_STOCK, GET_INVENTORY } from '../../operations';
import { adjustStockSchema } from '../../validation';
import { DEFAULT_ADJUST_STOCK_FORM_VALUES } from '../../constants';
import type { AdjustStockFormValues } from '../../types';
import { useAdjustStockSheet } from './hooks';
import {
    ProductSummaryCard,
    AdjustmentTypeSection,
    ReasonReferenceSection,
    NotesSection,
    StockImpactPreview,
    AiStockRecommendation,
} from './sections';

const MOVEMENT_TYPE_MAP: Record<AdjustStockFormValues['adjustmentType'], 'IN' | 'OUT' | 'ADJUSTMENT'> = {
    increase: 'IN',
    decrease: 'OUT',
    set: 'ADJUSTMENT',
};

export function AdjustStockSheet() {
    const { isOpen, inventoryId, onClose } = useAdjustStockSheet();
    const [formError, setFormError] = useState<string | null>(null);

    const { data, loading: fetchingInventory } = useQuery(GET_INVENTORY, {
        variables: { inventoryId },
        skip: !inventoryId || !isOpen,
        fetchPolicy: 'network-only',
    });

    const [adjustStock, { loading: adjusting }] = useMutation(ADJUST_STOCK, {
        refetchQueries: ['GetInventory', 'GetInventories', 'GetInventoryStatuses'],
        awaitRefetchQueries: true,
        onCompleted: () => {
            toast.success('Stock adjusted successfully');
            handleCancel();
        },
    });

    const {
        control,
        handleSubmit,
        setValue,
        reset,
        formState: { isDirty },
    } = useForm<AdjustStockFormValues>({
        resolver: zodResolver(adjustStockSchema),
        defaultValues: DEFAULT_ADJUST_STOCK_FORM_VALUES,
    });

    useEffect(() => {
        if (isOpen) {
            reset(DEFAULT_ADJUST_STOCK_FORM_VALUES);
        }
    }, [isOpen, reset]);

    const handleCancel = () => {
        reset(DEFAULT_ADJUST_STOCK_FORM_VALUES);
        setFormError(null);
        onClose();
    };

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
                            movementType: MOVEMENT_TYPE_MAP[formData.adjustmentType],
                            quantity: Number(formData.quantity) || 0,
                            reorderLevel,
                            maxStock,
                            reason: formData.reason,
                            reference: formData.reference || undefined,
                            notes: formData.notes || undefined,
                        },
                    },
                },
            });
        } catch (err: unknown) {
            console.error('Failed to adjust stock:', err);
            setFormError(handleGraphQLError(err));
        }
    };

    const inventory = data?.getInventory;
    const isBusy = fetchingInventory || adjusting;
    const isSubmitDisabled = isBusy || !inventory || !isDirty;

    return (
        <BaseSheetLayout
            isOpen={isOpen}
            onClose={handleCancel}
            title="Adjust Stock Level"
            description="Record a stock-in, stock-out, or cycle count inventory adjustment."
            icon={SlidersHorizontal}
            className="w-[95vw]! sm:max-w-2xl! md:max-w-4xl! lg:max-w-5xl! xl:max-w-6xl! flex flex-col gap-0 p-0"
            onOpenAutoFocus={(e) => e.preventDefault()}
            footer={
                <>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancel}
                        disabled={isBusy}
                        className="h-11 px-5 text-sm font-medium"
                    >
                        Cancel
                    </Button>
                    <ButtonLoading
                        type="submit"
                        form="adjust-stock-sheet-form"
                        loading={adjusting}
                        disabled={isSubmitDisabled}
                        className="h-11 flex-1 text-sm font-semibold"
                    >
                        Confirm Adjustment
                    </ButtonLoading>
                </>
            }
        >
            <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 bg-slate-50/50">
                <div className="max-w-5xl xl:max-w-6xl mx-auto space-y-6">
                    {formError && <Alert variant="error">{formError}</Alert>}

                    {fetchingInventory || !inventory ? (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                            <div className="lg:col-span-7 space-y-5">
                                <ProductSummaryCard.skeleton />
                            </div>
                            <div className="lg:col-span-5 space-y-5">
                                <StockImpactPreview.skeleton />
                            </div>
                        </div>
                    ) : (
                        <form
                            id="adjust-stock-sheet-form"
                            onSubmit={handleSubmit(onSubmit)}
                            className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
                        >
                            <div className="lg:col-span-7 space-y-5">
                                <ProductSummaryCard
                                    name={inventory.product.name}
                                    sku={inventory.product.sku}
                                    status={inventory.product.status}
                                    currentStock={inventory.quantityOnHand}
                                    reorderLevel={inventory.reorderLevel}
                                    maxStock={inventory.maxStock}
                                    imageUrl={inventory.product.imageUrl}
                                />
                                <AdjustmentTypeSection control={control} />
                                <ReasonReferenceSection control={control} />
                                <NotesSection control={control} />
                            </div>

                            <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-0">
                                <StockImpactPreview
                                    control={control}
                                    currentStock={inventory.quantityOnHand}
                                    reorderLevel={inventory.reorderLevel}
                                    maxStock={inventory.maxStock}
                                />
                                <AiStockRecommendation
                                    inventoryId={inventory.id}
                                    currentStock={inventory.quantityOnHand}
                                    reorderLevel={inventory.reorderLevel}
                                    maxStock={inventory.maxStock}
                                    estimatedDaysOfStock={inventory.estimatedDaysOfStock}
                                    productName={inventory.product.name}
                                    setValue={setValue}
                                />
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </BaseSheetLayout>
    );
}
