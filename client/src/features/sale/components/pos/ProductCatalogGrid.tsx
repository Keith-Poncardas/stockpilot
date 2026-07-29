import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { GET_POS_PRODUCTS } from "../../operations/op.queries";
import { FormSection } from "@/components/ui/form-section";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SimplePagination } from "@/components/ui/simple-pagination";
import { useDebounce } from "@/hooks/useDebounce";
import { Search, X, Plus, Package } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

const PAGE_SIZE = 6;

interface PosProduct {
  id: string;
  sku: string;
  name: string;
  unitPrice: number;
  quantityOnHand: number;
  reorderLevel: number;
  status: string;
}

interface ProductCatalogGridProps {
  onAddToCart: (product: {
    id: string;
    sku: string;
    name: string;
    unitPrice: number;
    quantityOnHand: number;
  }) => void;
}

export const ProductCatalogGrid: React.FC<ProductCatalogGridProps> = ({
  onAddToCart,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 300);
  const [currentPage, setCurrentPage] = useState(1);

  // Reset to page 1 whenever the search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch]);

  const { data, loading, error } = useQuery(GET_POS_PRODUCTS, {
    variables: {
      args: {
        page: currentPage,
        limit: PAGE_SIZE,
        filter: {
          search: debouncedSearch,
          status: "ACTIVE",
        },
      },
    },
    fetchPolicy: "cache-and-network",
  });

  const products: PosProduct[] = data?.getProducts?.data ?? [];
  const meta = data?.getProducts?.meta;
  const totalPages: number = meta?.totalPages ?? 1;
  const totalItems: number = meta?.totalItems ?? 0;

  function handleClearSearch() {
    setSearchTerm("");
    setCurrentPage(1);
  }

  return (
    <FormSection
      title="Products"
      description="Select products to add to the cart."
      icon={<Package className="h-4.5 w-4.5" strokeWidth={2} />}
      iconWrapperClassName="bg-indigo-50 text-indigo-600"
      actions={
        loading ? (
          <span className="text-xs text-slate-400">Loading…</span>
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
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by product name or SKU..."
            icon={<Search className="h-4 w-4" />}
          />
          {searchTerm && (
            <button
              type="button"
              onClick={handleClearSearch}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Error State */}
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-center">
            <p className="text-sm font-medium text-red-700">
              Failed to load products. Please refresh.
            </p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && products.length === 0 && (
          <div className="rounded-xl border border-dashed border-slate-200 px-4 py-10 text-center">
            <p className="text-sm font-medium text-slate-600">
              No products match your search.
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Try searching for a different SKU or product name.
            </p>
          </div>
        )}

        {/* Product Grid */}
        {products.length > 0 && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {products.map((product) => {
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
                  key={product.id}
                  className={`flex flex-col rounded-xl border p-3.5 transition ${isOutOfStock
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
            })}
          </div>
        )}

        {/* Pagination */}
        <SimplePagination
          page={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </FormSection>
  );
};
