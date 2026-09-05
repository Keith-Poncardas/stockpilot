import type { ProductDetailsLayoutProps } from "./types";

export function ProductDetailsLayout({
    identityRow,
    pricingGrid
}: ProductDetailsLayoutProps) {
    return (
        <>
            <div className="flex items-center justify-between gap-4 mb-5">
                {identityRow}
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-4">
                {pricingGrid}
            </div>
        </>
    );
}
