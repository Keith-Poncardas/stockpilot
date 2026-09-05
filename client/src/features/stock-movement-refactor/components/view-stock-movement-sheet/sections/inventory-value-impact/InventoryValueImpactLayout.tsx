import type { InventoryValueImpactLayoutProps } from "./types";

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
}
