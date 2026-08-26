import type { ReactNode } from 'react';
import type { ICustomerDetails } from '@/features/customer-refactor';

export interface CustomerAddressSectionProps {
    customer: ICustomerDetails;
}

export interface AddressRowProps {
    label: string;
    value?: ReactNode;
}
