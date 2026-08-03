import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

export interface PosProductItem {
  id: string;
  sku: string;
  name: string;
  unitPrice: number;
  quantityOnHand?: number;
  reorderLevel?: number;
  status?: string;
}

export interface ProductCardProps {
  product: PosProductItem;
  onAddToCart: (product: {
    id: string;
    sku: string;
    name: string;
    unitPrice: number;
    quantityOnHand: number;
  }) => void;
}

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col rounded-xl border border-slate-200 bg-white p-3.5">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 animate-pulse" />
      <div className="mt-2.5 h-4 w-3/4 rounded-md bg-slate-100 animate-pulse" />
      <div className="mt-1 h-3 w-1/2 rounded-md bg-slate-100 animate-pulse" />
      <div className="mt-2.5 h-3.5 w-24 rounded-md bg-slate-100 animate-pulse" />
      <div className="mt-3.5 flex items-center justify-between border-t border-slate-100 pt-2.5">
        <div className="h-4 w-16 rounded-md bg-slate-100 animate-pulse" />
        <div className="h-7 w-14 rounded-md bg-slate-100 animate-pulse" />
      </div>
    </div>
  );
}

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

  return (
    <div
      className={`flex flex-col rounded-xl border p-3.5 transition ${
        isOutOfStock
          ? "opacity-60 bg-slate-50/50 border-slate-200"
          : "hover:border-indigo-300 hover:shadow-sm bg-white border-slate-200"
      }`}
    >
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-sm font-semibold text-slate-500">
        {initials}
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

      <div className="mt-2.5 flex items-center gap-1.5 text-xs">
        {isOutOfStock ? (
          <>
            <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
            <span className="font-medium text-red-600">Out of stock</span>
          </>
        ) : isLowStock ? (
          <>
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            <span className="font-medium text-amber-600">
              {qty} left · Low stock
            </span>
          </>
        ) : (
          <>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span className="font-medium text-emerald-600">
              {qty} in stock
            </span>
          </>
        )}
      </div>

      <div className="mt-3.5 flex items-center justify-between border-t border-slate-100 pt-2.5">
        <span className="text-sm font-semibold text-slate-900">
          {formatCurrency(product.unitPrice)}
        </span>

        <Button
          type="button"
          size="xs"
          variant={isOutOfStock ? "outline" : "default"}
          disabled={isOutOfStock}
          onClick={() =>
            onAddToCart({
              id: product.id,
              sku: product.sku,
              name: product.name,
              unitPrice: product.unitPrice,
              quantityOnHand: qty,
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
