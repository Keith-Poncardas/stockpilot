import type { Control } from "react-hook-form";
import { useState } from "react";
import { FormSection } from "@/components/ui/form-section";
import { FormField } from "@/components/ui/form-field";
import { VirtualInfiniteList } from "@/components/ui/virtual-infinite-list";
import { PackagePlus, Search } from "lucide-react";
import { useWatch, useController } from "react-hook-form";
import { useLazyQuery } from "@apollo/client";
import { useDebounce } from "@/hooks/useDebounce";
import { GET_PRODUCT } from "@/features/product/operations";
import { ProductSearchResultItem } from "./ProductSearchResultItem";
import { ProductSearchPreview } from "./ProductSearchPreview";
import { useInfiniteProductSearch } from "../../../hooks/useInfiniteProductSearch";

interface ProductSearchSectionProps {
    control: Control<any>;
}

export function ProductSearchSection({ control }: ProductSearchSectionProps) {
    const [isOpen, setIsOpen] = useState(false);

    const { field: productIdField } = useController({ control, name: "productId" });
    const { field: searchField } = useController({ control, name: "searchQuery" });
    const searchTerm = useWatch({ control, name: "searchQuery" });
    const debouncedSearch = useDebounce(searchTerm, 300);

    const [fetchProduct, { data: productData, loading: productLoading }] = useLazyQuery(GET_PRODUCT);
    const product = productData?.getProduct?.productInfo;

    const { items, loading, isFetchingMore, hasNextPage, loadMore } =
        useInfiniteProductSearch(debouncedSearch);

    return (
        <FormSection
            title="Product"
            description="Choose the product you want to adjust."
            icon={<PackagePlus className="h-4 w-4" strokeWidth={2} />}
            iconWrapperClassName="bg-indigo-50 text-indigo-600"
        >
            <div
                className="mt-3 relative"
                onFocus={() => setIsOpen(true)}
                onBlur={(e) => {
                    if (!e.currentTarget.contains(e.relatedTarget)) setIsOpen(false);
                }}
            >
                {/* Hidden input so productId participates in form validation */}
                <input type="hidden" value={productIdField.value} name={productIdField.name} />

                <FormField
                    control={control}
                    name="searchQuery"
                    label="Select product"
                    required
                    placeholder="Search by product name or SKU…"
                    icon={<Search className="h-5 w-4 text-ink/40" />}
                    isLoading={loading || productLoading}
                />

                {isOpen && (
                    <VirtualInfiniteList
                        items={items}
                        loading={loading}
                        isFetchingMore={isFetchingMore}
                        hasNextPage={hasNextPage}
                        onLoadMore={loadMore}
                        emptyMessage="No products match your search."
                        aria-label="Product search results"
                        renderItem={(product) => (
                            <ProductSearchResultItem
                                product={product}
                                onSelect={(selectedProduct) => {
                                    productIdField.onChange(selectedProduct.id);
                                    searchField.onChange(selectedProduct.name);
                                    fetchProduct({ variables: { productId: selectedProduct.id } });
                                    setIsOpen(false);
                                }}
                            />
                        )}
                    />
                )}
            </div>

            {!productIdField.value || !product ? (
                <div className="mt-4 rounded-lg border border-dashed border-hairline p-4 text-sm text-foreground/50">
                    No product selected yet — search above to add one to this record.
                </div>
            ) : (
                <ProductSearchPreview
                    product={product}
                    onClear={() => {
                        productIdField.onChange("");
                        searchField.onChange("");
                    }}
                />
            )}
        </FormSection>
    );
}
