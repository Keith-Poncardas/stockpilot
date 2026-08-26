import { ShoppingCart } from "lucide-react";
import { useViewSaleSheet } from "./hooks";
import { ViewSaleDetails } from "./ViewSaleDetails";

import { BaseSheetLayout } from "@/components/ui/base-sheet";

export function ViewSaleSheet() {
    const { isOpen, onClose, saleId } = useViewSaleSheet();

    return (
        <BaseSheetLayout
            isOpen={isOpen}
            onClose={onClose}
            title="Sale Details"
            description="Comprehensive overview of the transaction, including purchased items and customer details."
            icon={ShoppingCart}
        >
            {saleId && <ViewSaleDetails saleId={saleId} />}
        </BaseSheetLayout>
    );
}
