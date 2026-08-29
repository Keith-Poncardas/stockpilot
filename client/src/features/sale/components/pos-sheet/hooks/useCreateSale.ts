import { useMutation, ApolloError } from '@apollo/client';
import { CREATE_POS_SALE } from '../../../operations/op.mutations';
import { toast } from 'sonner';
import type { CartItem } from '../sections/cart/types';

export interface CompleteSaleParams {
  items: CartItem[];
  customerId?: string | null;
  paymentMethod: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  onValidationFailed?: (msg: string | null) => void;
}

export function useCreateSale() {
  const [createSaleMutation, { loading, error }] = useMutation(CREATE_POS_SALE, {
    refetchQueries: [
      "GetSales",
      "GetSaleMetrics",
      "GetDashboardMetrics",
      "GetSellableProducts",
      "GetCustomerMetrics",
    ],
    awaitRefetchQueries: true,
  });

  const handleCompleteSale = async ({
    items,
    customerId,
    paymentMethod,
    onSuccess,
    onError,
    onValidationFailed,
  }: CompleteSaleParams) => {
    if (items.length === 0) {
      onValidationFailed?.("Cart is empty. Please add items.");
      return;
    }

    onValidationFailed?.(null);

    try {
      const result = await createSaleMutation({
        variables: {
          input: {
            customerId: customerId || null,
            paymentMethod,
            status: "COMPLETED",
            items: items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
            })),
          },
        },
      });
      toast.success("Sale completed successfully!");
      onSuccess?.();
      return result.data?.createSale;
    } catch (err: unknown) {
      if (err instanceof ApolloError) {
        console.error('Validation error details:', err.graphQLErrors?.[0]?.extensions?.validation || err);
      } else {
        console.error(err);
      }
      const error = err as Error;
      toast.error(error.message || "Failed to complete sale.");
      onError?.(error);
    }
  };

  return {
    handleCompleteSale,
    isSubmitting: loading,
    error,
  };
}
