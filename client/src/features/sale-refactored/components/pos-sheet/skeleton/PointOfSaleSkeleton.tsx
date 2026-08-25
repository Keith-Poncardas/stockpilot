import { PointOfSaleLayout } from "../layout";
import { CustomerSearchSection, ProductCatalogGrid, CartSection, PaymentActionsSection } from "../sections";

export function PointOfSaleSkeleton() {
    return (
        <PointOfSaleLayout
            customerSearch={<CustomerSearchSection.Skeleton />}
            productCatalog={<ProductCatalogGrid.Skeleton />}
            cart={<CartSection.Skeleton />}
            paymentActions={<PaymentActionsSection.Skeleton />}
        />
    );
}
