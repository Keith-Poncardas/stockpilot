import { BaseSheetLayout } from "@/components/ui/base-sheet";
import { ArrowLeftRight } from "lucide-react";
import { useViewStockMovementSheet } from "./hooks";
import { ViewStockMovementDetails } from "./ViewStockMovementDetails";

export function ViewStockMovementSheet() {
    const { isOpen, onClose, stockMovementId } = useViewStockMovementSheet();

    return (
        <BaseSheetLayout
            isOpen={isOpen}
            onClose={onClose}
            title="Stock Movement Details"
            description="Comprehensive overview of the stock movement, including product, user, and inventory health."
            icon={ArrowLeftRight}
            className="w-[95vw]! sm:max-w-2xl! md:max-w-4xl! lg:max-w-5xl! flex flex-col gap-0 p-0"
            onOpenAutoFocus={(e) => e.preventDefault()}
        >
            {stockMovementId && <ViewStockMovementDetails stockMovementId={stockMovementId} />}
        </BaseSheetLayout>
    );
}
