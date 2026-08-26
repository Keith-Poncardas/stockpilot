import { Hash, User as UserIcon, ShoppingBag } from "lucide-react";
import { FormSection } from "@/components/ui/form-section";
import { InfoRow } from "@/components/ui/info-row";

export function TransactionSummaryCardSkeleton() {
    return (
        <FormSection
            title="Transaction Summary"
            description="Key sale metadata and order status."
            icon={<Hash className="w-4.5 h-4.5" strokeWidth={2} />}
        >
            <div className="flex flex-col">
                <InfoRow.Skeleton />
                <InfoRow.Skeleton />
                <InfoRow.Skeleton />
            </div>
        </FormSection>
    );
}

export function CashierInfoCardSkeleton() {
    return (
        <FormSection
            title="Cashier Information"
            description="User who processed this sale."
            icon={<UserIcon className="w-4.5 h-4.5" strokeWidth={2} />}
        >
            <div className="flex flex-col">
                <InfoRow.Skeleton />
                <InfoRow.Skeleton />
                <InfoRow.Skeleton />
            </div>
        </FormSection>
    );
}

export function CustomerInfoCardSkeleton() {
    return (
        <FormSection
            title="Customer Information"
            description="Linked customer profile."
            icon={<ShoppingBag className="w-4.5 h-4.5" strokeWidth={2} />}
        >
            <div className="flex flex-col">
                <InfoRow.Skeleton />
                <InfoRow.Skeleton />
                <InfoRow.Skeleton />
            </div>
        </FormSection>
    );
}
