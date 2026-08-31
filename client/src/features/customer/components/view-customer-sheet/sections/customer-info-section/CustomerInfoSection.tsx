import { FormSection } from '@/components/ui/form-section';
import { InfoRow } from '@/components/ui/info-row';
import { User } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { formatCustomerName } from '@/features/customer/utils';
import type { CustomerInfoSectionProps } from './types';
import { CustomerInfoSectionSkeleton } from './skeleton';

export function CustomerInfoSection({ customer }: CustomerInfoSectionProps) {
    const fullName = formatCustomerName(customer.firstName, customer.lastName, customer.email);

    return (
        <FormSection
            title="Customer Information"
            description="Basic personal and contact details of the customer."
            icon={<User className="w-4.5 h-4.5" strokeWidth={2} />}
            iconWrapperClassName="bg-blue-50 text-blue-600"
        >
            <div className="flex flex-col">
                <InfoRow label="Customer ID" value={<span className="font-mono text-xs text-slate-700">{customer.id}</span>} />
                <InfoRow label="Customer Name" value={fullName} />
                <InfoRow label="Phone Number" value={customer.phone || '—'} />
                <InfoRow
                    label="Email Address"
                    value={
                        customer.email ? (
                            <a
                                href={`mailto:${customer.email}`}
                                className="text-indigo-600 hover:text-indigo-500 transition-colors font-mono text-xs"
                            >
                                {customer.email}
                            </a>
                        ) : (
                            '—'
                        )
                    }
                />
                <InfoRow label="Customer Since" value={formatDate(customer.createdAt)} />
            </div>
        </FormSection>
    );
}

CustomerInfoSection.Skeleton = CustomerInfoSectionSkeleton;
