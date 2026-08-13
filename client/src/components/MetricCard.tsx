import React from 'react';
import { cn } from '@/lib/utils';

interface MetricCardProps {
    value?: string | number | null;
    label: string;
    icon: React.ReactNode;
    iconContainerClass?: string;
    valueClass?: string;
    className?: string;
}

export function MetricCard({
    value,
    label,
    icon,
    iconContainerClass = 'bg-gray-50 text-gray-600',
    valueClass = 'text-gray-900',
    className = ''
}: MetricCardProps) {
    const safeValue = value ?? '-';
    const displayValue = typeof safeValue === 'number' ? safeValue.toLocaleString() : safeValue;

    return (
        <div className={cn(
            "bg-white rounded-2xl border border-[#E3E1DC] p-5 flex items-center justify-between",
            className
        )}>
            <div className="flex flex-col gap-1">
                <span className="text-xs uppercase tracking-wide text-[#9C9A91] font-semibold">{label}</span>
                <span className={cn("font-display text-2xl font-semibold", valueClass)}>
                    {displayValue}
                </span>
            </div>
            <div className={cn(
                "w-12 h-12 rounded-[14px] flex items-center justify-center shrink-0",
                iconContainerClass
            )}>
                {icon}
            </div>
        </div>
    );
}

export function MetricCardSkeleton({ className = '' }: { className?: string } = {}) {
    return (
        <div className={cn(
            "bg-white rounded-2xl border border-[#E3E1DC] p-5 flex items-center justify-between",
            className
        )}>
            <div className="flex flex-col gap-2">
                <div className="h-3 w-24 bg-[#F0EFEA] animate-pulse rounded-md" />
                <div className="h-8 w-16 bg-[#F0EFEA] animate-pulse rounded-md" />
            </div>
            <div className="w-12 h-12 rounded-[14px] bg-[#F0EFEA] animate-pulse shrink-0" />
        </div>
    );
}

MetricCard.Skeleton = MetricCardSkeleton;
