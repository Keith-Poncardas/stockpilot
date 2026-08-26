import type { ICustomer } from "@/features/customer/customer.types";

export interface CustomerSearchSectionProps {
  selectedCustomer: ICustomer | null;
  onSelectCustomer: (customer: ICustomer | null) => void;
  customers: ICustomer[];
  loading: boolean;
  isFetchingMore?: boolean;
  hasNextPage: boolean;
  onLoadMore: () => void;
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
}
