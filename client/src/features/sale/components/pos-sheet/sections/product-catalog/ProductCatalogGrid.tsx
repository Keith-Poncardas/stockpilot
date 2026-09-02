import { FormSection } from "@/components/ui/form-section";
import { Package, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";

import type { IInventory } from "@/features/inventory/inventory.types";
import type { PosProductItem } from "./types";
import { ProductCard } from "./components/ProductCard";
import { ProductCatalogSkeleton } from "./skeleton/ProductCatalogSkeleton";

import { useCart } from "../cart/hook/useCart";

export interface ProductCatalogGridProps {
  products: IInventory[];
  loading: boolean;
  totalItems: number;
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
}

export const ProductCatalogGrid = ({
  products,
  loading,
  totalItems,
  searchTerm,
  onSearchTermChange,
}: ProductCatalogGridProps) => {
  const addItem = useCart((state) => state.addItem);

  function handleClearSearch() {
    onSearchTermChange("");
  }

  return (
    <FormSection
      title="Products"
      description="Select products to add to the cart."
      icon={<Package className="h-4.5 w-4.5" strokeWidth={2} />}
      iconWrapperClassName="bg-indigo-50 text-indigo-600"
      actions={
        loading ? (
          <span className="text-xs text-slate-400">Loading...</span>
        ) : totalItems > 0 ? (
          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
            {totalItems} products
          </span>
        ) : null
      }
    >
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Input
            id="product-search"
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchTermChange(e.target.value)}
            placeholder="Search by product name or SKU..."
            icon={<Search className="h-4 w-4" />}
          />
          {searchTerm && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 6 }).map((_, idx) => (
              <ProductCard.skeleton key={idx} />
            ))}
          </div>
        )}

        {/* Product Grid */}
        {!loading && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((inv: IInventory) => {
              const prod = inv.product as any;
              const flatProduct: PosProductItem = {
                id: inv.productId || prod?.id || inv.id,
                sku: prod?.sku ?? "",
                name: prod?.name ?? "Unknown Product",
                unitPrice: Number(prod?.unitPrice ?? 0),
                regularPrice: prod?.regularPrice ? Number(prod.regularPrice) : null,
                productType: prod?.productType,
                quantityOnHand: inv.quantityOnHand ?? 0,
                reorderLevel: inv.reorderLevel ?? 0,
                status: prod?.status ?? "",
                bundleItems: prod?.bundleItems,
                pricingTiers: prod?.pricingTiers,
              };

              return (
                <ProductCard
                  key={flatProduct.id}
                  product={flatProduct}
                  onAddToCart={(p) => {
                    addItem({
                      productId: p.id,
                      name: p.name,
                      sku: p.sku,
                      unitPrice: p.unitPrice,
                      regularPrice: p.regularPrice,
                      productType: p.productType,
                      stockQuantity: p.quantityOnHand || 0,
                      bundleItems: p.bundleItems,
                      pricingTiers: p.pricingTiers,
                    });
                  }}
                />
              );
            })}
          </div>
        )}

        {!loading && totalItems === 0 && (
          <div className="py-12 text-center">
            <Package className="mx-auto h-8 w-8 text-slate-300" />
            <h3 className="mt-2 text-sm font-semibold text-slate-900">
              No products found
            </h3>
            <p className="text-sm text-slate-500">
              Try adjusting your search terms.
            </p>
          </div>
        )}
      </div>
    </FormSection>
  );
};

ProductCatalogGrid.Skeleton = ProductCatalogSkeleton;
