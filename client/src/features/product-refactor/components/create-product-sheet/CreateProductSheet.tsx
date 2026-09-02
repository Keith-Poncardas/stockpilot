import { useState } from 'react';
import { PackagePlus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@apollo/client';
import { toast } from 'sonner';

import { BaseSheetLayout } from '@/components/ui/base-sheet';
import { Button, ButtonLoading } from '@/components/ui/button';
import Alert from '@/components/ui/alert';
import { handleGraphQLError } from '@/lib/utils';

import { CREATE_PRODUCT, UPLOAD_PRODUCT_IMAGE } from '../../operations';
import { productSchema, type ProductFormValues } from '../../validation';
import { DEFAULT_PRODUCT_FORM_VALUES } from '../../constants';
import { useCreateProductSheet } from './hooks';
import { ProductForm } from '../product-form';

export function CreateProductSheet() {
    const { isOpen, onClose } = useCreateProductSheet();
    const [error, setError] = useState<string | null>(null);
    const [stagedFile, setStagedFile] = useState<File | null>(null);
    const [uploadingImage, setUploadingImage] = useState(false);

    const [uploadProductImage] = useMutation(UPLOAD_PRODUCT_IMAGE);

    const [createProduct, { loading: creatingProduct }] = useMutation(CREATE_PRODUCT, {
        refetchQueries: ['GetProducts', 'GetProductMetrics', 'GetTotalProductsCount'],
        awaitRefetchQueries: true,
        onCompleted: () => {
            toast.success('Product created successfully');
            handleCancel();
        },
    });

    const {
        control,
        handleSubmit,
        setValue,
        reset,
        formState: { isDirty },
    } = useForm<ProductFormValues>({
        resolver: zodResolver(productSchema),
        defaultValues: DEFAULT_PRODUCT_FORM_VALUES,
    });

    const handleCancel = () => {
        reset(DEFAULT_PRODUCT_FORM_VALUES);
        setStagedFile(null);
        setError(null);
        onClose();
    };

    const onSubmit = async (data: ProductFormValues) => {
        setError(null);

        let imageUrl: string | undefined = undefined;
        let imagePublicId: string | undefined = undefined;

        if (stagedFile) {
            try {
                setUploadingImage(true);
                const uploadRes = await uploadProductImage({
                    variables: { file: stagedFile },
                });
                if (uploadRes.data?.uploadProductImage) {
                    imageUrl = uploadRes.data.uploadProductImage.secureUrl;
                    imagePublicId = uploadRes.data.uploadProductImage.publicId;
                }
            } catch (uploadErr) {
                console.error('Failed to upload product image to Cloudinary:', uploadErr);
                setError(handleGraphQLError(uploadErr));
                setUploadingImage(false);
                return;
            } finally {
                setUploadingImage(false);
            }
        }

        const input = {
            product: {
                name: data.name,
                sku: data.sku ? data.sku.trim() : undefined,
                productType: data.productType || 'SIMPLE',
                status: data.status,
                description: data.description ? data.description.trim() : undefined,
                imageUrl,
                imagePublicId,
                unitPrice: data.unitPrice,
                costPrice: data.costPrice,
                regularPrice: data.regularPrice,
            },
            inventory: data.trackInventory
                ? {
                    quantityOnHand: Number(data.quantityOnHand) || 0,
                    reorderLevel: data.reorderLevel !== undefined && data.reorderLevel !== null ? Number(data.reorderLevel) : 10,
                    maxStock: data.maxStock !== undefined && data.maxStock !== null ? Number(data.maxStock) : 100,
                }
                : undefined,
            bundleItems:
                data.bundleItems && data.bundleItems.length > 0
                    ? data.bundleItems.map((b) => ({
                        productId: b.productId,
                        quantity: b.quantity,
                    }))
                    : undefined,
            pricingTiers:
                data.pricingTiers && data.pricingTiers.length > 0
                    ? data.pricingTiers.map((t) => ({
                        minQuantity: t.minQuantity,
                        maxQuantity: t.maxQuantity || null,
                        tierPrice: t.tierPrice,
                        freeProductId: t.freeProductId || null,
                        freeQuantity: t.freeQuantity || 0,
                    }))
                    : undefined,
        };

        try {
            await createProduct({ variables: { input } });
        } catch (err: unknown) {
            console.error('Failed to create product:', err);
            setError(handleGraphQLError(err));
        }
    };

    const isBusy = creatingProduct || uploadingImage;
    const isSubmitDisabled = isBusy || (!isDirty && !stagedFile);

    return (
        <BaseSheetLayout
            isOpen={isOpen}
            onClose={handleCancel}
            title="Create New Product"
            description="Add a new product to your inventory catalog."
            icon={PackagePlus}
            className="w-[95vw]! sm:max-w-xl! md:max-w-2xl! lg:max-w-3xl! flex flex-col gap-0 p-0"
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
                        form="create-product-form"
                        loading={isBusy}
                        disabled={isSubmitDisabled}
                        className="h-11 flex-1 text-sm font-semibold"
                    >
                        {uploadingImage ? 'Uploading image...' : 'Save product'}
                    </ButtonLoading>
                </>
            }
        >
            <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 bg-slate-50/50">
                <div className="max-w-3xl mx-auto space-y-6">
                    {error && <Alert variant="error">{error}</Alert>}

                    <ProductForm
                        id="create-product-form"
                        control={control}
                        setValue={setValue}
                        onSubmit={handleSubmit(onSubmit)}
                        isEditMode={false}
                        showInventorySetup={true}
                        stagedFile={stagedFile}
                        onFileSelect={setStagedFile}
                    />
                </div>
            </div>
        </BaseSheetLayout>
    );
}
