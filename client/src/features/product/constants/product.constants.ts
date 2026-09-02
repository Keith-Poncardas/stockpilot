/**
 * Represents the status of a product in the catalog.
 * 
 * @constant
 * @type {Object}
 * @property {string} ACTIVE - Visible and available for sales/inventory operations.
 * @property {string} INACTIVE - Hidden from active sales and inventory.
 * @property {string} DISCONTINUED - Permanently discontinued and non-editable.
 * @property {string} DRAFT - Draft product not yet published or listed.
 * @property {string} ARCHIVED - Archived product record.
 */
export const ProductStatus = {
    ACTIVE: 'ACTIVE',
    INACTIVE: 'INACTIVE',
    DISCONTINUED: 'DISCONTINUED',
    DRAFT: 'DRAFT',
    ARCHIVED: 'ARCHIVED',
} as const;

/**
 * Display labels for updating Product Statuses in popovers and actions.
 */
export const PRODUCT_STATUS_LABELS: Record<string, string> = {
    ACTIVE: 'ACTIVATE',
    INACTIVE: 'DEACTIVATE',
    DISCONTINUED: 'DISCONTINUE',
    DRAFT: 'DRAFT',
    ARCHIVED: 'ARCHIVE',
};

/**
 * Tailwind CSS styling mapping for Product Status badges and cell highlights.
 */
export const PRODUCT_STATUS_COLORS: Record<string, string> = {
    ACTIVE: 'bg-emerald-50 text-emerald-700',
    INACTIVE: 'bg-gray-100 text-gray-500',
    DISCONTINUED: 'bg-red-50 text-red-600',
    DRAFT: 'bg-amber-50 text-amber-600',
    ARCHIVED: 'bg-slate-100 text-slate-500',
};

/**
 * Fields available for sorting the products list.
 */
export const ProductOrderBy = {
    CREATED_AT: 'createdAt',
    NAME: 'name',
    UNIT_PRICE: 'unitPrice',
} as const;

/**
 * Product Type representation: Single catalog product vs Bundle / Combo pack.
 */
export const ProductType = {
    SIMPLE: 'SIMPLE',
    BUNDLE: 'BUNDLE',
} as const;

export const PRODUCT_TYPE_LABELS: Record<string, string> = {
    SIMPLE: 'Single Product',
    BUNDLE: 'Product Bundle (Combo / Kit)',
};

export const DEFAULT_PRODUCT_FORM_VALUES = {
    name: '',
    sku: '',
    productType: ProductType.SIMPLE,
    status: ProductStatus.DRAFT,
    description: '',
    unitPrice: '' as unknown as number,
    costPrice: '' as unknown as number,
    regularPrice: '' as unknown as number,
    trackInventory: false,
    quantityOnHand: '' as unknown as number,
    reorderLevel: '' as unknown as number,
    maxStock: '' as unknown as number,
    bundleItems: [] as { productId: string; quantity: number }[],
    pricingTiers: [] as {
        minQuantity: number;
        maxQuantity?: number | null;
        tierPrice: number;
        freeProductId?: string | null;
        freeQuantity?: number;
    }[],
};

export const PRODUCT_STATUS_OPTIONS = [
    { value: 'all', label: 'All Statuses' },
    { value: ProductStatus.ACTIVE, label: 'Active' },
    { value: ProductStatus.INACTIVE, label: 'Inactive' },
    { value: ProductStatus.DISCONTINUED, label: 'Discontinued' },
    { value: ProductStatus.DRAFT, label: 'Draft' },
    { value: ProductStatus.ARCHIVED, label: 'Archived' },
];

export const PRODUCT_TYPE_OPTIONS = [
    { value: 'all', label: 'All Product Types' },
    { value: ProductType.SIMPLE, label: 'Single Product' },
    { value: ProductType.BUNDLE, label: 'Product Bundle' },
];

export const PRODUCT_ORDER_BY_OPTIONS = [
    { value: ProductOrderBy.CREATED_AT, label: 'Date Created' },
    { value: ProductOrderBy.NAME, label: 'Name' },
    { value: ProductOrderBy.UNIT_PRICE, label: 'Unit Price' },
];

export const PRODUCT_ORDER_DIRECTION_OPTIONS = [
    { value: 'desc', label: 'Latest' },
    { value: 'asc', label: 'Oldest' },
];
