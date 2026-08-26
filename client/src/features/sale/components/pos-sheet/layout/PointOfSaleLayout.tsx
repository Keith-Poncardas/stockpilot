import React from "react";

interface PointOfSaleLayoutProps {
    customerSearch: React.ReactNode;
    productCatalog: React.ReactNode;
    cart: React.ReactNode;
    paymentActions: React.ReactNode;
}

export function PointOfSaleLayout({
    customerSearch,
    productCatalog,
    cart,
    paymentActions,
}: PointOfSaleLayoutProps) {
    return (
        <div className="flex flex-col h-full w-full">
            {/* Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6 no-scrollbar">
                {customerSearch}
                {productCatalog}
                {cart}
            </div>

            {/* Fixed Bottom Area */}
            <div className="sticky bottom-0 z-20 bg-white dark:bg-slate-950 p-4 border-t border-slate-200 dark:border-slate-800 shadow-[0_-4px_12px_rgba(0,0,0,0.06)]">
                {paymentActions}
            </div>
        </div>
    );
}
