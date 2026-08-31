import { FormSection } from '@/components/ui/form-section';
import { Skeleton } from '@/components/ui/skeleton';
import { MapPin } from 'lucide-react';
import { AddressRow } from '../CustomerAddressSection';

export function CustomerAddressSectionSkeleton() {
    return (
        <FormSection
            title="Address Information"
            description="Registered billing or shipping location."
            icon={<MapPin className="w-4.5 h-4.5" strokeWidth={2} />}
            iconWrapperClassName="bg-amber-50 text-amber-600"
        >
            <div className="flex flex-col">
                <AddressRow label="Address Line 1" value={<Skeleton className="h-4 w-32" />} />
                <AddressRow label="Address Line 2" value={<Skeleton className="h-4 w-24" />} />
                <AddressRow label="City / Municipality" value={<Skeleton className="h-4 w-48" />} />
                <AddressRow label="Province / State" value={<Skeleton className="h-4 w-32" />} />
                <AddressRow label="Postal Code" value={<Skeleton className="h-4 w-24" />} />
                <AddressRow label="Country" value={<Skeleton className="h-4 w-32" />} />
            </div>
        </FormSection>
    );
}
