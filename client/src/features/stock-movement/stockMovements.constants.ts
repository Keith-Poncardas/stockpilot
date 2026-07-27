
export const StockMovementType = {
    IN: {
        a: 'IN',
        b: 'STOCK IN'
    },
    OUT: {
        a: 'OUT',
        b: 'STOCK OUT'
    },
    ADJUSTMENT: {
        a: 'ADJUSTMENT',
        b: 'ADJUSTMENT'
    }
} as const;

export const AVAILABLE_TYPES = Object.values(StockMovementType) as Array<
    (typeof StockMovementType)[keyof typeof StockMovementType]
>;

export const StockMovementOrderBy = {
    createdAt: 'createdAt',
    quantity: 'quantity',
} as const;

export type StockMovementOrderBy = (typeof StockMovementOrderBy)[keyof typeof StockMovementOrderBy];
export type StockMovementType = (typeof StockMovementType)[keyof typeof StockMovementType]["a"];

