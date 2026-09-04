import { useState, useEffect } from 'react';
import { BellRing } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@apollo/client';
import { toast } from 'sonner';

import { BaseSheetLayout } from '@/components/ui/base-sheet';
import { Button, ButtonLoading } from '@/components/ui/button';
import Alert from '@/components/ui/alert';
import { handleGraphQLError } from '@/lib/utils';

import { ADJUST_STOCK, GET_INVENTORY } from '../../operations';
import { updateReorderLevelSchema } from '../../validation';
import { DEFAULT_REORDER_LEVEL_FORM_VALUES } from '../../constants';
import type { UpdateReorderLevelFormValues } from '../../types';
import { useReorderLevelSheet } from './hooks';
import { ProductSummaryCard } from '../adjust-stock-sheet/sections';
import { ReorderThresholdsSection } from './sections';

export function ReorderLevelSheet() {
    const { isOpen, inventoryId, onClose } = useReorderLevelSheet();
    const [formError, setFormError] = useState<string | null>(null);

    const { data, loading: fetchingInventory } = useQuery(GET_INVENTORY, {
        variables: { inventoryId },
        skip: !inventoryId || !isOpen,
        fetchPolicy: 'network-only',
    });

    const [adjustStock, { loading: updating }] = useMutation(ADJUST_STOCK, {
        refetchQueries: ['GetInventory', 'GetInventories', 'GetInventoryStatuses'],
        awaitRefetchQueries: true,
        onCompleted: () => {
            toast.success('Reorder level thresholds updated successfully');
            handleCancel();
        },
    });

    const {
        control,
        handleSubmit,
        reset,
        formState: { isDirty },
    } = useForm<UpdateReorderLevelFormValues>({
        resolver: zodResolver(updateReorderLevelSchema),
        defaultValues: DEFAULT_REORDER_LEVEL_FORM_VALUES,
    });

    useEffect(() => {
        if (isOpen && data?.getInventory) {
            reset({
                reorderLevel: data.getInventory.reorderLevel,
                maxStock: data.getInventory.maxStock,
                notes: '',
            });
        } else if (isOpen) {
            reset(DEFAULT_REORDER_LEVEL_FORM_VALUES);
        }
    }, [isOpen, data?.getInventory, reset]);

    const handleCancel = () => {
        reset(DEFAULT_REORDER_LEVEL_FORM_VALUES);
        setFormError(null);
        onClose();
    };

    const onSubmit = async (formData: UpdateReorderLevelFormValues) => {
        if (!inventoryId || !data?.getInventory) return;
        setFormError(null);

        const currentStock = data.getInventory.quantityOnHand;

        try {
            await adjustStock({
                variables: {
                    input: {
                        inventoryId,
                        movement: {
                            movementType: 'ADJUSTMENT',
                            quantity: currentStock,
                            reorderLevel: Number(formData.reorderLevel),
                            maxStock:
                                formData.maxStock !== undefined
                                    ? Number(formData.maxStock)
                                    : data.getInventory.maxStock,
                            reason: 'ADJUSTMENT',
                            notes: formData.notes || 'Updated inventory reorder level thresholds',
                        },
                    },
                },
            });
        } catch (err: unknown) {
            console.error('Failed to update reorder level:', err);
            setFormError(handleGraphQLError(err));
        }
    };

    const inventory = data?.getInventory;
    const isBusy = fetchingInventory || updating;
    const isSubmitDisabled = isBusy || !inventory || !isDirty;

    return (
        <BaseSheetLayout
            isOpen={isOpen}
            onClose={handleCancel}
            title="Configure Reorder Level"
            description="Update stock thresholds and low-stock alert triggers for this item."
            icon={BellRing}
            className="w-[95vw]! sm:max-w-xl! md:max-w-2xl! flex flex-col gap-0 p-0"
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
                        form="reorder-level-sheet-form"
                        loading={updating}
                        disabled={isSubmitDisabled}
                        className="h-11 flex-1 text-sm font-semibold"
                    >
                        Save Thresholds
                    </ButtonLoading>
                </>
            }
        >
            <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 bg-slate-50/50">
                <div className="max-w-2xl mx-auto space-y-6">
                    {formError && <Alert variant="error">{formError}</Alert>}

                    {fetchingInventory || !inventory ? (
                        <div className="space-y-6">
                            <ProductSummaryCard.skeleton />
                        </div>
                    ) : (
                        <form
                            id="reorder-level-sheet-form"
                            onSubmit={handleSubmit(onSubmit)}
                            className="space-y-6"
                        >
                            <ProductSummaryCard
                                name={inventory.product.name}
                                sku={inventory.product.sku}
                                status={inventory.product.status}
                                currentStock={inventory.quantityOnHand}
                                reorderLevel={inventory.reorderLevel}
                                maxStock={inventory.maxStock}
                                imageUrl={inventory.product.imageUrl}
                            />
                            <ReorderThresholdsSection control={control} />
                        </form>
                    )}
                </div>
            </div>
        </BaseSheetLayout>
    );
}
