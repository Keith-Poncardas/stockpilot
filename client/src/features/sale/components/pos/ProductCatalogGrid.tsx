import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { GET_POS_PRODUCTS } from "../../operations/op.queries";
import { FormSection } from "@/components/ui/form-section";
import { Input } from "@/components/ui/input";
import { SimplePagination } from "@/components/ui/simple-pagination";
import { useDebounce } from "@/hooks/useDebounce";
import { Search, X, Package } from "lucide-react";
import { ProductCard } from "./ProductCard";

const PAGE_SIZE = 7;

interface PosProduct {
  id: string;
  sku: string;
  name: string;
  unitPrice: number;
  quantityOnHand: number;
  reorderLevel: number;
  status: string;
}

interface InventoryRow {
  id: string;
  productId: string;
  quantityOnHand?: number;
  reorderLevel?: number;
  product?: {
    id: string;
    sku: string;
    name: string;
    unitPrice: number;
    status: string;
  };
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
      input: {
        page: currentPage,
        limit: PAGE_SIZE,
        filter: {
          search: debouncedSearch || undefined,
        },
      },
    },
    fetchPolicy: "cache-and-network",
  });

  const rawInventories: InventoryRow[] = data?.getInventories?.data ?? [];
  const products: PosProduct[] = rawInventories
    .filter((inv) => inv?.product && inv.product.status === "ACTIVE")
    .map((inv) => ({
      id: inv.productId || inv.product?.id || inv.id,
      sku: inv.product?.sku ?? "",
      name: inv.product?.name ?? "",
      unitPrice: Number(inv.product?.unitPrice ?? 0),
      quantityOnHand: inv.quantityOnHand ?? 0,
      reorderLevel: inv.reorderLevel ?? 0,
      status: inv.product?.status ?? "",
    }));

  const meta = data?.getInventories?.meta;
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

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {Array.from({ length: 6 }).map((_, idx) => (
              <ProductCard.skeleton key={idx} />
            ))}
          </div>
        )}

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
        {!loading && products.length > 0 && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
              />
            ))}
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
