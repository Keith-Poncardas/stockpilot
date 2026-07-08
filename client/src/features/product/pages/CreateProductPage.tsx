import { BasicDetails, Pricing, InventorySetup, Preview, Header } from "../components";
import { Button } from "@/components/ui/button";
import { MobileActionBar } from "@/components/ui/mobile-action-bar";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";

const productSchema = z.object({
    name: z.string().min(2, "Product name must be at least 2 characters").max(100, "Product name is too long"),
    sku: z.string().min(3, "SKU must be at least 3 characters").max(50, "SKU is too long"),
    status: z.enum(["DRAFT", "ACTIVE", "INACTIVE", "DISCONTINUED", "ARCHIVED"], {
        message: "Please select a status",
    }),
    description: z.string().max(500, "Description is too long").optional(),
    unitPrice: z.coerce.number({ message: "Selling price is required" }).min(0, "Price cannot be negative"),
    costPrice: z.coerce.number({ message: "Must be a valid number" }).min(0, "Cost cannot be negative").optional(),
    quantityOnHand: z.coerce.number({ message: "Starting quantity is required" }).min(0, "Quantity cannot be negative").int("Quantity must be a whole number"),
    reorderLevel: z.coerce.number({ message: "Reorder level is required" }).min(0, "Reorder level cannot be negative").int("Reorder level must be a whole number"),
});

type ProductFormValues = z.input<typeof productSchema>;

export function CreateProductPage() {
    const navigate = useNavigate();

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
        }
    });

    const onSubmit = (data: ProductFormValues) => {
        console.log("Form Submitted:", data);
    };

    function handleCancel() {
        navigate(-1);
    }

    return (
        <>
            <Header
                title="Create New Product"
                subtitle="Fill in the product details below."
                actions={
                    <>
                        <Button
                            type="button"
                            variant="glass"
                            size="lg"
                            onClick={handleCancel}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            form="product-form"
                            size="lg">
                            Save product
                        </Button>
                    </>
                }
            />

            <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">

                <form
                    id="product-form"
                    onSubmit={handleSubmit(onSubmit)}
                    className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start max-sm:mb-15"
                >

                    <div className="lg:col-span-2 flex flex-col gap-6">

                        <BasicDetails control={control as any} />
                        <Pricing control={control as any} />
                        <InventorySetup control={control as any} />

                    </div>

                    <Preview control={control as any} />

                </form>

            </main>

            <MobileActionBar>
                <MobileActionBar.Secondary type="button" onClick={handleCancel}>
                    Cancel
                </MobileActionBar.Secondary>
                <MobileActionBar.Primary type="submit" form="product-form">
                    Save product
                </MobileActionBar.Primary>
            </MobileActionBar>
        </>
    );
}
