export const ErrorCode = {
  INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR",
  NOT_FOUND: "NOT_FOUND",
  UNAUTHENTICATED: "UNAUTHENTICATED",
  FORBIDDEN: "FORBIDDEN",
  BAD_USER_INPUT: "BAD_USER_INPUT",
  CONFLICT: "CONFLICT",
  ACCOUNT_RESTRICTED: "ACCOUNT_RESTRICTED",
} as const;

export type ErrorCode = typeof ErrorCode[keyof typeof ErrorCode];

export const StockMovementReason = {
  SALE: { a: 'SALE', b: 'SALE' },
  PURCHASE: { a: 'PURCHASE', b: 'PURCHASE' },
  ADJUSTMENT: { a: 'ADJUSTMENT', b: 'ADJUSTMENT' },
  RETURN: { a: 'RETURN', b: 'RETURN' },
  DAMAGE: { a: 'DAMAGE', b: 'DAMAGE' },
  EXPIRED: { a: 'EXPIRED', b: 'EXPIRED' },
  TRANSFER: { a: 'TRANSFER', b: 'TRANSFER' },
  INITIAL_STOCK: { a: 'INITIAL_STOCK', b: 'INITIAL STOCK' },
} as const;

export const AVAILABLE_REASONS = Object.values(StockMovementReason) as Array<
  (typeof StockMovementReason)[keyof typeof StockMovementReason]
>;

export type StockMovementReason = (typeof StockMovementReason)[keyof typeof StockMovementReason]["a"];

