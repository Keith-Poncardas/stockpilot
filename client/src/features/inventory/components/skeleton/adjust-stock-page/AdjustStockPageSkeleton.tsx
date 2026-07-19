import { Header } from "@/features/product/components";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";
import type { Control } from "react-hook-form";

import {
    ProductSummaryCard,
    AdjustmentTypeSection,
    ReasonReferenceSection,
    NotesSection,
    StockImpactPreview,
    PerformedBySection,
    type AdjustStockFormValues
} from "../../pages/adjust-stock-page";

interface AdjustStockPageSkeletonProps {
    onCancel: () => void;
    control: Control<AdjustStockFormValues>;
}

export function AdjustStockPageSkeleton({ onCancel, control }: AdjustStockPageSkeletonProps) {
    return (
        <>
            <Header
                title="Adjust Stock"
                subtitle="Adjust the stock levels for the selected products"
                actions={
                    <div className="flex items-center space-x-3">
                        <Button type="button" variant="glass" onClick={onCancel} size="lg" disabled>
                            Cancel
                        </Button>
                        <Button type="button" size="lg" disabled>
                            <SlidersHorizontal className="mr-2 h-5 w-5" />
                            Adjust
                        </Button>
                    </div>
                }
            />

            <main className="w-full max-w-7xl mx-auto px-4 pb-32 mt-3 sm:px-6 lg:px-8 lg:pb-12">
                <form className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <div className="space-y-5 lg:col-span-2">
                        <ProductSummaryCard.skeleton />
                        <AdjustmentTypeSection control={control} />
                        <ReasonReferenceSection control={control} />
                        <NotesSection control={control} />
                    </div>

                    <div className="space-y-6 lg:sticky lg:top-20 lg:col-span-1 lg:self-start">
                        <StockImpactPreview.skeleton />
                        <PerformedBySection.skeleton />
                    </div>
                </form>
            </main>
        </>
    );
}
