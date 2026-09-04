import React from 'react';
import { cn } from '@/lib/utils';
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, TrendingDown } from 'lucide-react';

export interface MetricCardTrend {
    value: string | number;
    isPositive?: boolean;
    label?: string;
}

export interface MetricCardProps {
    value?: string | number | null;
    label: string;
    icon: React.ReactNode;
    iconContainerClass?: string;
    valueClass?: string;
    className?: string;
    description?: React.ReactNode;
    trend?: MetricCardTrend;
}

export function MetricCard({
    value,
    label,
    icon,
    iconContainerClass = 'bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
    valueClass = 'text-slate-900 dark:text-white',
    className = '',
    description,
    trend,
}: MetricCardProps) {
    const safeValue = value ?? '—';
    const displayValue = typeof safeValue === 'number' ? safeValue.toLocaleString() : safeValue;

    return (
        <div
            className={cn(
                "group relative overflow-hidden bg-white dark:bg-slate-900/90 rounded-2xl",
                "border border-slate-200/80 dark:border-slate-800/80 p-5 sm:p-5.5",
                "flex items-center justify-between gap-4 shadow-xs",
                "hover:shadow-md hover:-translate-y-0.5 hover:border-slate-300 dark:hover:border-slate-700",
                "transition-all duration-200",
                className
            )}
        >
            {/* Ambient subtle glow on card hover */}
            <div className="pointer-events-none absolute -right-8 -top-8 w-28 h-28 rounded-full bg-slate-100/70 dark:bg-slate-800/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" />

            <div className="flex flex-col gap-1.5 min-w-0 flex-1 relative z-10">
                <span className="text-[11px] sm:text-xs uppercase tracking-wider text-slate-400 dark:text-slate-400 font-semibold truncate">
                    {label}
                </span>

                <div className="flex items-baseline flex-wrap gap-2">
                    <span className={cn("text-2xl sm:text-[28px] font-bold font-mono tracking-tight leading-none", valueClass)}>
                        {displayValue}
                    </span>

                    {trend && (
                        <span
                            className={cn(
                                "inline-flex items-center gap-0.5 text-[11px] font-semibold font-mono px-1.5 py-0.5 rounded-md",
                                trend.isPositive
                                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/40"
                                    : "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200/60 dark:border-rose-800/40"
                            )}
                        >
                            {trend.isPositive ? (
                                <TrendingUp className="w-3 h-3" strokeWidth={2.5} />
                            ) : (
                                <TrendingDown className="w-3 h-3" strokeWidth={2.5} />
                            )}
                            {trend.value}
                        </span>
                    )}
                </div>

                {description && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal truncate mt-0.5">
                        {description}
                    </p>
                )}
            </div>

            <div
                className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
                    "shadow-2xs border border-black/5 dark:border-white/10",
                    "group-hover:scale-105 transition-transform duration-200",
                    "relative z-10",
                    iconContainerClass
                )}
            >
                {icon}
            </div>
        </div>
    );
}

export function MetricCardSkeleton({ className = '' }: { className?: string } = {}) {
    return (
        <div
            className={cn(
                "bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 p-5 sm:p-5.5 flex items-center justify-between gap-4 shadow-xs animate-pulse",
                className
            )}
        >
            <div className="flex flex-col gap-2.5 min-w-0 flex-1">
                <Skeleton className="h-3.5 w-24 rounded-md" />
                <Skeleton className="h-7 w-28 rounded-md" />
            </div>
            <Skeleton className="w-12 h-12 rounded-xl shrink-0" />
        </div>
    );
}

MetricCard.Skeleton = MetricCardSkeleton;
