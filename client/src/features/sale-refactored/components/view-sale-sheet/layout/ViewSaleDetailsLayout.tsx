import type { ReactNode } from "react";

export interface ViewSaleDetailsLayoutProps {
    transactionSummary: ReactNode;
    cashierInfo: ReactNode;
    customerInfo: ReactNode;
    purchasedItems: ReactNode;
    actions?: ReactNode;
}

export function ViewSaleDetailsLayout({
    transactionSummary,
    cashierInfo,
    customerInfo,
    purchasedItems,
    actions,
}: ViewSaleDetailsLayoutProps) {
    return (
        <div className="flex flex-col h-full w-full">
            <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {transactionSummary}
                    {cashierInfo}
                </div>

                {customerInfo}
                {purchasedItems}
            </div>

            {actions && (
                <div className="sticky bottom-0 z-20 bg-white dark:bg-slate-950 p-4 border-t border-slate-200 dark:border-slate-800 flex gap-3 shadow-[0_-4px_12px_rgba(0,0,0,0.06)]">
                    {actions}
                </div>
            )}
        </div>
    );
}
