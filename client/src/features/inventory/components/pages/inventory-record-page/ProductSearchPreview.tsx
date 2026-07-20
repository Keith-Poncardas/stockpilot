import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/StatusBadge";
import { X } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface ProductSearchPreviewProps {
    product: any;
    onClear: () => void;
}

export function ProductSearchPreview({ product, onClear }: ProductSearchPreviewProps) {
    if (!product) return null;

    return (
        <div className="mt-4 rounded-lg border border-hairline bg-[#F5F6F2]/70 p-4">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <p
                        id="detail-name"
                        className="font-semibold text-ink leading-snug truncate"
                    >
                        {product.name}
                    </p>
                    <p id="detail-sku" className="font-mono text-xs mt-0.5 text-foreground/60">
                        {product.sku}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <StatusBadge value={product.status} className="shrink-0" />
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={onClear}
                        aria-label="Remove selected product"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            </div>
            <p className="mt-2 text-sm text-ink/60">
                {product.description || "No description available."}
            </p>
            <dl className="mt-3 grid grid-cols-2 gap-3 border-t border-hairline pt-3">
                <div>
                    <dt className="text-xs text-foreground/60">Unit price</dt>
                    <dd className="font-mono text-sm text-ink mt-0.5">
                        {formatCurrency(product.unitPrice)}
                    </dd>
                </div>
                <div>
                    <dt className="text-xs text-foreground/60">Cost price</dt>
                    <dd className="font-mono text-sm text-ink mt-0.5">
                        {formatCurrency(product.costPrice)}
                    </dd>
                </div>
            </dl>
        </div>
    );
}
