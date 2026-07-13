import { ProductFormLayout } from "../components";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { CREATE_PRODUCT } from "../operations";
import { productSchema, type ProductFormValues } from "../validation";
import { useState } from "react";

export function CreateProductPage() {
    const navigate = useNavigate();
    const [createProduct, { loading }] = useMutation(CREATE_PRODUCT, {
        refetchQueries: ["GetProducts"],
        awaitRefetchQueries: true,
        onCompleted: () => navigate(-1)
    });

    const [error, setError] = useState<string | null>(null);

    const { control, handleSubmit } = useForm<ProductFormValues>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            name: "",
            sku: "",
            status: "DRAFT",
            description: "",
            unitPrice: undefined,
            costPrice: undefined,
            quantityOnHand: "" as unknown as number,
            reorderLevel: "" as unknown as number,
            maxStock: "" as unknown as number,
        }
    });

    const onSubmit = async (data: ProductFormValues) => {
        setError(null);
        const { name, description, sku, unitPrice, costPrice, status, quantityOnHand, reorderLevel, maxStock } = data;

        const input = {
            name,
            description,
            sku,
            unitPrice,
            costPrice,
            status,
            ...(status === "ACTIVE" && quantityOnHand !== undefined ? {
                addToInventory: {
                    quantity: quantityOnHand,
                    reorderLevel: reorderLevel!,
                    maxStock: maxStock!,
                }
            } : {}),
        };
        try {
            await createProduct({ variables: { input } });
        } catch (err) {
            console.error("Failed to create product:", err);
            setError("Failed to create product. Please try again.");
        }
    };

    function handleCancel() {
        navigate(-1);
    }

    return (
        <ProductFormLayout
            title="Create New Product"
            subtitle="Fill in the product details below."
            loading={loading}
            error={error}
            onCancel={handleCancel}
            onSubmit={onSubmit}
            handleSubmit={handleSubmit}
            control={control}
            submitText="Save product"
            loadingText="Saving..."
        />
    );
}
