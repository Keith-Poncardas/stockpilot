import { useState } from 'react';
import type { Control } from 'react-hook-form';
import { FormSection } from '@/components/ui/form-section';
import { FormField } from '@/components/ui/form-field';
import { VirtualInfiniteList } from '@/components/ui/virtual-infinite-list';
import { PackagePlus, Search } from 'lucide-react';
import { useWatch, useController } from 'react-hook-form';
import { useLazyQuery } from '@apollo/client';
import { useDebounce } from '@/hooks/useDebounce';
import { GET_PRODUCT } from '@/features/product';
import { cn } from '@/lib/utils';
import { ProductSearchResultItem } from './ProductSearchResultItem';
import { ProductSearchPreview } from './ProductSearchPreview';
import { useInfiniteProductSearch } from '@/features/product';
import type { InventoryRecordFormValues } from '@/features/inventory/types';

interface ProductSearchSectionProps {
    control: Control<InventoryRecordFormValues>;
}

export function ProductSearchSection({ control }: ProductSearchSectionProps) {
    const [isOpen, setIsOpen] = useState(false);

    const { field: productIdField } = useController({ control, name: 'productId' });
    const { field: searchField } = useController({ control, name: 'searchQuery' });
    const searchTerm = useWatch({ control, name: 'searchQuery' });
    const debouncedSearch = useDebounce(searchTerm || '', 300);

    const [fetchProduct, { data: productData, loading: productLoading }] = useLazyQuery(GET_PRODUCT);
    const product = productData?.getProduct;

    const { items, loading, isFetchingMore, hasNextPage, loadMore } =
        useInfiniteProductSearch(debouncedSearch, { hasInventory: false });

    return (
        <FormSection
            title="Product Selection"
            description="Choose the product catalog item to create an inventory record for."
            icon={<PackagePlus className="h-4 w-4" strokeWidth={2} />}
            iconWrapperClassName="bg-indigo-50 text-indigo-600"
            className={cn("overflow-visible relative", isOpen ? "z-30" : "z-20")}
        >
            <div
                className="mt-3 relative z-30"
                onFocus={() => setIsOpen(true)}
                onClick={() => setIsOpen(true)}
                onBlur={(e) => {
                    if (!e.currentTarget.contains(e.relatedTarget)) setIsOpen(false);
                }}
            >
                <input type="hidden" value={productIdField.value} name={productIdField.name} />

                <FormField
                    control={control}
                    name="searchQuery"
                    label="Select product"
                    required
                    placeholder="Search catalog by product name or SKU…"
                    icon={<Search className="h-5 w-4 text-slate-400" />}
                    isLoading={loading || productLoading}
                />

                {isOpen && (
                    <VirtualInfiniteList
                        items={items}
                        loading={loading}
                        isFetchingMore={isFetchingMore}
                        hasNextPage={hasNextPage}
                        onLoadMore={loadMore}
                        estimateSize={58}
                        maxHeight="18rem"
                        className="z-50 shadow-2xl border border-slate-200 rounded-xl bg-white"
                        emptyMessage="No products match your search."
                        aria-label="Product search results"
                        renderItem={(p) => (
                            <ProductSearchResultItem
                                product={p}
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
                <div className="mt-4 rounded-xl border border-dashed border-slate-300 p-4 text-xs text-slate-500 bg-slate-50/50">
                    No product selected yet. Search above and select a product to configure its inventory.
                </div>
            ) : (
                <ProductSearchPreview
                    product={product}
                    onClear={() => {
                        productIdField.onChange('');
                        searchField.onChange('');
                    }}
                />
            )}
        </FormSection>
    );
}
