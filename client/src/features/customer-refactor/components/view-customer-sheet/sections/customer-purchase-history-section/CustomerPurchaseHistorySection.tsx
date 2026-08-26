import { FormSection } from '@/components/ui/form-section';
import { DataTableLayout } from '@/components/ui/data-table-layout';
import { EmptyState } from '@/components/ui/empty-state';
import { Receipt, ShoppingBag } from 'lucide-react';
import { useCustomerPurchaseHistory } from './hooks';
import type { CustomerPurchaseHistorySectionProps } from './types';
import { CustomerPurchaseHistorySectionSkeleton } from './skeleton';

export function CustomerPurchaseHistorySection({
    sales = [],
    isLoading = false,
}: CustomerPurchaseHistorySectionProps) {
    const { table, isEmpty } = useCustomerPurchaseHistory({ sales, isLoading });

    return (
        <FormSection
            title="Purchase History"
            description="Complete transaction history for this customer."
            icon={<Receipt className="w-4.5 h-4.5" strokeWidth={2} />}
            iconWrapperClassName="bg-emerald-50 text-emerald-600"
            flushContent
        >
            <DataTableLayout
                table={table}
                isLoading={isLoading}
                isEmpty={isEmpty}
                className="rounded-none border-0 border-t border-[#F0EEE9] shadow-none"
                emptyState={
                    <div className="p-8">
                        <EmptyState
                            title="No purchases yet"
                            description="This customer has not completed any transactions."
                            icon={ShoppingBag}
                        />
                    </div>
                }
            />
        </FormSection>
    );
}

CustomerPurchaseHistorySection.Skeleton = CustomerPurchaseHistorySectionSkeleton;
