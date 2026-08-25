export interface SelectedCustomer {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  phone: string | null;
  customerType: string | null;
  companyName?: string | null;
}

export interface CustomerSearchSectionProps {
  selectedCustomer: SelectedCustomer | null;
  onSelectCustomer: (customer: SelectedCustomer | null) => void;
  customers: any[];
  loading: boolean;
  hasNextPage: boolean;
  onLoadMore: () => void;
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
}
