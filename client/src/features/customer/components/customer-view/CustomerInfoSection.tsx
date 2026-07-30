
import { FormSection } from '@/components/ui/form-section';
import { InfoRow } from '@/components/ui/info-row';
import { User } from 'lucide-react';
import { formatDate, formatCurrency } from '@/lib/utils';
import { formatCustomerName } from '../../customer.utils';
import type { ICustomerDetails } from '../../customer.types';

interface CustomerInfoSectionProps {
    customer: ICustomerDetails;
}

export function CustomerInfoSection({ customer }: CustomerInfoSectionProps) {
    const fullName = formatCustomerName(customer.firstName, customer.lastName, customer.email);
    const totalOrders = customer.totalOrders ?? customer.purchaseSummary?.totalOrders ?? 0;
    const totalSpent = customer.totalSpent ?? customer.purchaseSummary?.totalSpent ?? 0;
    const lastPurchase = customer.lastPurchase ?? customer.purchaseSummary?.lastPurchase;

    return (
        <FormSection
            title="Customer Information"
            description="Basic personal and contact details of the customer."
            icon={<User className="w-4.5 h-4.5" strokeWidth={2} />}
            iconWrapperClassName="bg-blue-50 text-blue-600"
        >
            <div className="flex flex-col">
                <InfoRow label="Customer Name" value={fullName} />
                <InfoRow label="Phone Number" value={customer.phone || '—'} />
                <InfoRow
                    label="Email Address"
                    value={
                        customer.email ? (
                            <a
                                href={`mailto:${customer.email}`}
                                className="text-indigo-600 hover:text-indigo-500 transition-colors"
                            >
                                {customer.email}
                            </a>
                        ) : (
                            '—'
                        )
                    }
                />
                <InfoRow label="Customer Since" value={formatDate(customer.createdAt)} />
                <InfoRow
                    label="Total Orders"
                    value={
                        <span style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
                            {totalOrders.toLocaleString()}
                        </span>
                    }
                />
                <InfoRow
                    label="Total Spent"
                    value={
                        <span style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
                            {formatCurrency(totalSpent)}
                        </span>
                    }
                />
                <InfoRow
                    label="Last Purchase"
                    value={
                        <span style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
                            {lastPurchase ? formatDate(lastPurchase) : '—'}
                        </span>
                    }
                />
            </div>
        </FormSection>
    );
}

export function CustomerInfoSectionSkeleton() {
    return (
        <FormSection
            title="Customer Information"
            description="Basic personal and contact details of the customer."
            icon={<User className="w-4.5 h-4.5" strokeWidth={2} />}
            iconWrapperClassName="bg-blue-50 text-blue-600"
        >
            <div className="flex flex-col">
                <InfoRow label="Customer Name" value={<div className="h-4 w-32 bg-[#F0EFEA] animate-pulse rounded-md" />} />
                <InfoRow label="Phone Number" value={<div className="h-4 w-24 bg-[#F0EFEA] animate-pulse rounded-md" />} />
                <InfoRow label="Email Address" value={<div className="h-4 w-48 bg-[#F0EFEA] animate-pulse rounded-md" />} />
                <InfoRow label="Customer Since" value={<div className="h-4 w-32 bg-[#F0EFEA] animate-pulse rounded-md" />} />
                <InfoRow label="Total Orders" value={<div className="h-4 w-24 bg-[#F0EFEA] animate-pulse rounded-md" />} />
                <InfoRow label="Total Spent" value={<div className="h-4 w-32 bg-[#F0EFEA] animate-pulse rounded-md" />} />
                <InfoRow label="Last Purchase" value={<div className="h-4 w-32 bg-[#F0EFEA] animate-pulse rounded-md" />} />
            </div>
        </FormSection>
    );
}

CustomerInfoSection.skeleton = CustomerInfoSectionSkeleton;
CustomerInfoSection.Skeleton = CustomerInfoSectionSkeleton;
