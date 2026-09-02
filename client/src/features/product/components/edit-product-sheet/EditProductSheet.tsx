import { BaseSheetLayout } from '@/components/ui/base-sheet';
import { PackageOpen } from 'lucide-react';
import { useEditProductSheet } from './hooks/useEditProductSheet';
import { EditProductDetails } from './EditProductDetails';

export function EditProductSheet() {
    const { isOpen, onClose, productId } = useEditProductSheet();

    return (
        <BaseSheetLayout
            isOpen={isOpen}
            onClose={onClose}
            title="Edit Product"
            description="Update product details and pricing information."
            icon={PackageOpen}
            className="w-[95vw]! sm:max-w-xl! md:max-w-2xl! lg:max-w-3xl! flex flex-col gap-0 p-0"
            onOpenAutoFocus={(e) => e.preventDefault()}
        >
            {productId && <EditProductDetails key={productId} productId={productId} onClose={onClose} />}
        </BaseSheetLayout>
    );
}
