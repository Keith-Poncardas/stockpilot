import { EditProductPageSkeleton, ProductFormLayout } from "../components";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import { PATHS } from "@/routes";
import { useMutation, useQuery } from "@apollo/client";
import { GET_PRODUCT, EDIT_PRODUCT } from "../operations/op.queries";
import { useState } from "react";
import { EmptyState } from "@/components/ui/empty-state";
import { AlertTriangle } from "lucide-react";
import { handleGraphQLError } from "@/lib/utils";
import { productSchema, type ProductFormValues } from "../validation";
import { ProductStatus } from "../product.constants";

export function EditProductPage() {
    const navigate = useNavigate();
    const { productId } = useParams<{ productId: string }>();

    const { data, loading: queryLoading, error } = useQuery(GET_PRODUCT, {
        variables: { productId },
        skip: !productId,
    });

    const [editProduct, { loading: mutationLoading }] = useMutation(EDIT_PRODUCT, {
        refetchQueries: ["GetProducts", "GetProduct", "GetProductForEdit", "GetProductMetrics", "GetTotalProductsCount"],
        awaitRefetchQueries: true,
        onCompleted: () => navigate(PATHS.products.root)
    });

    const [formError, setFormError] = useState<string | null>(null);

    const productInfo = data?.getProduct?.productInfo;
    const inventoryStatus = data?.getProduct?.inventoryStatus;

    const { control, handleSubmit } = useForm<ProductFormValues>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            name: "",
            sku: "",
            status: "DRAFT",
            description: "",
            unitPrice: undefined,
            costPrice: undefined,
            quantityOnHand: 0,
            reorderLevel: 10,
            maxStock: 100,
        },
        values: productInfo ? {
            name: productInfo.name,
            sku: productInfo.sku || "",
            status: productInfo.status,
            description: productInfo.description || "",
            unitPrice: productInfo.unitPrice,
            costPrice: productInfo.costPrice || undefined,
            quantityOnHand: inventoryStatus?.quantityOnHand ?? 0,
            reorderLevel: inventoryStatus?.reorderLevel ?? 10,
            maxStock: inventoryStatus?.maxStock ?? 100,
        } : undefined,
    });

    const onSubmit = async (formData: ProductFormValues) => {
        if (!productId) return;
        setFormError(null);

        const input = {
            productId,
            name: formData.name,
            description: formData.description,
            sku: formData.sku,
            unitPrice: formData.unitPrice,
            costPrice: formData.costPrice,
            status: formData.status,
            addToInventory: {
                quantity: formData.quantityOnHand,
                reorderLevel: formData.reorderLevel,
                maxStock: formData.maxStock,
            }
        };
        try {
            await editProduct({ variables: { input } });
        } catch (error) {
            console.error("Failed to edit product:", error);
            setFormError("Failed to edit product. Please try again.");
        }
    };

    function handleCancel() {
        navigate(PATHS.products.root);
    }

    if (queryLoading) return (
        <EditProductPageSkeleton />
    )

    if (error || !data?.getProduct) {
        return (
            <EmptyState
                icon={AlertTriangle}
                title="Product not found"
                description={handleGraphQLError(error)}
                showBackButton
            />
        );
    }

    const isNotEditable = data.getProduct.productInfo?.status === ProductStatus.DISCONTINUED.a;

    if (isNotEditable) {
        return (
            <EmptyState
                icon={AlertTriangle}
                title="Product Discontinued"
                description="This product is discontinued and can no longer be edited."
                showBackButton
            />
        );
    }

    return (
        <ProductFormLayout
            title="Edit Product"
            subtitle="Update product details below."
            loading={mutationLoading}
            error={formError}
            onCancel={handleCancel}
            onSubmit={onSubmit}
            handleSubmit={handleSubmit}
            control={control}
            submitText="Update product"
            loadingText="Saving..."
            isEditMode={true}
        />
    )
}