import { BaseSheetLayout } from "@/components/ui/base-sheet";
import { UserCircle } from "lucide-react";
import { useViewCustomerSheet } from "./hooks/useViewCustomerSheet";
import { ViewCustomerDetails } from "./ViewCustomerDetails";

export function ViewCustomerSheet() {
    const { isOpen, onClose, customerId } = useViewCustomerSheet();

    return (
        <BaseSheetLayout
            isOpen={isOpen}
            onClose={onClose}
            title="Customer Details"
            description="View full customer profile and purchase history."
            icon={UserCircle}
            className="w-[95vw]! sm:max-w-2xl! md:max-w-4xl! lg:max-w-6xl! xl:max-w-340! flex flex-col gap-0 p-0"
            onOpenAutoFocus={(e) => e.preventDefault()}
        >
            {customerId && <ViewCustomerDetails customerId={customerId} />}
        </BaseSheetLayout>
    );
}
// 