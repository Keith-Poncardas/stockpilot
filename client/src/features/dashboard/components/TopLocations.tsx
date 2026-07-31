import React, { useState } from "react";
import { FormSection } from "@/components/ui/form-section";
import { SelectFilter, type SelectFilterOption } from "@/components/ui/select-filter";
import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

export type LocationSortOrder = "highest" | "lowest";

export interface TopLocationItem {
    /** Unique identifier for the location */
    id: string;
    /** Name of the city or location */
    name: string;
    /** Formatted revenue string (e.g. "₱128,400") or raw number */
    revenue: string | number;
    /** Numeric value used for sorting (highest/lowest) */
    rawValue?: number;
    /** Percentage width (0-100) for the progress bar */
    percentage: number;
    /** Optional custom bar color class */
    colorClass?: string;
}

export interface TopLocationsProps {
    /** List of locations to display */
    locations?: TopLocationItem[];
    /** Current sort order */
    sortOrder?: LocationSortOrder;
    /** Callback when sort dropdown changes (ready for API queries) */
    onSortChange?: (order: LocationSortOrder) => void;
    /** Loading state for API integration */
    loading?: boolean;
    /** Optional custom title */
    title?: string;
    /** Optional custom description */
    description?: string;
    className?: string;
}

const SORT_OPTIONS: SelectFilterOption[] = [
    { value: "highest", label: "Highest Sales" },
    { value: "lowest", label: "Lowest Sales" },
];

const DUMMY_LOCATIONS_DATA: TopLocationItem[] = [
    {
        id: "1",
        name: "Makati City",
        revenue: "₱128,400",
        rawValue: 128400,
        percentage: 92,
        colorClass: "bg-amber-500 dark:bg-amber-400",
    },
    {
        id: "2",
        name: "Quezon City",
        revenue: "₱94,200",
        rawValue: 94200,
        percentage: 78,
        colorClass: "bg-amber-400 dark:bg-amber-400/80",
    },
    {
        id: "3",
        name: "Cebu City",
        revenue: "₱76,500",
        rawValue: 76500,
        percentage: 64,
        colorClass: "bg-amber-300 dark:bg-amber-400/60",
    },
    {
        id: "4",
        name: "Davao City",
        revenue: "₱51,800",
        rawValue: 51800,
        percentage: 42,
        colorClass: "bg-amber-200 dark:bg-amber-400/40",
    },
    {
        id: "5",
        name: "Pasig City",
        revenue: "₱32,100",
        rawValue: 32100,
        percentage: 26,
        colorClass: "bg-amber-100 dark:bg-amber-400/20",
    },
];

function TopLocationsSkeleton() {
    return (
        <div className="space-y-4 pt-1">
            {[85, 70, 55, 40, 25].map((width, idx) => (
                <div key={idx} className="space-y-1.5 animate-pulse">
                    <div className="flex justify-between items-center">
                        <div className="h-3.5 w-28 bg-slate-200 dark:bg-slate-700 rounded" />
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

export function TopLocations({
    locations,
    sortOrder,
    onSortChange,
    loading = false,
    title = "Sales by Location",
    description = "Product performance by city",
    className,
}: TopLocationsProps) {
    const [internalSort, setInternalSort] = useState<LocationSortOrder>(sortOrder || "highest");
    const currentSort = sortOrder ?? internalSort;

    const handleSortChange = (val: string) => {
        const newSort = val as LocationSortOrder;
        setInternalSort(newSort);
        onSortChange?.(newSort);
    };

    const sortedLocations = React.useMemo(() => {
        const list = [...(locations ?? DUMMY_LOCATIONS_DATA)];
        if (currentSort === "lowest") {
            return list.sort((a, b) => (a.rawValue ?? 0) - (b.rawValue ?? 0));
        }
        return list.sort((a, b) => (b.rawValue ?? 0) - (a.rawValue ?? 0));
    }, [locations, currentSort]);

    return (
        <FormSection
            title={title}
            description={description}
            icon={<MapPin className="w-5 h-5" />}
            iconWrapperClassName="bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400"
            actions={
                <SelectFilter
                    value={currentSort}
                    onChange={handleSortChange}
                    options={SORT_OPTIONS}
                    className="w-32 text-xs"
                />
            }
            className={cn("h-full", className)}
        >
            {loading ? (
                <TopLocationsSkeleton />
            ) : (
                <div className="space-y-4">
                    {sortedLocations.map((location) => (
                        <div key={location.id} className="space-y-1.5">
                            <div className="flex justify-between items-center text-xs">
                                <span className="font-medium text-slate-700 dark:text-slate-200 truncate">
                                    {location.name}
                                </span>
                                <span className="font-mono font-semibold text-slate-600 dark:text-slate-400 shrink-0 ml-2">
                                    {typeof location.revenue === "number"
                                        ? `₱${location.revenue.toLocaleString()}`
                                        : location.revenue}
                                </span>
                            </div>
                            <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                <div
                                    className={cn(
                                        "h-full rounded-full transition-all duration-500",
                                        location.colorClass ?? "bg-amber-400"
                                    )}
                                    style={{
                                        width: `${Math.min(100, Math.max(0, location.percentage))}%`,
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

export default TopLocations;
