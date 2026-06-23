import React from 'react'
import { cn } from '@/lib/utils'
import { type LucideIcon } from 'lucide-react'

export interface SectionHeaderProps {
    /** The main title heading of the page or section. */
    title: React.ReactNode
    /** Optional secondary text or description below the title. */
    subtitle?: React.ReactNode
    /** Optional controls or action buttons rendered on the right. */
    actions?: React.ReactNode
    /** Optional filtering inputs or selectors rendered next to the actions. */
    filters?: React.ReactNode
    /** Optional icon to display beside the title */
    icon?: LucideIcon
    /** Optional additional class names for the container. */
    className?: string
}

/**
 * Reusable and customizable section header component for page views.
 * Designed to align titles, descriptions, and action/filter controls.
 */
export function SectionHeader({
    title,
    subtitle,
    actions,
    filters,
    icon: Icon,
    className,
}: SectionHeaderProps) {
    return (
        <div
            className={cn(
                'flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8 mt-4',
                className
            )}
        >
            <div className="flex items-center gap-4 min-w-0">
                {Icon && (
                    <div className="hidden sm:flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-900/20 text-amber-500 border border-amber-100/50 dark:border-amber-900/30 shadow-sm">
                        <Icon className="h-6 w-6" strokeWidth={1.5} />
                    </div>
                )}
                <div>
                    {typeof title === 'string' ? (
                        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                            {title}
                        </h1>
                    ) : (
                        title
                    )}
                    {subtitle && (
                        <div className="mt-1 md:mt-1.5">
                            {typeof subtitle === 'string' ? (
                                <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 font-medium">
                                    {subtitle}
                                </p>
                            ) : (
                                subtitle
                            )}
                        </div>
                    )}
                </div>
            </div>

            {(filters || actions) && (
                <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap shrink-0">
                    {filters}
                    {actions}
                </div>
            )}
        </div>
    )
}

export default SectionHeader
