import { formatCurrency } from "@/lib/utils";

interface ProductSearchResultItemProps {
    product: any;
    onSelect: (product: any) => void;
}

export function ProductSearchResultItem({ product: p, onSelect }: ProductSearchResultItemProps) {
    return (
        <li
            role="option"
            aria-disabled={p.isAddedInventory}
            onMouseDown={(e) => {
                e.preventDefault();
                if (p.isAddedInventory) return;
                onSelect(p);
            }}
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
    );
}
