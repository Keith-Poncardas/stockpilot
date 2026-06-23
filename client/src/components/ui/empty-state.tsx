import { SearchX, type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface EmptyStateProps {
  title?: string
  description?: string
  icon?: LucideIcon
  className?: string
}

export function EmptyState({
  title = "No results found",
  description = "There is no data to display at the moment.",
  icon: Icon = SearchX,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center p-8 h-64 text-center text-gray-500", className)}>
      <div className="mb-4 rounded-full bg-amber-50 p-3 dark:bg-amber-900/20">
        <Icon className="h-8 w-8 text-amber-400" strokeWidth={1.5} />
      </div>
      <span className="mb-1 text-base font-semibold text-gray-900 dark:text-zinc-100">
        {title}
      </span>
      <p className="text-sm">
        {description}
      </p>
    </div>
  )
}
