import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { getOptimizedImageUrl } from "@/lib/cloudinary";

import type { ProductCardProps } from "../types";
import { ProductCardSkeleton } from "../skeleton/ProductCatalogSkeleton";

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const initials = product.name
    .split(" ")
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  const qty = product.quantityOnHand ?? 0;
  const reorder = product.reorderLevel ?? 0;
  const isOutOfStock = qty <= 0;
  const isLowStock = !isOutOfStock && (qty <= reorder || qty <= 10);
  const isBundle = product.productType === 'BUNDLE';
  const hasBundles = product.bundleItems && product.bundleItems.length > 0;
  const hasTiers = product.pricingTiers && product.pricingTiers.length > 0;

  return (
    <div
      className={`flex flex-col h-full rounded-xl border p-3.5 transition ${isOutOfStock
        ? "opacity-60 bg-slate-50/50 border-slate-200"
        : "hover:border-indigo-300 hover:shadow-sm bg-white border-slate-200"
        }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-sm font-semibold text-slate-500 overflow-hidden shrink-0">
          {product.imageUrl ? (
            <img
              src={getOptimizedImageUrl(product.imageUrl, { width: 72, height: 72, crop: 'fill' })}
              alt={product.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            initials
          )}
        </div>
        {isBundle ? (
          <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded border border-purple-200">
            BUNDLE
          </span>
        ) : hasTiers ? (
          <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
            Deals
          </span>
        ) : hasBundles ? (
          <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
            +Free Item
          </span>
        ) : null}
      </div>

      <p
        className="mt-2.5 line-clamp-2 text-sm font-medium text-slate-900"
        title={product.name}
      >
        {product.name}
      </p>
      <p className="text-xs text-slate-400 mt-0.5">
        SKU: {product.sku}
      </p>

      <div className="mt-2.5 flex items-center gap-1.5 text-xs min-w-0">
        {isOutOfStock ? (
          <>
            <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
            <span className="font-medium text-red-600">Out of stock</span>
          </>
        ) : isLowStock ? (
          <>
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            <span className="font-medium text-amber-600 truncate">
              {qty} left · Low stock
            </span>
          </>
        ) : (
          <>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span className="font-medium text-emerald-600 truncate">
              {qty} in stock
            </span>
          </>
        )}
      </div>

      <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-3.5 gap-2">
        <div className="flex flex-col min-w-0">
          {product.regularPrice && product.regularPrice > product.unitPrice && (
            <span className="text-[10px] font-medium text-slate-400 line-through font-mono">
              {formatCurrency(product.regularPrice)}
            </span>
          )}
          <span className="text-sm font-semibold text-slate-900 truncate">
            {formatCurrency(product.unitPrice)}
          </span>
        </div>

        <Button
          type="button"
          size="xs"
          className="shrink-0"
          variant={isOutOfStock ? "outline" : "default"}
          disabled={isOutOfStock}
          onClick={() =>
            onAddToCart({
              id: product.id,
              sku: product.sku,
              name: product.name,
              unitPrice: product.unitPrice,
              regularPrice: product.regularPrice,
              productType: product.productType,
              quantityOnHand: qty,
              bundleItems: product.bundleItems,
              pricingTiers: product.pricingTiers,
            })
          }
        >
          {isOutOfStock ? (
            "Unavailable"
          ) : (
            <>
              <Plus className="h-3.5 w-3.5" />
              Add
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

ProductCard.skeleton = ProductCardSkeleton;
ProductCard.Skeleton = ProductCardSkeleton;
