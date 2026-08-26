import { BaseSheetLayout } from "@/components/ui/base-sheet";
import { Calculator } from "lucide-react";
import { usePOSSheet } from "./hooks/usePOSSheet";
import { PointOfSale } from "./PointOfSale";

export function PointOfSaleSheet() {
    const { isOpen, onClose } = usePOSSheet();

    return (
        <BaseSheetLayout
            isOpen={isOpen}
            onClose={onClose}
            title="Point of Sale"
            description="Process new transactions, select products, and complete sales."
            icon={Calculator}
            className="w-[95vw]! sm:max-w-xl! md:max-w-3xl! lg:max-w-4xl! xl:max-w-5xl! flex flex-col gap-0 p-0"
            onOpenAutoFocus={(e) => e.preventDefault()}
        >
            <PointOfSale />
        </BaseSheetLayout>
    );
}
