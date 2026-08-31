import type { ReactNode } from 'react';
import type { ICustomerDetails } from '@/features/customer';

export interface CustomerPurchaseSummarySectionProps {
    customer: ICustomerDetails;
}

export interface SummaryRowProps {
    label: string;
    value: ReactNode;
}
