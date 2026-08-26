export interface PaymentActionsSectionProps {
  paymentMethod: string;
  onSelectPaymentMethod: (method: string) => void;
  customPaymentMethod: string;
  onCustomPaymentMethodChange: (val: string) => void;
  subtotal: number;
  totalDue: number;
  totalItemsCount: number;
  onCompleteSale: () => void;
  onCancelSale: () => void;
  isSubmitting: boolean;
  validationError: string | null;
}
