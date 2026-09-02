import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@apollo/client';
import { toast } from 'sonner';
import { AlertTriangle } from 'lucide-react';

import { Button, ButtonLoading } from '@/components/ui/button';
import Alert from '@/components/ui/alert';
import { EmptyState } from '@/components/ui/empty-state';
import { handleGraphQLError } from '@/lib/utils';

import { EDIT_PRODUCT, GET_PRODUCT, UPLOAD_PRODUCT_IMAGE } from '../../operations';
import { productSchema, type ProductFormValues } from '../../validation';
import type { IProduct } from '../../types';
import { ProductForm } from '../product-form';

interface EditProductDetailsProps {
    productId: string;
    onClose: () => void;
}

interface EditProductFormProps {
    productId: string;
    product: IProduct;
    onClose: () => void;
}

function EditProductForm({ productId, product, onClose }: EditProductFormProps) {
    const [error, setError] = useState<string | null>(null);
    const [stagedFile, setStagedFile] = useState<File | null>(null);
    const [isRemovedExisting, setIsRemovedExisting] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);

    const [uploadProductImage] = useMutation(UPLOAD_PRODUCT_IMAGE);

    const [editProduct, { loading: updatingProduct }] = useMutation(EDIT_PRODUCT, {
        refetchQueries: ['GetProducts', 'GetProduct', 'GetProductMetrics', 'GetTotalProductsCount'],
        awaitRefetchQueries: true,
    });

    const initialValues: ProductFormValues = useMemo(() => {
        return {
            name: product.name || '',
            sku: product.sku || '',
            productType: product.productType || 'SIMPLE',
            status: (product.status as 'DRAFT' | 'ACTIVE' | 'INACTIVE') || 'DRAFT',
            description: product.description || '',
            unitPrice: product.unitPrice,
            costPrice: product.costPrice || undefined,
            regularPrice: product.regularPrice || undefined,
            quantityOnHand: product.inventory?.quantityOnHand ?? 1,
            reorderLevel: product.inventory?.reorderLevel ?? 0,
            maxStock: product.inventory?.maxStock ?? 100,
            bundleItems: product.bundleItems
                ? product.bundleItems.map((b) => ({
                    productId: b.bundledProductId || b.product?.id,
                    quantity: b.quantity,
                }))
                : [],
            pricingTiers: product.pricingTiers
                ? product.pricingTiers.map((t) => ({
                    minQuantity: t.minQuantity,
                    maxQuantity: t.maxQuantity,
                    tierPrice: t.tierPrice,
                    freeProductId: t.freeProductId,
                    freeQuantity: t.freeQuantity,
                }))
                : [],
        };
    }, [product]);

    const {
        control,
        handleSubmit,
        setValue,
        formState: { isDirty },
    } = useForm<ProductFormValues>({
        resolver: zodResolver(productSchema),
        defaultValues: initialValues,
    });

    const onSubmit = async (formData: ProductFormValues) => {
        setError(null);

        let imageUrl: string | undefined | null = undefined;
        let imagePublicId: string | undefined | null = undefined;

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
        } else if (isRemovedExisting) {
            imageUrl = null;
            imagePublicId = null;
        }

        const input = {
            productId,
            product: {
                name: formData.name,
                sku: formData.sku ? formData.sku.trim() : undefined,
                productType: formData.productType || 'SIMPLE',
                status: formData.status,
                description: formData.description ? formData.description.trim() : undefined,
                ...(imageUrl !== undefined && { imageUrl }),
                ...(imagePublicId !== undefined && { imagePublicId }),
                unitPrice: formData.unitPrice,
                costPrice: formData.costPrice,
                regularPrice: formData.regularPrice,
            },
            inventory: {
                quantityOnHand: formData.quantityOnHand,
                reorderLevel: formData.reorderLevel,
                maxStock: formData.maxStock,
            },
            bundleItems: (formData.bundleItems || []).map((b) => ({
                productId: b.productId,
                quantity: b.quantity,
            })),
            pricingTiers: (formData.pricingTiers || []).map((t) => ({
                minQuantity: t.minQuantity,
                maxQuantity: t.maxQuantity || null,
                tierPrice: t.tierPrice,
                freeProductId: t.freeProductId || null,
                freeQuantity: t.freeQuantity || 0,
            })),
        };

        try {
            await editProduct({ variables: { input } });
            toast.success('Product updated successfully');
            onClose();
        } catch (err: unknown) {
            console.error('Failed to update product:', err);
            setError(handleGraphQLError(err));
        }
    };

    const isImageDirty = Boolean(stagedFile) || isRemovedExisting;
    const isBusy = updatingProduct || uploadingImage;
    const isSubmitDisabled = isBusy || (!isDirty && !isImageDirty);

    return (
        <div className="flex flex-col min-h-0 h-full">
            <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 bg-slate-50/50">
                <div className="max-w-3xl mx-auto space-y-6">
                    {error && <Alert variant="error">{error}</Alert>}

                    <ProductForm
                        id="edit-product-form"
                        control={control}
                        setValue={setValue}
                        onSubmit={handleSubmit(onSubmit)}
                        isEditMode={true}
                        showInventorySetup={false}
                        currentProductId={productId}
                        initialBundleItems={product.bundleItems}
                        initialPricingTiers={product.pricingTiers}
                        stagedFile={stagedFile}
                        onFileSelect={(file) => {
                            setStagedFile(file);
                            if (file) setIsRemovedExisting(false);
                        }}
                        existingImageUrl={product.imageUrl}
                        onRemoveExisting={() => {
                            setStagedFile(null);
                            setIsRemovedExisting(true);
                        }}
                        isRemovedExisting={isRemovedExisting}
                    />
                </div>
            </div>

            <div className="px-4 sm:px-6 py-4 border-t border-slate-200 bg-white flex items-center justify-end gap-3 sticky bottom-0 z-10 shrink-0">
                <Button
                    type="button"
                    variant="outline"
                    className="h-11 px-6 text-sm font-semibold"
                    onClick={onClose}
                    disabled={isBusy}
                >
                    Cancel
                </Button>
                <ButtonLoading
                    type="submit"
                    form="edit-product-form"
                    loading={isBusy}
                    disabled={isSubmitDisabled}
                    className="h-11 flex-1 text-sm font-semibold"
                >
                    {uploadingImage ? 'Uploading image...' : 'Update product'}
                </ButtonLoading>
            </div>
        </div>
    );
}

