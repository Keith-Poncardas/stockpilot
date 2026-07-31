
import { FormSection } from "@/components/ui/form-section";
import { EmptyState } from "@/components/ui/empty-state";
import { Package, Trophy } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";

export interface TopProductItem {
    /** Unique identifier for the product */
    id: string;
    /** Name of the product */
    name: string;
    /** Formatted revenue string (e.g. "₱42,800") or raw number */
    revenue: number;
    /** Percentage width (0-100) for the progress bar */
    percentage: number;
    /** Optional custom bar color class */
    colorClass?: string;
}

export interface TopProductsProps {
    /** List of top products to display */
    products?: TopProductItem[];
    /** Loading state for API integration */
    loading?: boolean;
    /** Optional custom title */
    title?: string;
    /** Optional custom description */
    description?: string;
    className?: string;
}

const DUMMY_TOP_PRODUCTS: TopProductItem[] = [
    {
        id: "1",
        name: "Wireless Mouse Pro",
        revenue: 42800,
        percentage: 88,
        colorClass: "bg-amber-500 dark:bg-amber-400",
    },
    {
        id: "2",
        name: "USB-C Hub 7-Port",
        revenue: 38200,
        percentage: 75,
        colorClass: "bg-amber-400 dark:bg-amber-400/80",
    },
    {
        id: "3",
        name: "Mechanical Keyboard",
        revenue: 29500,
        percentage: 58,
        colorClass: "bg-amber-300 dark:bg-amber-400/60",
    },
    {
        id: "4",
        name: "HDMI Cable 2m",
        revenue: 18100,
        percentage: 35,
        colorClass: "bg-amber-200 dark:bg-amber-400/40",
    },
    {
        id: "5",
        name: "Laptop Stand Adj.",
        revenue: 14600,
        percentage: 28,
        colorClass: "bg-amber-100 dark:bg-amber-400/20",
    },
];

function TopProductsSkeleton() {
    return (
        <div className="space-y-4 pt-1">
            {[85, 70, 55, 40, 25].map((width, idx) => (
                <div key={idx} className="space-y-1.5 animate-pulse">
                    <div className="flex justify-between items-center">
                        <div className="h-3.5 w-32 bg-slate-200 dark:bg-slate-700 rounded" />
                        <div className="h-3.5 w-14 bg-slate-200 dark:bg-slate-700 rounded" />
                    </div>
                    <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-slate-200 dark:bg-slate-700 rounded-full"
                            style={{ width: `${width}%` }}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
}

export function TopProducts({
    products,
    loading = false,
    title = "Top Selling Products",
    description = "Highest performing items this period",
    className,
}: TopProductsProps) {
    const displayProducts = products ?? DUMMY_TOP_PRODUCTS;

    return (
        <FormSection
            title={title}
            description={description}
            icon={<Trophy className="w-5 h-5" />}
            iconWrapperClassName="bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400"
            className={cn("h-full", className)}
        >
            {loading ? (
                <TopProductsSkeleton />
            ) : displayProducts.length === 0 ? (
                <div className="mt-2 flex-1 flex flex-col">
                    <EmptyState
                        icon={Package}
                        title="No top products"
                        description="Your top selling products will appear here once sales are recorded."
                        className="flex-1 h-full"
                    />
                </div>
            ) : (
                <div className="space-y-4 pt-1">
                    {displayProducts.map((product) => (
                        <div key={product.id} className="space-y-1.5">
                            <div className="flex justify-between items-center text-xs">
                                <span className="font-medium text-slate-700 dark:text-slate-200 truncate">
                                    {product.name}
                                </span>
                                <span className="font-mono font-semibold text-slate-600 dark:text-slate-400 shrink-0 ml-2">
                                    {formatCurrency(product.revenue)}
                                </span>
                            </div>
                            <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                <div
                                    className={cn(
                                        "h-full rounded-full transition-all duration-500",
                                        product.colorClass ?? "bg-amber-400"
                                    )}
                                    style={{
                                        width: `${Math.min(100, Math.max(0, product.percentage))}%`,
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </FormSection>
    );
}

export default TopProducts;
