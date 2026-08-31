import { FormSection } from '@/components/ui/form-section';
import { Skeleton } from '@/components/ui/skeleton';
import { ShoppingBag } from 'lucide-react';
import { SummaryRow } from '../CustomerPurchaseSummarySection';

export function CustomerPurchaseSummarySectionSkeleton() {
    return (
        <FormSection
            title="Purchase Summary"
            description="Aggregated lifetime transaction metrics."
            icon={<ShoppingBag className="w-4.5 h-4.5" strokeWidth={2} />}
            iconWrapperClassName="bg-violet-50 text-violet-600"
        >
            <div className="flex flex-col">
                <SummaryRow label="Total Orders" value={<Skeleton className="h-4 w-16" />} />
                <SummaryRow label="Total Revenue / Total Spent" value={<Skeleton className="h-4 w-28" />} />
                <SummaryRow label="Average Order Value" value={<Skeleton className="h-4 w-24" />} />
                <SummaryRow label="First Purchase" value={<Skeleton className="h-4 w-28" />} />
                <SummaryRow label="Last Purchase" value={<Skeleton className="h-4 w-28" />} />
            </div>
        </FormSection>
    );
}
