import { useState } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { useInfiniteCustomers } from './useInfiniteCustomers';
import { usePaginatedInventories } from './usePaginatedInventories';
import { useCreateSale } from './useCreateSale';

export function usePOS() {
  // Product Search State
  const [productSearch, setProductSearch] = useState('');
  const debouncedProductSearch = useDebounce(productSearch, 300);

  // Customer Search State
  const [customerSearch, setCustomerSearch] = useState('');
  const debouncedCustomerSearch = useDebounce(customerSearch, 300);

  // Operations
  const products = usePaginatedInventories(debouncedProductSearch, 20);
  const customers = useInfiniteCustomers(debouncedCustomerSearch, 20);
  const sale = useCreateSale();

  return {
    products: {
      ...products,
      searchTerm: productSearch,
      setSearchTerm: setProductSearch,
    },
    customers: {
      ...customers,
      searchTerm: customerSearch,
      setSearchTerm: setCustomerSearch,
    },
    sale,
  };
}
