import { SearchX, ArrowLeft, type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { useNavigate } from "react-router-dom"
import { Button } from "./button"

interface EmptyStateProps {
  title?: string
  description?: string
  icon?: LucideIcon
  className?: string
  showBackButton?: boolean
  action?: React.ReactNode
}

export function EmptyState({
  title = "No results found",
  description = "There is no data to display at the moment.",
  icon: Icon = SearchX,
  className,
  showBackButton = false,
  action,
}: EmptyStateProps) {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center">
      <div className={cn("flex flex-col items-center justify-center p-8 h-64 text-center text-gray-500", className)}>
        <div className="mb-4 rounded-full bg-amber-50 p-3 ">
          <Icon className="h-8 w-8 text-amber-400" strokeWidth={1.5} />
        </div>
        <span className="mb-1 text-base text-gray-900 dark:text-zinc-100 font-bold">
          {title}
        </span>
        <p className="text-sm mb-4 ">
          {description}
        </p>

        {action && <div className="mt-2">{action}</div>}

        {showBackButton && !action && (
          <Button
            variant="soft"
            onClick={() => navigate(-1)}
            className="mt-2"
          >
            <ArrowLeft size={16} />
            Go Back
          </Button>
        )}
      </div>
    </div >
  )
}
