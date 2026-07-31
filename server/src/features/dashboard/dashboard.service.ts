import { prisma } from "@/lib";
import { Prisma, SaleStatus, ProductStatus } from "@prisma/client";

type TimeRange = "daily" | "weekly" | "monthly";

export class DashboardService {

    /**
     * Aggregates all data required by the dashboard in a single call.
     */
    async getDashboardData(timeRange: TimeRange = "daily") {
        const [metrics, salesChart, topProducts, topLocations, recentSales, lowStockAlerts] =
            await Promise.all([
                this.getMetrics(),
                this.getSalesChart(timeRange),
                this.getTopProducts(),
                this.getTopLocations(),
                this.getRecentSales(),
                this.getLowStockAlerts(),
            ]);

        return { metrics, salesChart, topProducts, topLocations, recentSales, lowStockAlerts };
    }

    // ─── Private helpers ──────────────────────────────────────────────────────

    /**
     * Top-line KPI cards: total sales revenue, product count,
     * customer count, and total units in stock.
     */
    private async getMetrics() {
        const [totalSalesAgg, totalProducts, totalCustomers, unitsInStockAgg] =
            await Promise.all([

                prisma.sale.aggregate({
                    where: { status: SaleStatus.COMPLETED },
                    _sum: { totalAmount: true },
                }),

                prisma.product.count({
                    where: {
                        status: {
                            notIn: [ProductStatus.ARCHIVED, ProductStatus.DISCONTINUED],
                        },
                    },
                }),

                prisma.customer.count(),

                prisma.inventory.aggregate({
                    _sum: { quantityOnHand: true },
                }),

            ]);

        return {
            totalSales: Number(totalSalesAgg._sum.totalAmount ?? 0),
            totalProducts,
            totalCustomers,
            totalUnitsInStock: Number(unitsInStockAgg._sum.quantityOnHand ?? 0),
        };
    }