export function EditProductDetails({ productId, onClose }: EditProductDetailsProps) {
    const { data, loading, error } = useQuery(GET_PRODUCT, {
        variables: { productId },
        skip: !productId,
        fetchPolicy: 'cache-and-network',
    });

    if (loading) {
        return (
            <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 bg-slate-50/50">
                <div className="max-w-3xl mx-auto">
                    <ProductForm.Skeleton showInventorySetup={false} />
                </div>
            </div>
        );
    }

    if (error || !data?.getProduct) {
        return (
            <div className="py-6 h-full flex flex-col justify-center">
                <EmptyState
                    icon={AlertTriangle}
                    title="Product not found"
                    description={handleGraphQLError(error)}
                    iconClassName="text-red-500"
                    iconWrapperClassName="bg-red-50"
                />
            </div>
        );
    }

    const product: IProduct = data.getProduct;

    if (product.status === 'DISCONTINUED') {
        return (
            <div className="py-6 h-full flex flex-col justify-center">
                <EmptyState
                    icon={AlertTriangle}
                    title="Product Discontinued"
                    description="This product is discontinued and can no longer be edited."
                    iconClassName="text-amber-500"
                    iconWrapperClassName="bg-amber-50"
                />
            </div>
        );
    }

    return (
        <EditProductForm
            key={product.id}
            productId={productId}
            product={product}
            onClose={onClose}
        />
    );
}
