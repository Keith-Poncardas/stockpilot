import React from "react";
import { FormSection } from "@/components/ui/form-section";
import { Button } from "@/components/ui/button";
import type { CartItem } from "../../hooks/useCart";
import { ShoppingCart, Trash2, Minus, Plus } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface CartSectionProps {
  items: CartItem[];
  totalItemsCount: number;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
}

export const CartSection: React.FC<CartSectionProps> = ({
  items,
  totalItemsCount,
  onUpdateQuantity,
  onRemoveItem,
}) => {
  return (
    <FormSection
      title="Order Items"
      description="These are the items that will be added to the sale."
      icon={<ShoppingCart className="h-4.5 w-4.5" strokeWidth={2} />}
      iconWrapperClassName="bg-indigo-50 text-indigo-600"
      actions={
        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
          {totalItemsCount} {totalItemsCount === 1 ? "item" : "items"}
        </span>
      }
    >
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 px-4 py-12 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
            <ShoppingCart className="h-6 w-6" />
          </div>
          <p className="mt-3 text-sm font-medium text-slate-700">
            Your cart is empty
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Search or browse products to add them to this sale.
          </p>
        </div>
      ) : (
        <div className="max-h-96 divide-y divide-slate-100 overflow-y-auto pr-1">
          {items.map((item) => {
            const itemSubtotal = item.quantity * item.unitPrice;
            const canIncrease = item.quantity < item.quantityOnHand;

            return (
              <div
                key={item.productId}
                className="flex items-start justify-between gap-3 py-3.5 first:pt-0 last:pb-0"
              >
                <div className="min-w-0 flex-1">
                  <p
                    className="truncate text-sm font-medium text-slate-900"
                    title={item.name}
                  >
                    {item.name}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {formatCurrency(item.unitPrice)} each
                  </p>

                  <div className="mt-2.5 inline-flex items-center rounded-lg border border-slate-200 bg-white shadow-xs">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-xs"
                      aria-label="Decrease quantity"
                      onClick={() =>
                        onUpdateQuantity(item.productId, item.quantity - 1)
                      }
                      className="rounded-r-none border-r border-slate-200 text-slate-500"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </Button>
                    <span className="w-9 text-center text-sm font-medium tabular-nums text-slate-800">
                      {item.quantity}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-xs"
                      aria-label="Increase quantity"
                      disabled={!canIncrease}
                      onClick={() =>
                        onUpdateQuantity(item.productId, item.quantity + 1)
                      }
                      className="rounded-l-none border-l border-slate-200 text-slate-500"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <p className="text-sm font-semibold tabular-nums text-slate-900">
                    {formatCurrency(itemSubtotal)}
                  </p>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    aria-label={`Remove ${item.name} from sale`}
                    onClick={() => onRemoveItem(item.productId)}
                    className="text-slate-400 hover:text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </FormSection>
  );
};
