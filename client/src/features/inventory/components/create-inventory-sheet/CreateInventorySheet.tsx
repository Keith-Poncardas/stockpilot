import { useState } from 'react';
import { PackagePlus } from 'lucide-react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@apollo/client';
import { toast } from 'sonner';

import { BaseSheetLayout } from '@/components/ui/base-sheet';
import { Button, ButtonLoading } from '@/components/ui/button';
import Alert from '@/components/ui/alert';
import { handleGraphQLError } from '@/lib/utils';

import { CREATE_INVENTORY } from '../../operations';
import { inventoryRecordSchema } from '../../validation';
import { DEFAULT_INVENTORY_RECORD_FORM_VALUES } from '../../constants';
import type { InventoryRecordFormValues } from '../../types';
import { useCreateInventorySheet } from './hooks';
import { ProductSearchSection, StockLevelsSection } from './sections';

export function CreateInventorySheet() {
    const { isOpen, onClose } = useCreateInventorySheet();
    const [error, setError] = useState<string | null>(null);

    const [createInventory, { loading }] = useMutation(CREATE_INVENTORY, {
        refetchQueries: ['GetInventories', 'GetInventoryStatuses'],
        awaitRefetchQueries: true,
        onCompleted: () => {
            toast.success('Inventory record created successfully');
            handleCancel();
        },
    });

    const {
        control,
        handleSubmit,
        reset,
        formState: { isDirty },
    } = useForm<InventoryRecordFormValues>({
        resolver: zodResolver(inventoryRecordSchema),
        defaultValues: DEFAULT_INVENTORY_RECORD_FORM_VALUES,
    });

    const productId = useWatch({
        control,
        name: 'productId',
    });

    const handleCancel = () => {
        reset(DEFAULT_INVENTORY_RECORD_FORM_VALUES);
        setError(null);
        onClose();
    };

    const onSubmit = async (data: InventoryRecordFormValues) => {
        setError(null);
        try {
            await createInventory({
                variables: {
                    input: {
                        productId: data.productId,
                        inventory: {
                            quantityOnHand: Number(data.quantityOnHand) || 0,
                            reorderLevel: Number(data.reorderLevel) || 0,
                            maxStock: Number(data.maxStock) || 0,
                        },
                    },
                },
            });
        } catch (err: unknown) {
            console.error('Failed to create inventory record:', err);
            setError(handleGraphQLError(err));
        }
    };

    const isSubmitDisabled = loading || !productId || !isDirty;

    return (
        <BaseSheetLayout
            isOpen={isOpen}
            onClose={handleCancel}
            title="Record New Inventory"
            description="Initialize stock levels and reorder parameters for a product."
            icon={PackagePlus}
            className="w-[95vw]! sm:max-w-xl! md:max-w-2xl! flex flex-col gap-0 p-0"
            onOpenAutoFocus={(e) => e.preventDefault()}
            footer={
                <>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancel}
                        disabled={loading}
                        className="h-11 px-5 text-sm font-medium"
                    >
                        Cancel
                    </Button>
                    <ButtonLoading
                        type="submit"
                        form="create-inventory-sheet-form"
                        loading={loading}
                        disabled={isSubmitDisabled}
                        className="h-11 flex-1 text-sm font-semibold"
                    >
                        Create Record
                    </ButtonLoading>
                </>
            }
        >
            <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 bg-slate-50/50">
                <div className="max-w-2xl mx-auto space-y-6">
                    {error && <Alert variant="error">{error}</Alert>}

                    <form
                        id="create-inventory-sheet-form"
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        <ProductSearchSection control={control} />
                        <StockLevelsSection control={control} />
                    </form>
                </div>
            </div>
        </BaseSheetLayout>
    );
}
