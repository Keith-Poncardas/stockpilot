export const ProductStatus = {
    ACTIVE: {
        a: 'ACTIVE',
        b: 'ACTIVATE'
    },
    INACTIVE: {
        a: 'INACTIVE',
        b: 'DEACTIVATE'
    },
    DISCONTINUED: {
        a: 'DISCONTINUED',
        b: 'DISCONTINUE'
    },
    DRAFT: {
        a: 'DRAFT',
        b: 'DRAFT'
    },
    ARCHIVED: {
        a: 'ARCHIVED',
        b: 'ARCHIVE'
    },
} as const;

export const AVAILABLE_STATUSES = Object.values(ProductStatus) as Array<
    (typeof ProductStatus)[keyof typeof ProductStatus]
>;

export const ProductOrderBy = {
    createdAt: 'createdAt',
    name: 'name',
    unitPrice: 'unitPrice',
} as const;

export type ProductOrderBy = (typeof ProductOrderBy)[keyof typeof ProductOrderBy];
export type ProductStatus = (typeof ProductStatus)[keyof typeof ProductStatus]["a"];
