
import { ButtonLoading } from "@/components/ui/button";
import { CreditCard, Check, AlertCircle, Banknote, Smartphone, Landmark, Wallet } from "lucide-react";
import { formatCurrency, cn } from "@/lib/utils";

import { PaymentActionsSkeleton } from "./skeleton/PaymentActionsSkeleton";

const PAYMENT_METHODS = [
  { id: "CASH", label: "Cash", icon: Banknote, colorClass: "text-emerald-500", bgClass: "bg-emerald-50", borderClass: "border-emerald-200" },
  { id: "GCASH", label: "GCash", icon: Smartphone, colorClass: "text-blue-500", bgClass: "bg-blue-50", borderClass: "border-blue-200" },
  { id: "BANK_TRANSFER", label: "Bank Transfer", icon: Landmark, colorClass: "text-indigo-500", bgClass: "bg-indigo-50", borderClass: "border-indigo-200" },
  { id: "CREDIT_CARD", label: "Credit Card", icon: CreditCard, colorClass: "text-slate-600", bgClass: "bg-slate-50", borderClass: "border-slate-200" },
  { id: "DEBIT_CARD", label: "Debit Card", icon: Wallet, colorClass: "text-teal-500", bgClass: "bg-teal-50", borderClass: "border-teal-200" },
];

export const PaymentActionsSection = ({
  paymentMethod,
  onSelectPaymentMethod,
  subtotal,
  totalDue,
  totalItemsCount,
  onCompleteSale,
  isSubmitting,
  validationError,
}) => {
  return (
    <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 w-full flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
          <CreditCard className="h-4.5 w-4.5" strokeWidth={2} />
        </div>
        <div>
          <h2 className="font-sans font-semibold text-base text-slate-900 dark:text-slate-100">Payment Method</h2>
          <p className="text-xs text-slate-400 mt-0.5">Select a payment method for the sale.</p>
        </div>
      </div>

      {/* Payment Options Grid */}
      <div className="grid grid-cols-5 gap-3">
        {PAYMENT_METHODS.map((method) => {
          const isSelected = paymentMethod === method.id;
          const Icon = method.icon;
          return (
            <button
              key={method.id}
              type="button"
              onClick={() => onSelectPaymentMethod(method.id)}
              className={cn(
                "flex flex-col items-center justify-center gap-2 p-3 rounded-xl border text-center transition-all",
                isSelected
                  ? `border-indigo-600 bg-indigo-50/50 shadow-sm ring-1 ring-indigo-600`
                  : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
              )}
            >
              <div className={cn("p-2 rounded-full", isSelected ? method.bgClass : "bg-slate-100")}>
                <Icon className={cn("w-5 h-5", isSelected ? method.colorClass : "text-slate-500")} strokeWidth={isSelected ? 2.5 : 2} />
              </div>
              <span className={cn("text-[10px] font-semibold tracking-wide uppercase", isSelected ? "text-indigo-700" : "text-slate-500")}>
                {method.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Validation Error Message */}
      {validationError && (
        <div className="flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-3 mt-1">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
          <p className="text-xs text-amber-800 font-medium">
            {validationError}
          </p>
        </div>
      )}

      {/* Summary Table */}
      <div className="rounded-xl bg-slate-50 dark:bg-slate-900/50 p-4 border border-slate-200/80 dark:border-slate-800 space-y-2.5 mt-2">
        <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
          <span>
            Subtotal · {totalItemsCount}{" "}
            {totalItemsCount === 1 ? "item" : "items"}
          </span>
          <span className="tabular-nums font-medium text-slate-700 dark:text-slate-300">
            {formatCurrency(subtotal)}
          </span>
        </div>

        <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800 pt-3">
          <span className="text-base font-semibold text-slate-900 dark:text-slate-100">
            Total Due
          </span>
          <span className="text-xl font-bold tabular-nums text-indigo-600 dark:text-indigo-400">
            {formatCurrency(totalDue)}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <ButtonLoading
        loading={isSubmitting}
        disabled={isSubmitting || totalItemsCount === 0}
        onClick={onCompleteSale}
        className="w-full justify-center h-12 text-base shadow-sm"
        size="lg"
      >
        <Check className="h-5 w-5 mr-2" strokeWidth={2.5} />
        Complete Sale
      </ButtonLoading>

    </div>
  );
};

PaymentActionsSection.Skeleton = PaymentActionsSkeleton;
