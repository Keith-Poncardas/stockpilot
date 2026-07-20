import type { Control } from "react-hook-form";
import { FormSection } from "@/components/ui/form-section";
import { FormField } from "@/components/ui/form-field";
import { PackagePlus, Search } from "lucide-react";
import { useWatch, useController } from "react-hook-form";
import { useQuery, useLazyQuery } from "@apollo/client";
import { useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { SEARCH_INVENTORY_PRODUCTS } from "@/features/inventory/operations";
import { GET_PRODUCT } from "@/features/product/operations";
import { ProductSearchResultItem } from "./ProductSearchResultItem";
import { ProductSearchPreview } from "./ProductSearchPreview";

interface ProductSearchSectionProps {
    control: Control<any>;
}

export function ProductSearchSection({ control }: ProductSearchSectionProps) {
    const [isOpen, setIsOpen] = useState(false);

    const { field: productIdField } = useController({ control, name: "productId" });
    const { field: searchField } = useController({ control, name: "searchQuery" });
    const searchTerm = useWatch({ control, name: "searchQuery" });
    const debouncedSearch = useDebounce(searchTerm, 300);

    const { data, loading } = useQuery(SEARCH_INVENTORY_PRODUCTS, {
        variables: { search: debouncedSearch },
        fetchPolicy: "network-only"
    });

    const [fetchProduct, { data: productData, loading: productLoading }] = useLazyQuery(GET_PRODUCT);

    const products = data?.searchInventoryProducts || [];
    const product = productData?.getProduct?.productInfo;

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
                {/* Hidden input to ensure productId is technically rendered for required validation, though FormField might handle it if it was bound */}
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
                    <ul
                        className="absolute z-30 mt-1.5 max-h-72 w-full overflow-auto rounded-lg border border-hairline bg-white py-1 shadow-lg shadow-ink/10"
                    >
                        {loading && (
                            <li className="px-3.5 py-3 text-sm text-ink/40">Loading...</li>
                        )}
                        {!loading && products.length === 0 && (
                            <li className="px-3.5 py-3 text-sm text-ink/40">No products match your search.</li>
                        )}
                        {!loading && products.map((p: any) => (
                            <ProductSearchResultItem
                                key={p.id}
                                product={p}
                                onSelect={(selectedProduct) => {
                                    productIdField.onChange(selectedProduct.id);
                                    searchField.onChange(selectedProduct.name);
                                    fetchProduct({ variables: { productId: selectedProduct.id } });
                                    setIsOpen(false);
                                }}
                            />
                        ))}
                    </ul>
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
