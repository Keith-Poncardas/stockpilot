import React from 'react';
import { cn } from '@/lib/utils';

interface MetricCardProps {
    value: string | number;
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
    return (
        <div className={cn(
            "bg-white rounded-sm border border-gray-200 p-5 flex items-center justify-between",
            className
        )}>
            <div className="flex flex-col gap-1">
                <span className="text-sm font-medium text-gray-500">{label}</span>
                <span className={cn("text-3xl font-bold font-mono tracking-tight", valueClass)}>
                    {value}
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
