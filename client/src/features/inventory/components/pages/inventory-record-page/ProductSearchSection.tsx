import type { Control } from "react-hook-form";
import { FormSection } from "@/components/ui/form-section";
import { FormField } from "@/components/ui/form-field";
import { PackagePlus, Search } from "lucide-react";
import { useWatch } from "react-hook-form";
import { useQuery } from "@apollo/client";
import { useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { SEARCH_INVENTORY_PRODUCTS } from "@/features/inventory/operations";
import { formatCurrency } from "@/lib/utils";

interface ProductSearchSectionProps {
    control: Control<any>;
}

export function ProductSearchSection({ control }: ProductSearchSectionProps) {
    const [isOpen, setIsOpen] = useState(false);

    const searchTerm = useWatch({ control, name: "productId" });
    const debouncedSearch = useDebounce(searchTerm, 300);

    const { data, loading } = useQuery(SEARCH_INVENTORY_PRODUCTS, {
        variables: { search: debouncedSearch },
        fetchPolicy: "network-only"
    });

    const products = data?.searchInventoryProducts || [];

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
                <FormField
                    control={control}
                    name="productId"
                    label="Select product"
                    required
                    placeholder="Search by product name or SKU…"
                    icon={<Search className="h-5 w-4 text-ink/40" />}
                    isLoading={loading}
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
                            <li
                                key={p.id}
                                role="option"
                                aria-disabled={p.isAddedInventory}
                                className={`flex items-center justify-between gap-3 px-3.5 py-2.5 ${p.isAddedInventory ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:bg-paper'
                                    }`}
                            >
                                <div className="min-w-0">
                                    <p className="text-sm font-medium text-ink truncate">{p.name}</p>
                                    <p className="font-mono text-xs text-ink/45 text-foreground/60">{p.sku}</p>
                                </div>
                                {p.isAddedInventory ? (
                                    <span className="shrink-0 font-mono text-[10px] uppercase tracking-wide text-ink/40 border border-hairline rounded px-1.5 py-0.5">In inventory</span>
                                ) : (
                                    <span className="shrink-0 font-mono text-xs text-ink/45">{formatCurrency(p.unitPrice)}</span>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div className="mt-4 rounded-lg border border-dashed border-hairline p-4 text-sm text-foreground/50">
                No product selected yet — search above to add one to this record.
            </div>
        </FormSection>
    );
}
