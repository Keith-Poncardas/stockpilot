import { Header } from "../Header";
import { BasicDetails, InventorySetup, Pricing } from "../pages";
import { ProductPreview } from "@/components/ProductPreview";

export function EditProductPageSkeleton() {
    return (
        <>

            <Header.Skeleton />

            <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">

                <div
                    className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start max-sm:mb-15"
                >

                    <div className="lg:col-span-2 flex flex-col gap-6">

                        <BasicDetails.Skeleton />
                        <Pricing.Skeleton />
                        <InventorySetup.Skeleton />

                    </div>

                    <ProductPreview.Skeleton />

                </div>

            </main>

        </>
    )
}