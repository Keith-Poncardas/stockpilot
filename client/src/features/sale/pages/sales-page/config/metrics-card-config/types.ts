/**
 * Represents the shape of sales metrics returned by the backend.
 */
export interface ISaleMetrics {
    totalRevenue: number;
    totalTaxCollected: number;
    totalTransactions: number;
    completedSales: number;
    refundedOrVoidedCount: number;
};

/**
 * Represents the shape of the GraphQL response containing sales metrics.
 */
export interface IGetSalesMetricsResponse {
    getSalesMetrics?: ISaleMetrics;
};