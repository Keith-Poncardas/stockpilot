import { useWatch, type Control } from 'react-hook-form';
import { useQuery } from '@apollo/client';
import { GET_PRODUCT } from '@/features/product/operations';

export interface ProductPreviewFields {
    name?: string;
    sku?: string;
    status?: string;
    unitPrice?: unknown;
    quantityOnHand?: unknown;
    reorderLevel?: unknown;
}

const STATUS_LABELS: Record<string, string> = {
    DRAFT: 'Draft',
    ACTIVE: 'Active',
    INACTIVE: 'Inactive',
    DISCONTINUED: 'Discontinued',
    ARCHIVED: 'Archived',
};

const STATUS_COLORS: Record<string, string> = {
    DRAFT: 'bg-white/10 text-white/70',
    ACTIVE: 'bg-emerald-500/20 text-emerald-300',
    INACTIVE: 'bg-yellow-500/20 text-yellow-300',
    DISCONTINUED: 'bg-red-500/20 text-red-300',
    ARCHIVED: 'bg-slate-500/20 text-slate-300',
};

export function useProductPreview(control: Control<any>) {
    const [name, sku, status, unitPrice, quantityOnHand, reorderLevel] = useWatch({
        control,
        name: ['name', 'sku', 'status', 'unitPrice', 'quantityOnHand', 'reorderLevel'],
    });

    const displayName = (name as string)?.trim() || 'Unnamed product';
    const displaySku = (sku as string)?.trim() ? `SKU — ${(sku as string).trim()}` : 'SKU —';
    const displayStatus = STATUS_LABELS[(status as string) ?? 'DRAFT'] ?? 'Draft';
    const statusColorClass = STATUS_COLORS[(status as string) ?? 'DRAFT'] ?? STATUS_COLORS.DRAFT;

    const rawPrice = parseFloat(unitPrice as string);
    const displayPrice = isNaN(rawPrice)
        ? '0.00'
        : new Intl.NumberFormat('en-PH', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(rawPrice);

    const rawQty = parseInt(quantityOnHand as string, 10);
    const displayQty = isNaN(rawQty) ? '0 units' : `${rawQty} units`;

    const rawReorder = parseInt(reorderLevel as string, 10);
    const displayReorder = isNaN(rawReorder) ? '0 units' : `${rawReorder} units`;

    const barcodeValue = (sku as string)?.trim() || 'SKU-PREVIEW';

    return {
        displayName,
        displaySku,
        displayStatus,
        statusColorClass,
        displayPrice,
        displayQty,
        displayReorder,
        barcodeValue,
    };
}

export function useFetchedProductPreview(productId: string) {
    const { data, loading, error } = useQuery(GET_PRODUCT, {
        variables: { productId },
        skip: !productId,
    });

    const productInfo = data?.getProduct?.productInfo;
    const inventoryStatus = data?.getProduct?.inventoryStatus;

    const displayName = productInfo?.name || 'Select a product';
    const displaySku = productInfo?.sku ? `SKU — ${productInfo.sku}` : 'SKU —';
    const displayStatus = productInfo ? (STATUS_LABELS[productInfo.status ?? 'DRAFT'] ?? 'Draft') : '';
    const statusColorClass = productInfo ? (STATUS_COLORS[productInfo.status ?? 'DRAFT'] ?? STATUS_COLORS.DRAFT) : '';

    const rawPrice = productInfo?.unitPrice;
    const displayPrice = rawPrice != null
        ? new Intl.NumberFormat('en-PH', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(rawPrice)
        : '0.00';

    const displayQty = inventoryStatus?.quantityOnHand != null ? `${inventoryStatus.quantityOnHand} units` : '-';
    const displayReorder = inventoryStatus?.reorderLevel != null ? `${inventoryStatus.reorderLevel} units` : '-';

    const barcodeValue = productInfo?.sku || 'SKU-PREVIEW';

    return {
        displayName,
        displaySku,
        displayStatus,
        statusColorClass,
        displayPrice,
        displayQty,
        displayReorder,
        barcodeValue,
        loading,
        error
    };
}
