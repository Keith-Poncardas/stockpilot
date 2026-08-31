import { BaseSheetLayout } from "@/components/ui/base-sheet";
import { UserCog } from "lucide-react";
import { useEditCustomerSheet } from "./hooks/useEditCustomerSheet";
import { EditCustomerDetails } from "./EditCustomerDetails";

export function EditCustomerSheet() {
    const { isOpen, onClose, customerId } = useEditCustomerSheet();

    return (
        <BaseSheetLayout
            isOpen={isOpen}
            onClose={onClose}
            title="Edit Customer"
            description="Update customer details and address information."
            icon={UserCog}
            className="w-[95vw]! sm:max-w-xl! md:max-w-2xl! lg:max-w-3xl! flex flex-col gap-0 p-0"
            onOpenAutoFocus={(e) => e.preventDefault()}
        >
            {customerId && <EditCustomerDetails key={customerId} customerId={customerId} onClose={onClose} />}
        </BaseSheetLayout>
    );
}
