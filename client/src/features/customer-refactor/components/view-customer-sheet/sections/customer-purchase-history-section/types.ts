import type { ISale } from '@/features/sale/types';
import type { ICustomerSale } from '@/features/customer-refactor';

export interface CustomerPurchaseHistorySectionProps {
    sales: (ISale | ICustomerSale)[];
    isLoading?: boolean;
}
