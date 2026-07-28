import React from 'react';
import { FormSection } from '@/components/ui/form-section';
import { ShoppingBag } from 'lucide-react';
import { formatDate, formatCurrency } from '@/lib/utils';
import type { ICustomerDetails } from '../../customer.types';

interface CustomerPurchaseSummarySectionProps {
    customer: ICustomerDetails;
}

function SummaryRow({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2.5 border-b border-[#F0EEE9] last:border-0 gap-1 sm:gap-4">
            <span className="text-xs font-medium text-slate-500">{label}</span>
            <span
                className="text-sm font-semibold text-slate-900 sm:text-right"
                style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}
            >
                {value}
            </span>
        </div>
    );
}

export function CustomerPurchaseSummarySection({ customer }: CustomerPurchaseSummarySectionProps) {
    const totalOrders = customer.totalOrders ?? customer.purchaseSummary?.totalOrders ?? 0;
    const totalSpent = customer.totalSpent ?? customer.purchaseSummary?.totalSpent ?? 0;
    const averageOrderValue = customer.averageOrderValue ?? customer.purchaseSummary?.averageOrderValue ?? 0;
    const firstPurchase = customer.firstPurchase ?? customer.purchaseSummary?.firstPurchase;
    const lastPurchase = customer.lastPurchase ?? customer.purchaseSummary?.lastPurchase;

    return (
        <FormSection
            title="Purchase Summary"
            description="Aggregated lifetime transaction metrics."
            icon={<ShoppingBag className="w-4.5 h-4.5" strokeWidth={2} />}
            iconWrapperClassName="bg-violet-50 text-violet-600"
        >
            <div className="flex flex-col">
                <SummaryRow label="Total Orders" value={totalOrders.toLocaleString()} />
                <SummaryRow label="Total Revenue / Total Spent" value={formatCurrency(totalSpent)} />
                <SummaryRow label="Average Order Value" value={formatCurrency(averageOrderValue)} />
                <SummaryRow label="First Purchase" value={firstPurchase ? formatDate(firstPurchase) : '—'} />
                <SummaryRow label="Last Purchase" value={lastPurchase ? formatDate(lastPurchase) : '—'} />
            </div>
        </FormSection>
    );
}
