import { useState, useCallback } from "react";
import { PointOfSaleLayout } from "./layout";
import {
    CustomerSearchSection,
    ProductCatalogGrid,
    CartSection,
    PaymentActionsSection,
} from "./sections";
import { toast } from "sonner";
import { useCart } from "./sections/cart/hook/useCart";
import { useCreateSaleMutation, usePOSProducts, usePOSCustomers } from "./hooks/usePOSApi";

export function PointOfSale() {
    // --- STATE ---
    const [customer, setCustomer] = useState<any>(null);

    const [paymentMethod, setPaymentMethod] = useState<string>("CASH");
    const [validationError, setValidationError] = useState<string | null>(null);

    const { createSale, isSubmitting } = useCreateSaleMutation();

    // --- API DATA ---
    const { 
        products, 
        loading: loadingProducts, 
        meta: productsMeta, 
        searchTerm: productSearchTerm, 
        setSearchTerm: setProductSearchTerm 
    } = usePOSProducts(50);
    
    const { 
        customers, 
        loading: loadingCustomers, 
        meta: customersMeta, 
        searchTerm: customerSearchTerm, 
        setSearchTerm: setCustomerSearchTerm, 
        loadMore: loadMoreCustomers 
    } = usePOSCustomers();

    // --- CART STATE ---
    const { getSubtotal, getTotalItemsCount, clearCart, items } = useCart();
    const totalItemsCount = getTotalItemsCount();
    const subtotal = getSubtotal();
    const totalDue = subtotal; // Assuming no tax/discount for now

    const handleCompleteSale = useCallback(async () => {
        if (items.length === 0) {
            setValidationError("Cart is empty. Please add items.");
            return;
        }

        setValidationError(null);

        try {
            await createSale({
                customerId: customer?.id || null,
                paymentMethod,
                status: "COMPLETED",
                items: items.map(item => ({
                    productId: item.productId,
                    quantity: item.quantity,
                    unitPrice: item.unitPrice,
                })),
            });
            toast.success("Sale completed successfully!");
            clearCart();
            setCustomer(null);
        } catch (error: any) {
            toast.error(error.message || "Failed to complete sale.");
        }
    }, [items, customer, paymentMethod, createSale, clearCart]);

    return (
        <PointOfSaleLayout
            customerSearch={
                <CustomerSearchSection
                    selectedCustomer={customer}
                    onSelectCustomer={setCustomer}
                    customers={customers}
                    loading={loadingCustomers}
                    hasNextPage={customersMeta?.hasNextPage ?? false}
                    onLoadMore={loadMoreCustomers}
                    searchTerm={customerSearchTerm}
                    onSearchTermChange={setCustomerSearchTerm}
                />
            }
            productCatalog={
                <ProductCatalogGrid 
                    products={products}
                    loading={loadingProducts}
                    totalItems={productsMeta?.totalItems ?? 0}
                    searchTerm={productSearchTerm}
                    onSearchTermChange={setProductSearchTerm}
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
                    isSubmitting={isSubmitting}
                    validationError={validationError}
                />
            }
        />
    );
}
