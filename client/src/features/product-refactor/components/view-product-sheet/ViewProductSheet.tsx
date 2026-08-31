import { BaseSheetLayout } from '@/components/ui/base-sheet';
import { Package } from 'lucide-react';
import { useViewProductSheet } from './hooks/useViewProductSheet';
import { ViewProductDetails } from './ViewProductDetails';

export function ViewProductSheet() {
    const { isOpen, onClose, productId } = useViewProductSheet();

    return (
        <BaseSheetLayout
            isOpen={isOpen}
            onClose={onClose}
            title="Product Details"
            description="View product specifications, inventory status, and performance."
            icon={Package}
            className="w-[95vw]! sm:max-w-2xl! md:max-w-4xl! lg:max-w-6xl! xl:max-w-7xl! flex flex-col gap-0 p-0"
            onOpenAutoFocus={(e) => e.preventDefault()}
        >
            {productId && <ViewProductDetails productId={productId} />}
        </BaseSheetLayout>
    );
}
