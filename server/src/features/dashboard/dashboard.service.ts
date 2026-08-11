import { prisma } from "@/lib";

export class DashboardService {
    /**
     * Retrieves a summary of key metrics for the dashboard.
     *
     * Returns counts for total sales, active products, total customers, and total inventory.
     *
     * @returns An object containing dashboard metrics.
     */
    async getDashboardMetrics() {
        const [
            salesAgg,
            totalProducts,
            totalCustomers,
            inventoryAgg
        ] = await Promise.all([
            prisma.sale.aggregate({
                _sum: { totalAmount: true },
                where: { status: 'COMPLETED' }
            }),
            prisma.product.count({
                where: { status: 'ACTIVE' }
            }),
            prisma.customer.count(),
            prisma.inventory.aggregate({
                _sum: { quantityOnHand: true }
            })
        ]);

        return {
            totalSales: Number(salesAgg._sum.totalAmount ?? 0),
            totalProducts,
            totalCustomers,
            totalUnitsInStock: inventoryAgg._sum.quantityOnHand ?? 0
        };
    }
}

export const dashboardService = new DashboardService();
