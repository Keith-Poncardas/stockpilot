import type { ProductDetailsLayoutProps } from "./types";

/**
 * Layout component for the product details section.
 * Provides a consistent structure for rendering the product identity row and pricing grid,
 * allowing reuse between the main content and skeleton loader.
 *
 * @param {ProductDetailsLayoutProps} props - The properties for the layout component.
 * @param {import("react").ReactNode} props.identityRow - The content to render in the product identity row (e.g., icon, name, sku, status).
 * @param {import("react").ReactNode} props.pricingGrid - The content to render in the pricing grid (e.g., unit price, cost price).
 * @returns {JSX.Element} The rendered layout component.
 */
export function ProductDetailsLayout({
    identityRow,
    pricingGrid
}: ProductDetailsLayoutProps) {
    return (
        <>
            {/* Product identity row */}
            <div className="flex items-center justify-between gap-4 mb-5">
                {identityRow}
            </div>

            {/* Pricing grid */}
            <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-4">
                {pricingGrid}
            </div>
        </>
    );
};
