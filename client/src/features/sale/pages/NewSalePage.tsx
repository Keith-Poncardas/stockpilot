import { useState } from "react";
import { useMutation } from "@apollo/client";
import { Link } from "react-router-dom";
import { PATHS } from "@/routes";
import { CREATE_SALE } from "../operations/op.mutations";
import { useCart } from "../hooks/useCart";
import {
  CustomerSearchSection,
  ProductCatalogGrid,
  CartSection,
  PaymentActionsSection,
} from "../components/pos";
import { SectionHeader } from "@/components/SectionHeader";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store";
import {
  CreditCard,
  X,
  CheckCircle2,
  ArrowRight,
  RefreshCw,
} from "lucide-react";
import { formatDate, formatCurrency, handleGraphQLError } from "@/lib/utils";

export function NewSalePage() {
  const { user } = useAuthStore();
  const {
    items,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    customer,
    setCustomer,
    paymentMethod,
    setPaymentMethod,
    customPaymentMethod,
    setCustomPaymentMethod,
    effectivePaymentMethod,
    totalItemsCount,
    subtotal,
    totalDue,
  } = useCart();

  const [createSale, { loading: isSubmitting }] = useMutation(CREATE_SALE, {
    refetchQueries: ["GetSales", "GetSaleMetrics", "GetPosProducts"],
    awaitRefetchQueries: true,
  });

  const [validationError, setValidationError] = useState<string | null>(null);
  const [completedSale, setCompletedSale] = useState<{
    id: string;
    totalAmount: number;
    reference: string;
  } | null>(null);

  const handleCompleteSale = async () => {
    setValidationError(null);

    if (items.length === 0) {
      setValidationError("Add at least one product to the cart to complete a sale.");
      return;
    }

    if (!effectivePaymentMethod || effectivePaymentMethod.trim() === "") {
      setValidationError("Select or specify a payment method before completing this sale.");
      return;
    }

    try {
      const response = await createSale({
        variables: {
          input: {
            customerId: customer?.id || null,
            paymentMethod: effectivePaymentMethod,
            status: "COMPLETED",
            items: items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
            })),
          },
        },
      });

      const saleData = response.data?.createSale;
      if (saleData) {
        const reference = `SALE-${saleData.id.slice(0, 8).toUpperCase()}`;
        setCompletedSale({
          id: saleData.id,
          totalAmount: saleData.totalAmount,
          reference,
        });
        clearCart();
      }
    } catch (err: any) {
      console.error("Failed to create sale:", err);
      setValidationError(handleGraphQLError(err));
    }
  };

  const handleCancelSale = () => {
    if (
      items.length === 0 ||
      window.confirm("Are you sure you want to cancel this sale and clear the cart?")
    ) {
      clearCart();
      setValidationError(null);
      setCompletedSale(null);
    }
  };

  const cashierInitials = user
    ? `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase()
    : "CA";

  return (
    <div className="mx-auto max-w-7xl px-4 pb-28 pt-2 sm:px-6 lg:pb-10">
      {/* Page Header */}
      <SectionHeader
        title="New Sale"
        subtitle={formatDate(new Date())}
        icon={CreditCard}
        actions={
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Cashier badge */}
            {user && (
              <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-slate-50 py-1.5 pl-1.5 pr-3 sm:flex">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-700">
                  {cashierInitials}
                </span>
                <span className="text-sm font-medium text-slate-700">
                  {user.firstName} {user.lastName}
                </span>
                <span className="rounded bg-indigo-50 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-indigo-600">
                  Cashier
                </span>
              </div>
            )}

            {/* Cancel Sale */}
            <Button
              type="button"
              variant="outline"
              onClick={handleCancelSale}
            >
              <X className="h-4 w-4" />
              <span className="hidden sm:inline">Cancel Sale</span>
            </Button>
          </div>
        }
      />

      {/* Success Notification Banner */}
      {completedSale && (
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-emerald-200 bg-emerald-50/80 p-5 shadow-sm">
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
              <CheckCircle2 className="h-6 w-6" strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-base font-bold text-emerald-950">
                Sale Completed Successfully!
              </p>
              <p className="text-sm text-emerald-800">
                Reference: <span className="font-semibold">{completedSale.reference}</span> · Total:{" "}
                <span className="font-bold">{formatCurrency(completedSale.totalAmount)}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              type="button"
              onClick={() => setCompletedSale(null)}
              className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5"
            >
              <RefreshCw className="h-4 w-4" />
              New Sale
            </Button>
            <Button
              type="button"
              variant="outline"
              asChild
              className="rounded-xl border-emerald-300 text-emerald-800 hover:bg-emerald-100/50 px-4 py-2.5"
            >
              <Link to={PATHS.sales.root}>
                View Sales
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      )}

      {/* POS Grid Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:items-start">
        {/* Left Column: Customer & Products */}
        <div className="space-y-6 lg:col-span-2">
          <CustomerSearchSection
            selectedCustomer={customer}
            onSelectCustomer={setCustomer}
          />
          <ProductCatalogGrid onAddToCart={addItem} />
        </div>

        {/* Right Column: Order Items & Payment Actions */}
        <aside className="lg:col-span-1">
          <div className="space-y-6 lg:sticky lg:top-24">
            <CartSection
              items={items}
              totalItemsCount={totalItemsCount}
              onUpdateQuantity={updateQuantity}
              onRemoveItem={removeItem}
            />
            <div id="payment-actions">
              <PaymentActionsSection
                paymentMethod={paymentMethod}
                onSelectPaymentMethod={setPaymentMethod}
                customPaymentMethod={customPaymentMethod}
                onCustomPaymentMethodChange={setCustomPaymentMethod}
                subtotal={subtotal}
                totalDue={totalDue}
                totalItemsCount={totalItemsCount}
                onCompleteSale={handleCompleteSale}
                onCancelSale={handleCancelSale}
                isSubmitting={isSubmitting}
                validationError={validationError}
              />
            </div>
          </div>
        </aside>
      </div>

      {/* Mobile Sticky Summary Bar */}
      <div className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-between border-t border-slate-200 bg-white px-4 py-3 shadow-[0_-4px_12px_rgba(0,0,0,0.06)] lg:hidden">
        <div>
          <p className="text-xs text-slate-500">
            Total · {totalItemsCount} {totalItemsCount === 1 ? "item" : "items"}
          </p>
          <p className="text-lg font-bold tabular-nums text-indigo-600">
            {formatCurrency(totalDue)}
          </p>
        </div>
        <a
          href="#payment-actions"
          className="rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-300 shadow-sm"
        >
          Review &amp; Pay
        </a>
      </div>
    </div>
  );
}
