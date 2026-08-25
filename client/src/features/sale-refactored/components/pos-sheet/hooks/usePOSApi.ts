import { useQuery, useMutation } from '@apollo/client';
import { useState, useCallback, useEffect } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { SEARCH_POS_CUSTOMERS } from '../../../operations/op.queries';
import { CREATE_POS_SALE } from '../../../operations/op.mutations';
import { GET_INVENTORIES } from '@/features/inventory/operations/op.queries';

export function usePOSProducts(initialLimit = 20) {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 300);
  const [currentPage, setCurrentPage] = useState(1);

  // Reset to page 1 whenever search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch]);

  const { data, loading, error } = useQuery(GET_INVENTORIES, {
    variables: {
      input: {
        page: currentPage,
        limit: initialLimit,
        filter: {
          search: debouncedSearch || undefined,
        },
      },
    },
    fetchPolicy: 'cache-and-network',
  });

  const rawInventories = data?.getInventories?.data ?? [];
  const products = rawInventories
    .filter((inv: any) => inv?.product && inv.product.status === "ACTIVE")
    .map((inv: any) => ({
      id: inv.productId || inv.product?.id || inv.id,
      sku: inv.product?.sku ?? "",
      name: inv.product?.name ?? "",
      unitPrice: Number(inv.product?.unitPrice ?? 0),
      quantityOnHand: inv.quantityOnHand ?? 0,
      reorderLevel: inv.reorderLevel ?? 0,
      status: inv.product?.status ?? "",
    }));

  const meta = data?.getInventories?.meta;

  return {
    products,
    loading,
    error,
    meta,
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
  };
}

export function usePOSCustomers(initialLimit = 10) {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 300);

  const { data, loading, error, fetchMore } = useQuery(SEARCH_POS_CUSTOMERS, {
    variables: {
      args: {
        search: debouncedSearch,
        limit: initialLimit,
      },
    },
    fetchPolicy: 'cache-and-network',
  });

  const customers = data?.searchCustomers?.data ?? [];
  const meta = data?.searchCustomers?.meta;

  const loadMore = useCallback(() => {
    if (meta?.hasNextPage && meta?.nextCursor) {
      fetchMore({
        variables: {
          args: {
            search: debouncedSearch,
            limit: initialLimit,
            cursor: meta.nextCursor,
          },
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;
          return {
            searchCustomers: {
              ...fetchMoreResult.searchCustomers,
              data: [
                ...prev.searchCustomers.data,
                ...fetchMoreResult.searchCustomers.data,
              ],
            },
          };
        },
      });
    }
  }, [fetchMore, debouncedSearch, meta, initialLimit]);

  return {
    customers,
    loading,
    error,
    meta,
    searchTerm,
    setSearchTerm,
    loadMore,
  };
}

export function useCreateSaleMutation() {
  const [createSaleMutation, { loading, error }] = useMutation(CREATE_POS_SALE);

  const createSale = async (input: any) => {
    const result = await createSaleMutation({
      variables: { input },
    });
    return result.data?.createSale;
  };

  return {
    createSale,
    isSubmitting: loading,
    error,
  };
}
