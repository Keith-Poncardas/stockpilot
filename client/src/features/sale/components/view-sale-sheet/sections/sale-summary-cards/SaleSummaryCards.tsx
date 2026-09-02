import { Hash, User as UserIcon, ShoppingBag } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import { FormSection } from "@/components/ui/form-section";
import { InfoRow } from "@/components/ui/info-row";
import { formatDate, formatCurrency } from "@/lib/utils";
import {
    TransactionSummaryCardSkeleton,
    CashierInfoCardSkeleton,
    CustomerInfoCardSkeleton,
} from "./skeleton";
import type {
    TransactionSummaryCardProps,
    CashierInfoCardProps,
    CustomerInfoCardProps,
} from "./types";

export function TransactionSummaryCard({ sale }: TransactionSummaryCardProps) {
    return (
        <FormSection
            title="Transaction Summary"
            description="Key sale metadata and order status."
            icon={<Hash className="w-4.5 h-4.5" strokeWidth={2} />}
        >
            <div className="flex flex-col">
                <InfoRow
                    label="Sale ID"
                    value={
                        <span className="font-mono text-xs text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                            #{sale.id.slice(0, 8)}
                        </span>
                    }
                />
                <InfoRow
                    label="Date & Time"
                    value={
                        <span className="text-gray-700 dark:text-gray-300">
                            {formatDate(sale.saleDate)}
                        </span>
                    }
                />
                <InfoRow
                    label="Payment Method"
                    value={
                        <span className="text-gray-700 dark:text-gray-300 capitalize">
                            {sale.paymentMethod.replace(/_/g, " ").toLowerCase()}
                        </span>
                    }
                />
                <InfoRow
                    label="VATable Sales"
                    value={
                        <span className="font-mono text-xs text-gray-700 dark:text-gray-300">
                            {formatCurrency(sale.vatableSales ?? (sale.totalAmount / 1.12))}
                        </span>
                    }
                />
                <InfoRow
                    label="VAT Amount (12%)"
                    value={
                        <span className="font-mono text-xs text-gray-700 dark:text-gray-300">
                            {formatCurrency(sale.vatAmount ?? (sale.totalAmount - (sale.totalAmount / 1.12)))}
                        </span>
                    }
                />
                <InfoRow
                    label="Status"
                    value={<StatusBadge value={sale.status} size="sm" />}
                />
            </div>
        </FormSection>
    );
}

TransactionSummaryCard.Skeleton = TransactionSummaryCardSkeleton;

export function CashierInfoCard({ user }: CashierInfoCardProps) {
    return (
        <FormSection
            title="Cashier Information"
            description="User who processed this sale."
            icon={<UserIcon className="w-4.5 h-4.5" strokeWidth={2} />}
        >
            <div className="flex flex-col">
                <InfoRow
                    label="Name"
                    value={`${user.firstName} ${user.lastName}`}
                />
                <InfoRow
                    label="Email"
                    value={
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                            {user.email}
                        </span>
                    }
                />
                <InfoRow
                    label="Role"
                    value={<StatusBadge value={user.role} size="sm" />}
                />
            </div>
        </FormSection>
    );
}

CashierInfoCard.Skeleton = CashierInfoCardSkeleton;

export function CustomerInfoCard({ customer }: CustomerInfoCardProps) {
    if (!customer) return null;

    return (
        <FormSection
            title="Customer Information"
            description="Linked customer profile."
            icon={<ShoppingBag className="w-4.5 h-4.5" strokeWidth={2} />}
        >
            <div className="flex flex-col">
                <InfoRow
                    label="Name"
                    value={`${customer.firstName ?? ""} ${customer.lastName ?? ""}`.trim() || "Customer"}
                />
                {customer.email && (
                    <InfoRow
                        label="Email"
                        value={
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                {customer.email}
                            </span>
                        }
                    />
                )}
                {customer.phone && (
                    <InfoRow
                        label="Phone"
                        value={
                            <span className="text-xs font-mono text-gray-500 dark:text-gray-400">
                                {customer.phone}
                            </span>
                        }
                    />
                )}
            </div>
        </FormSection>
    );
}

CustomerInfoCard.Skeleton = CustomerInfoCardSkeleton;
