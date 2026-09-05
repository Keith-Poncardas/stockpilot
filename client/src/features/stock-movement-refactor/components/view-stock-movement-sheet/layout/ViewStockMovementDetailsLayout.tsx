import type { ReactNode } from "react";

export interface ViewStockMovementDetailsLayoutProps {
    movementSummary: ReactNode;
    inventoryValueImpact: ReactNode;
    productDetails: ReactNode;
    performedBy: ReactNode;
    inventoryHealth: ReactNode;
    recordInfo: ReactNode;
    actions?: ReactNode;
}

export function ViewStockMovementDetailsLayout({
    movementSummary,
    inventoryValueImpact,
    productDetails,
    performedBy,
    inventoryHealth,
    recordInfo,
    actions,
}: ViewStockMovementDetailsLayoutProps) {
    return (
        <div className="flex flex-col min-h-0 h-full">
            <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 bg-slate-50/50">
                <div className="flex flex-col lg:flex-row gap-6 items-start w-full">
                    {/* Left Column */}
                    <div className="flex-1 flex flex-col gap-6 min-w-0 w-full">
                        {movementSummary}
                        {inventoryValueImpact}
                        {productDetails}
                    </div>

                    {/* Right Column */}
                    <div className="flex flex-col gap-6 w-full lg:w-80 xl:w-96 shrink-0">
                        {performedBy}
                        {inventoryHealth}
                        {recordInfo}
                    </div>
                </div>
            </div>

            {actions && (
                <div className="px-4 sm:px-6 py-4 border-t border-slate-200 bg-white flex items-center justify-end gap-3 sticky bottom-0 z-10 shrink-0">
                    {actions}
                </div>
            )}
        </div>
    );
}
