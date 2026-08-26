import { FormSection } from '@/components/ui/form-section';
import { Skeleton } from '@/components/ui/skeleton';
import { Receipt } from 'lucide-react';

export function CustomerPurchaseHistorySectionSkeleton() {
    return (
        <FormSection
            title="Purchase History"
            description="Complete transaction history for this customer."
            icon={<Receipt className="w-4.5 h-4.5" strokeWidth={2} />}
            iconWrapperClassName="bg-emerald-50 text-emerald-600"
            flushContent
        >
            <div className="border-t border-[#F0EEE9]">
                <Skeleton className="h-64 w-full rounded-none" />
            </div>
        </FormSection>
    );
}
