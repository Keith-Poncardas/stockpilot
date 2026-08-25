import { useMemo } from "react";
import { MetricCard, SectionHeader } from "@/components";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store";
import { Box, DollarSign, Package, Plus, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PATHS } from "@/routes";
import { LowStockAlerts, RecentSales, SalesOverviewChart, TopLocations, TopProducts } from "../components";
import { useDashboardData } from "../hooks";
import { formatCurrency, formatNumber } from "@/lib/utils";

export function Dashboard() {
    const { user } = useAuthStore();
    const navigate = useNavigate();
    const {
        metrics,
        salesChart,
        topProducts,
        topLocations,
        recentSales,
        lowStockAlerts,
        loading,
        timeRange,
        setTimeRange,
    } = useDashboardData();

    const todayDate = useMemo(() => {
        return new Intl.DateTimeFormat('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric',
        }).format(new Date());
    }, []);

    function handleNewSalePage() {
        navigate(PATHS.sales.pos);
    }

    return (
        <>
            <SectionHeader
                title={`Welcome back, ${user?.firstName} ${user?.lastName}!`}
                subtitle={`Here's what's happening with your business today — ${todayDate}.`}
                className="my-6"
                userAvatar={{
                    fallback: user,
                    role: user?.role,
                }}
                actions={
                    <Button size="lg" onClick={handleNewSalePage}>
                        <Plus data-icon="inline-start" />
                        New Sale
                    </Button>
                }
            />
            {/* Stats Row: 2 cols on mobile/tablet -> 4 cols on lg */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard
                    value={formatCurrency(metrics.totalSales)}
                    label="Total Sales"
                    icon={<DollarSign className="w-5 h-5" />}
                    iconContainerClass="bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400"
                />
                <MetricCard
                    value={metrics.totalProducts.toLocaleString()}
                    label="Total Products"
                    icon={<Box className="w-5 h-5" />}
                    iconContainerClass="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                />
                <MetricCard
                    value={metrics.totalCustomers.toLocaleString()}
                    label="Total Customers"
                    icon={<Users className="w-5 h-5" />}
                    iconContainerClass="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400"
                />
                <MetricCard
                    value={formatNumber(metrics.totalUnitsInStock)}
                    label="Units in Stock"
                    icon={<Package className="w-5 h-5" />}
                    iconContainerClass="bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400"
                />
            </div>

            {/* Middle Row: 2/4 (50%) + 1/4 (25%) + 1/4 (25%) ratio on lg */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                <SalesOverviewChart
                    className="lg:col-span-2"
                    data={salesChart}
                    timeRange={timeRange}
                    onTimeRangeChange={setTimeRange}
                    loading={loading}
                />
                <TopProducts products={topProducts} loading={loading} />
                <TopLocations locations={topLocations} loading={loading} />
            </div>

            {/* Bottom Row (1/2 + 1/2 ratio on lg) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <RecentSales sales={recentSales} loading={loading} />
                <LowStockAlerts alerts={lowStockAlerts} loading={loading} />
            </div>


        </>
    )
}
