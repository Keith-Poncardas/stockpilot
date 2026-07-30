import { Hash, User as UserIcon, ShoppingBag, UserX } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import { FormSection } from "@/components/ui/form-section";
import { InfoRow } from "@/components/ui/info-row";
import { formatDate } from "@/lib/utils";
import type { ISaleDetail } from "../../sale.types";

export interface TransactionSummaryCardProps {
    sale: ISaleDetail;
}

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
                        <span className="font-mono text-xs text-gray-700 dark:text-gray-300 select-all">
                            {sale.id}
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
                    label="Status"
                    value={<StatusBadge value={sale.status} size="sm" />}
                />
            </div>
        </FormSection>
    );
}

export interface CashierInfoCardProps {
    user: ISaleDetail["user"];
}

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

export interface CustomerInfoCardProps {
    customer: ISaleDetail["customer"];
}

export function CustomerInfoCard({ customer }: CustomerInfoCardProps) {
    return (
        <FormSection
            title="Customer Information"
            description="Linked customer profile."
            icon={<ShoppingBag className="w-4.5 h-4.5" strokeWidth={2} />}
        >
            {customer ? (
                <div className="flex flex-col">
                    <InfoRow
                        label="Name"
                        value={`${customer.firstName} ${customer.lastName}`}
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
            ) : (
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 px-4 py-12 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                        <UserX className="h-6 w-6" />
                    </div>
                    <p className="mt-3 text-sm font-medium text-slate-700">
                        Walk-in Customer
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                        No customer profile linked
                    </p>
                </div>
            )}
        </FormSection>
    );
}
