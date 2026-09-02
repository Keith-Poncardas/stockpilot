import { useState } from "react";
import { FormSection } from "@/components/ui/form-section";
import { Button } from "@/components/ui/button";
import { CartSkeleton } from "./skeleton/CartSkeleton";
import { ShoppingCart, Trash2, Minus, Plus, Gift, Tag, Edit3, Check, X } from "lucide-react";

import { formatCurrency } from "@/lib/utils";

import { Input } from "@/components/ui/input";
import { useCart, calculateItemLinePrice } from "./hook/useCart";

export const CartSection = () => {
  const { items, getTotalItemsCount, updateQuantity, setCustomPrice, removeItem } = useCart();
  const totalItemsCount = getTotalItemsCount();

  // State to track which item has an open custom price edit input
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [customPriceVal, setCustomPriceVal] = useState<string>("");

  const handleStartEditPrice = (productId: string, currentEffectivePrice: number) => {
    setEditingPriceId(productId);
    setCustomPriceVal(currentEffectivePrice.toString());
  };

  const handleSaveCustomPrice = (productId: string) => {
    const val = parseFloat(customPriceVal);
    if (!isNaN(val) && val >= 0) {
      setCustomPrice(productId, val);
    }
    setEditingPriceId(null);
  };

  const handleResetCustomPrice = (productId: string) => {
    setCustomPrice(productId, null);
    setEditingPriceId(null);
  };

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
            const { unitPrice: effectiveUnitPrice, totalPrice: itemSubtotal, matchedTier, freeGifts } = calculateItemLinePrice(item);
            const canIncrease = item.quantity < item.stockQuantity;
            const isBundle = item.productType === 'BUNDLE';
            const isEditingPrice = editingPriceId === item.productId;
            const hasCustomPrice = item.customPrice !== undefined && item.customPrice !== null;

            return (
              <div
                key={item.productId}
                className="flex flex-col gap-2 py-3.5 first:pt-0 last:pb-0"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <p
                        className="truncate text-sm font-semibold text-slate-900"
                        title={item.name}
                      >
                        {item.name}
                      </p>
                      {isBundle && (
                        <span className="text-[10px] font-bold text-purple-700 bg-purple-50 border border-purple-200 px-1.5 py-0.2 rounded">
                          BUNDLE
                        </span>
                      )}
                    </div>

                    {/* Price and Suki / Custom Price controls */}
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      {isEditingPrice ? (
                        <div className="flex items-center gap-1">
                          <span className="text-xs font-mono font-semibold text-slate-500">₱</span>
                          <Input
                            type="number"
                            min={0}
                            step="0.01"
                            value={customPriceVal}
                            onChange={(e) => setCustomPriceVal(e.target.value)}
                            className="h-6 w-20 text-xs font-mono px-1.5 py-0"
                            autoFocus
                          />
                          <button
                            type="button"
                            onClick={() => handleSaveCustomPrice(item.productId)}
                            className="p-1 rounded hover:bg-emerald-50 text-emerald-600"
                            title="Save custom price"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingPriceId(null)}
                            className="p-1 rounded hover:bg-slate-100 text-slate-400"
                            title="Cancel"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs text-slate-500 font-mono">
                            {formatCurrency(effectiveUnitPrice)} each
                          </span>
                          {hasCustomPrice ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded">
                              Suki Price
                              <button
                                type="button"
                                onClick={() => handleResetCustomPrice(item.productId)}
                                className="text-rose-500 hover:text-rose-700 ml-0.5"
                                title="Reset to standard price"
                              >
                                ×
                              </button>
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleStartEditPrice(item.productId, effectiveUnitPrice)}
                              className="text-[11px] text-indigo-600 hover:text-indigo-800 hover:underline flex items-center gap-0.5"
                              title="Set custom suki price"
                            >
                              <Edit3 className="w-2.5 h-2.5" />
                              Custom Price
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Tier Deal Banner */}
                    {matchedTier && !hasCustomPrice && (
                      <div className="mt-1.5 inline-flex items-center gap-1 text-[10px] font-semibold text-blue-700 bg-blue-50/90 border border-blue-200/80 px-2 py-0.5 rounded-md">
                        <Tag className="w-3 h-3 text-blue-600 shrink-0" />
                        <span>
                          Volume Package: {matchedTier.minQuantity}+ units @ {formatCurrency(matchedTier.tierPrice)}
                        </span>
                      </div>
                    )}

                    {/* Free Gifts / Bundle components */}
                    {freeGifts.length > 0 && (
                      <div className="mt-1.5 flex items-center gap-1.5 flex-wrap">
                        {freeGifts.map((gift, gIdx) => (
                          <span
                            key={gIdx}
                            className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-800 bg-amber-50 border border-amber-200/80 px-1.5 py-0.5 rounded"
                          >
                            <Gift className="w-2.5 h-2.5 text-amber-600 shrink-0" />
                            +{gift.quantity}x Free {gift.name}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Quantity controls */}
                    <div className="mt-2.5 inline-flex items-center rounded-lg border border-slate-200 bg-white shadow-xs">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-xs"
                        aria-label="Decrease quantity"
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity - 1)
                        }
                        className="rounded-r-none border-r border-slate-200 text-slate-500 cursor-pointer"
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
                          updateQuantity(item.productId, item.quantity + 1)
                        }
                        className="rounded-l-none border-l border-slate-200 text-slate-500 cursor-pointer"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <p className="text-sm font-bold tabular-nums text-slate-900 font-mono">
                      {formatCurrency(itemSubtotal)}
                    </p>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-xs"
                      aria-label={`Remove ${item.name} from sale`}
                      onClick={() => removeItem(item.productId)}
                      className="text-slate-400 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </FormSection>
  );
};

CartSection.Skeleton = CartSkeleton;

