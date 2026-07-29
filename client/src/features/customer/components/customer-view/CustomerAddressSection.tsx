
import React from 'react';
import { FormSection } from '@/components/ui/form-section';
import { MapPin } from 'lucide-react';
import type { ICustomerDetails } from '../../customer.types';

interface CustomerAddressSectionProps {
    customer: ICustomerDetails;
}

function AddressRow({ label, value }: { label: string; value?: React.ReactNode }) {
    if (!value) return null;
    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2.5 border-b border-[#F0EEE9] last:border-0 gap-1 sm:gap-4">
            <span className="text-xs font-medium text-slate-500">{label}</span>
            <span className="text-sm font-semibold text-slate-900 sm:text-right">{value}</span>
        </div>
    );
}

export function CustomerAddressSection({ customer }: CustomerAddressSectionProps) {
    const hasAnyAddress = Boolean(
        customer.addressLine1 ||
        customer.addressLine2 ||
        customer.city ||
        customer.province ||
        customer.postalCode ||
        customer.country
    );

    return (
        <FormSection
            title="Address Information"
            description="Registered billing or shipping location."
            icon={<MapPin className="w-4.5 h-4.5" strokeWidth={2} />}
            iconWrapperClassName="bg-amber-50 text-amber-600"
        >
            <div className="flex flex-col">
                {hasAnyAddress ? (
                    <>
                        <AddressRow label="Address Line 1" value={customer.addressLine1} />
                        <AddressRow label="Address Line 2" value={customer.addressLine2} />
                        <AddressRow label="City / Municipality" value={customer.city} />
                        <AddressRow label="Province / State" value={customer.province} />
                        <AddressRow label="Postal Code" value={customer.postalCode} />
                        <AddressRow label="Country" value={customer.country} />
                    </>
                ) : (
                    <p className="text-sm text-slate-400 py-4 text-center">No address on file.</p>
                )}
            </div>
        </FormSection>
    );
}

export function CustomerAddressSectionSkeleton() {
    return (
        <FormSection
            title="Address Information"
            description="Registered billing or shipping location."
            icon={<MapPin className="w-4.5 h-4.5" strokeWidth={2} />}
            iconWrapperClassName="bg-amber-50 text-amber-600"
        >
            <div className="flex flex-col">
                <AddressRow label="Address Line 1" value={<div className="h-4 w-32 bg-[#F0EFEA] animate-pulse rounded-md" />} />
                <AddressRow label="Address Line 2" value={<div className="h-4 w-24 bg-[#F0EFEA] animate-pulse rounded-md" />} />
                <AddressRow label="City / Municipality" value={<div className="h-4 w-48 bg-[#F0EFEA] animate-pulse rounded-md" />} />
                <AddressRow label="Province / State" value={<div className="h-4 w-32 bg-[#F0EFEA] animate-pulse rounded-md" />} />
                <AddressRow label="Postal Code" value={<div className="h-4 w-24 bg-[#F0EFEA] animate-pulse rounded-md" />} />
                <AddressRow label="Country" value={<div className="h-4 w-32 bg-[#F0EFEA] animate-pulse rounded-md" />} />
            </div>
        </FormSection>
    );
}

CustomerAddressSection.skeleton = CustomerAddressSectionSkeleton;
CustomerAddressSection.Skeleton = CustomerAddressSectionSkeleton;