    /**
     * Sales chart data points for the given time range.
     * Groups COMPLETED sale totals by period label, ensuring all periods
     * (e.g. all 12 months) are included even if sales only occurred in one period.
     */
    private async getSalesChart(timeRange: TimeRange): Promise<{ label: string; value: number }[]> {
        if (timeRange === "daily") {
            // Last 7 days, grouped by calendar day
            const raw = await prisma.$queryRaw<{ label: string; total: Prisma.Decimal }[]>`
                SELECT
                    TO_CHAR(sale_date AT TIME ZONE 'Asia/Manila', 'Mon DD') AS label,
                    SUM(total_amount) AS total
                FROM sales
                WHERE status = 'COMPLETED'
                  AND sale_date >= NOW() - INTERVAL '7 days'
                GROUP BY DATE_TRUNC('day', sale_date AT TIME ZONE 'Asia/Manila'),
                         TO_CHAR(sale_date AT TIME ZONE 'Asia/Manila', 'Mon DD')
                ORDER BY DATE_TRUNC('day', sale_date AT TIME ZONE 'Asia/Manila')
            `;
            const resultMap = new Map(raw.map(r => [r.label, Number(r.total)]));
            const days: string[] = [];
            const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            for (let i = 6; i >= 0; i--) {
                const d = new Date();
                d.setDate(d.getDate() - i);
                const monthStr = months[d.getMonth()];
                const dayStr = String(d.getDate()).padStart(2, "0");
                days.push(`${monthStr} ${dayStr}`);
            }
            return days.map(label => ({
                label,
                value: resultMap.get(label) ?? 0,
            }));

        } else if (timeRange === "weekly") {
            // Last 6 weeks, grouped by ISO week
            const raw = await prisma.$queryRaw<{ label: string; total: Prisma.Decimal }[]>`
                SELECT
                    CONCAT('Week ', EXTRACT(WEEK FROM sale_date)::int) AS label,
                    SUM(total_amount) AS total
                FROM sales
                WHERE status = 'COMPLETED'
                  AND sale_date >= NOW() - INTERVAL '6 weeks'
                GROUP BY EXTRACT(WEEK FROM sale_date)
                ORDER BY EXTRACT(WEEK FROM sale_date)
            `;
            const resultMap = new Map(raw.map(r => [r.label, Number(r.total)]));
            const weeks: string[] = [];
            const now = new Date();
            for (let i = 5; i >= 0; i--) {
                const d = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000);
                const startOfYear = new Date(d.getFullYear(), 0, 1);
                const weekNum = Math.ceil((((d.getTime() - startOfYear.getTime()) / 86400000) + startOfYear.getDay() + 1) / 7);
                const label = `Week ${weekNum}`;
                if (!weeks.includes(label)) {
                    weeks.push(label);
                }
            }
            return weeks.map(label => ({
                label,
                value: resultMap.get(label) ?? 0,
            }));

        } else {
            // monthly: all 12 months of current year
            const raw = await prisma.$queryRaw<{ label: string; total: Prisma.Decimal }[]>`
                SELECT
                    TO_CHAR(sale_date, 'Mon') AS label,
                    SUM(total_amount) AS total
                FROM sales
                WHERE status = 'COMPLETED'
                  AND EXTRACT(YEAR FROM sale_date) = EXTRACT(YEAR FROM NOW())
                GROUP BY EXTRACT(MONTH FROM sale_date), TO_CHAR(sale_date, 'Mon')
                ORDER BY EXTRACT(MONTH FROM sale_date)
            `;
            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            const resultMap = new Map(raw.map(r => [r.label, Number(r.total)]));
            return monthNames.map(label => ({
                label,
                value: resultMap.get(label) ?? 0,
            }));
        }
    }

    /**
     * Top 5 products by revenue (sum of saleItem quantity * unitPrice)
     * from COMPLETED sales.
     */
    private async getTopProducts() {
        type RawProduct = { product_id: string; name: string; revenue: Prisma.Decimal };

        const rows = await prisma.$queryRaw<RawProduct[]>`
            SELECT
                p.id                      AS product_id,
                p.name                    AS name,
                SUM(si.quantity * si.unit_price) AS revenue
            FROM sale_items si
            JOIN products p ON p.id = si.product_id
            JOIN sales s    ON s.id = si.sale_id
            WHERE s.status = 'COMPLETED'
            GROUP BY p.id, p.name
            ORDER BY revenue DESC
            LIMIT 5
        `;

        if (rows.length === 0) return [];

        const maxRevenue = Number(rows[0].revenue);

        return rows.map((r, idx) => ({
            id: r.product_id,
            name: r.name,
            revenue: Number(r.revenue),
            percentage: maxRevenue > 0 ? Math.round((Number(r.revenue) / maxRevenue) * 100) : 0,
        }));
    }

    /**
     * Top 5 customer cities by revenue from COMPLETED sales.
     * Customers with no city are grouped as "Unknown".
     */
    private async getTopLocations() {
        type RawLocation = { city: string | null; revenue: Prisma.Decimal };

        const rows = await prisma.$queryRaw<RawLocation[]>`
            SELECT
                COALESCE(c.city, 'Unknown') AS city,
                SUM(s.total_amount)          AS revenue
            FROM sales s
            LEFT JOIN customers c ON c.id = s.customer_id
            WHERE s.status = 'COMPLETED'
            GROUP BY COALESCE(c.city, 'Unknown')
            ORDER BY revenue DESC
            LIMIT 5
        `;

        if (rows.length === 0) return [];

        const maxRevenue = Number(rows[0].revenue);

        return rows.map((r, idx) => ({
            id: r.city ?? "Unknown",
            name: r.city ?? "Unknown",
            revenue: Number(r.revenue),
            percentage: maxRevenue > 0 ? Math.round((Number(r.revenue) / maxRevenue) * 100) : 0,
        }));
    }

    /**
     * 5 most recent sales (any status) with customer name and first item name.
     */
    private async getRecentSales() {
        const sales = await prisma.sale.findMany({
            take: 5,
            orderBy: { saleDate: "desc" },
            select: {
                id: true,
                totalAmount: true,
                status: true,
                customer: {
                    select: { firstName: true, lastName: true },
                },
                saleItems: {
                    take: 1,
                    select: {
                        quantity: true,
                        product: { select: { name: true } },
                    },
                    orderBy: { quantity: "desc" },
                },
                _count: { select: { saleItems: true } },
            },
        });

        return sales.map(s => {
            const firstName = s.customer?.firstName ?? "";
            const lastName = s.customer?.lastName ?? "";
            const customer = firstName || lastName
                ? `${firstName} ${lastName}`.trim()
                : "Walk-in Customer";

            const firstItem = s.saleItems[0];
            const product = firstItem?.product?.name ?? null;
            const quantity = firstItem?.quantity ?? 0;

            return {
                id: s.id,
                customer,
                product,
                quantity,
                amount: Number(s.totalAmount),
                status: s.status,
            };
        });
    }

    /**
     * Inventory items where quantityOnHand <= reorderLevel, up to 5.
     */
    private async getLowStockAlerts() {
        const items = await prisma.$queryRaw<
            {
                id: string;
                name: string;
                sku: string;
                quantity_on_hand: number;
                reorder_level: number;
            }[]
        >`
            SELECT
                i.id,
                p.name,
                p.sku,
                i.quantity_on_hand,
                i.reorder_level
            FROM inventory i
            JOIN products p ON p.id = i.product_id
            WHERE i.quantity_on_hand <= i.reorder_level
            ORDER BY i.quantity_on_hand ASC
            LIMIT 5
        `;

        return items.map(i => ({
            id: i.id,
            productName: i.name,
            sku: i.sku,
            quantityOnHand: Number(i.quantity_on_hand),
            reorderLevel: Number(i.reorder_level),
            stockStatus:
                Number(i.quantity_on_hand) <= 0 ? "CRITICAL_OUT" : "LOW_STOCK",
        }));
    }

}

export const dashboardService = new DashboardService();
