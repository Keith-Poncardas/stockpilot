import * as React from 'react'
import { SearchIcon, RotateCcw } from 'lucide-react'
import IconInput from '@/components/IconInput'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface DataTableToolbarProps {
    searchQuery: string
    setSearchQuery: (value: string) => void
    searchPlaceholder?: string
    onRefresh: () => void
    hasActiveFilters: boolean
    onResetFilters: () => void
    children?: React.ReactNode
    className?: string
}

export function DataTableToolbar({
    searchQuery,
    setSearchQuery,
    searchPlaceholder = "Search...",
    onRefresh,
    hasActiveFilters,
    onResetFilters,
    children,
    className
}: DataTableToolbarProps) {
    return (
        <div className={cn("p-4 bg-white rounded-2xl border border-[#E3E1DC] flex items-center gap-2", className)}>
            <div className="max-w-xs flex-1">
                <IconInput
                    placeholder={searchPlaceholder}
                    startAddon={<SearchIcon className="text-muted-foreground w-4 h-4 lg:w-4 lg:h-4" />}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-8 text-xs lg:h-9 lg:text-sm"
                />
            </div>

            <Button variant="outline" size="icon" className="h-8 w-8 lg:h-9 lg:w-9 border-slate-200" onClick={onRefresh}>
                <RotateCcw className="h-4 w-4 text-muted-foreground" strokeWidth={2} />
            </Button>

            {children}

            {hasActiveFilters && (
                <Button
                    variant="soft-danger"
                    size='lg'
                    onClick={onResetFilters}
                >
                    Reset
                </Button>
            )}
        </div>
    )
}
