import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { SEARCH_CUSTOMERS } from "../operations/op.queries";
import type { SelectedCustomer } from "./useCart";

interface SearchCustomersData {
  searchCustomers: {
    data: SelectedCustomer[];
    meta: { nextCursor: string | null; hasNextPage: boolean };
  };
}

/**
 * Domain wrapper around useInfiniteScroll for POS customer search.
 */
export function useInfiniteCustomerSearch(search: string) {
  return useInfiniteScroll<SearchCustomersData, SelectedCustomer>({
    query: SEARCH_CUSTOMERS,
    search,
    getResult: (data) => data.searchCustomers,
  });
}
