import { Header } from "@/features/product/components";
import { useForm } from "react-hook-form";
import { ProductSearchSection } from "../components/pages/inventory-record-page";

export function InventoryRecordPage() {
    const { control } = useForm({
        defaultValues: {
            productId: ""
        }
    });

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

                    </div>


                </form>

            </main>

        </>
    )
}
