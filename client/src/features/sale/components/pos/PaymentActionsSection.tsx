import React from "react";
import { FormSection } from "@/components/ui/form-section";
import { ButtonLoading } from "@/components/ui/button";
import { CreditCard, Check, AlertCircle } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface PaymentActionsSectionProps {
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

export const PaymentActionsSection: React.FC<PaymentActionsSectionProps> = ({
  subtotal,
  totalDue,
  totalItemsCount,
  onCompleteSale,
  isSubmitting,
  validationError,
}) => {
  return (
    <FormSection
      title="Payment Method"
      description="Select a payment method for the sale."
      icon={<CreditCard className="h-4.5 w-4.5" strokeWidth={2} />}
      iconWrapperClassName="bg-indigo-50 text-indigo-600"
    >
      <div className="space-y-6">
        {/* Validation Error Message */}
        {validationError && (
          <div className="flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-3">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
            <p className="text-xs text-amber-800 font-medium">
              {validationError}
            </p>
          </div>
        )}

        {/* Summary Table */}
        <div className="rounded-xl bg-slate-50 p-4 border border-slate-200/80 space-y-2.5">
          <div className="flex items-center justify-between text-sm text-slate-500">
            <span>
              Subtotal · {totalItemsCount}{" "}
              {totalItemsCount === 1 ? "item" : "items"}
            </span>
            <span className="tabular-nums font-medium text-slate-700">
              {formatCurrency(subtotal)}
            </span>
          </div>

          <div className="flex items-center justify-between border-t border-slate-200 pt-3">
            <span className="text-base font-semibold text-slate-900">
              Total Due
            </span>
            <span className="text-xl font-bold tabular-nums text-indigo-600">
              {formatCurrency(totalDue)}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-1">
          <ButtonLoading
            loading={isSubmitting}
            disabled={isSubmitting || totalItemsCount === 0}
            onClick={onCompleteSale}
            className="w-full justify-center"
            size="lg"
          >
            <Check className="h-4 w-4" strokeWidth={2.5} />
            Complete Sale
          </ButtonLoading>

        </div>
      </div>
    </FormSection>
  );
};
