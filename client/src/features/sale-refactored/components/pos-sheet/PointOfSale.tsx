import { useState, useCallback } from "react";
import { PointOfSaleLayout } from "./layout";
import {
    CustomerSearchSection,
    ProductCatalogGrid,
    CartSection,
    PaymentActionsSection,
} from "./sections";
import { useCart } from "./sections/cart/hook";
import { usePOS, usePOSSheet } from "./hooks";
import type { SelectedCustomer } from "./sections/customer-search/types";

export function PointOfSale() {
    // --- STATE ---
    const [customer, setCustomer] = useState<SelectedCustomer | null>(null);

    const [paymentMethod, setPaymentMethod] = useState<string>("CASH");
    const [validationError, setValidationError] = useState<string | null>(null);

    const { products, customers, sale } = usePOS();
    const { onClose } = usePOSSheet();

    // --- CART STATE ---
    const { getSubtotal, getTotalItemsCount, clearCart, items } = useCart();
    const totalItemsCount = getTotalItemsCount();
    const subtotal = getSubtotal();
    const totalDue = subtotal; // Assuming no tax/discount for now

    const handleCompleteSale = useCallback(async () => {
        await sale.handleCompleteSale({
            items,
            customerId: customer?.id,
            paymentMethod,
            onValidationFailed: setValidationError,
            onSuccess: () => {
                clearCart();
                setCustomer(null);
                onClose();
            }
        });
    }, [items, customer, paymentMethod, sale.handleCompleteSale, clearCart, onClose]);

    return (
        <PointOfSaleLayout
            customerSearch={
                <CustomerSearchSection
                    selectedCustomer={customer}
                    onSelectCustomer={setCustomer}
                    customers={customers.customers}
                    loading={customers.loading}
                    isFetchingMore={customers.isFetchingMore}
                    hasNextPage={customers.hasMore}
                    onLoadMore={customers.loadMore}
                    searchTerm={customers.searchTerm}
                    onSearchTermChange={customers.setSearchTerm}
                />
            }
            productCatalog={
                <ProductCatalogGrid
                    products={products.inventories}
                    loading={products.loading}
                    totalItems={products.meta?.totalItems ?? 0}
                    searchTerm={products.searchTerm}
                    onSearchTermChange={products.setSearchTerm}
                />
            }
            cart={
                <CartSection />
            }
            paymentActions={
                <PaymentActionsSection
                    paymentMethod={paymentMethod}
                    onSelectPaymentMethod={setPaymentMethod}
                    subtotal={subtotal}
                    totalDue={totalDue}
                    totalItemsCount={totalItemsCount}
                    onCompleteSale={handleCompleteSale}
                    isSubmitting={sale.isSubmitting}
                    validationError={validationError}
                />
            }
        />
    );
}
