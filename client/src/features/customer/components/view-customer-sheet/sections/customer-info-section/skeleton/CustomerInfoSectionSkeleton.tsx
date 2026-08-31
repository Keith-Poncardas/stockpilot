import { FormSection } from '@/components/ui/form-section';
import { InfoRow } from '@/components/ui/info-row';
import { Skeleton } from '@/components/ui/skeleton';
import { User } from 'lucide-react';

export function CustomerInfoSectionSkeleton() {
    return (
        <FormSection
            title="Customer Information"
            description="Basic personal and contact details of the customer."
            icon={<User className="w-4.5 h-4.5" strokeWidth={2} />}
            iconWrapperClassName="bg-blue-50 text-blue-600"
        >
            <div className="flex flex-col">
                <InfoRow label="Customer Name" value={<Skeleton className="h-4 w-32" />} />
                <InfoRow label="Phone Number" value={<Skeleton className="h-4 w-24" />} />
                <InfoRow label="Email Address" value={<Skeleton className="h-4 w-48" />} />
                <InfoRow label="Customer Since" value={<Skeleton className="h-4 w-32" />} />
                <InfoRow label="Total Orders" value={<Skeleton className="h-4 w-24" />} />
                <InfoRow label="Total Spent" value={<Skeleton className="h-4 w-32" />} />
                <InfoRow label="Last Purchase" value={<Skeleton className="h-4 w-32" />} />
            </div>
        </FormSection>
    );
}
