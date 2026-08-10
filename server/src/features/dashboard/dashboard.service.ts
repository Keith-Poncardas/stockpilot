import { customerService } from "../customer";
import { inventoryService } from "../inventory";
import { productService } from "../product";
import { saleService } from "../sale";

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
            totalSales,
            totalProducts,
            totalCustomers,
            totalInventory
        ] = await Promise.all([
            saleService.saleCount,
            productService.productCount,
            customerService.customerCount,
            inventoryService.inventoryCount
        ])

        return {
            totalSales,
            totalProducts,
            totalCustomers,
            totalInventory
        }
    }

}

export const dashboardService = new DashboardService();
