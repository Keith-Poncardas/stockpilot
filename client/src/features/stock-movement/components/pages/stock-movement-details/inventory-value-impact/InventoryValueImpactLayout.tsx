import type { InventoryValueImpactLayoutProps } from "./types";

/**
 * Layout component for the inventory value impact section.
 * Provides a 3-column grid structure to display cost per unit, quantity, and total value.
 *
 * @param {InventoryValueImpactLayoutProps} props - The layout properties.
 * @param {import("react").ReactNode} props.costPerUnitContent - Content to render in the cost per unit column.
 * @param {import("react").ReactNode} props.quantityContent - Content to render in the quantity column.
 * @param {import("react").ReactNode} props.totalValueContent - Content to render in the total value column.
 * @returns {JSX.Element} The rendered layout component.
 */
export function InventoryValueImpactLayout({
    costPerUnitContent,
    quantityContent,
    totalValueContent
}: InventoryValueImpactLayoutProps) {
    return (
        <div className="grid grid-cols-3 divide-x divide-slate-100">
            <div className="pr-4">
                {costPerUnitContent}
            </div>
            <div className="px-4">
                {quantityContent}
            </div>
            <div className="pl-4">
                {totalValueContent}
            </div>
        </div>
    );
};
