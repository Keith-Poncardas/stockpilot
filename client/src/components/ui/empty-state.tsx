import React from "react";
import { SearchX, ArrowLeft, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { Button } from "./button";

export interface EmptyStateProps {
  /** Main heading text */
  title?: string;
  /** Helper descriptive text */
  description?: string;
  /** Lucide icon component to display */
  icon?: LucideIcon;
  /** Additional wrapper class names */
  className?: string;
  /** Custom class names for the circular icon wrapper */
  iconWrapperClassName?: string;
  /** Custom class names for the icon itself */
  iconClassName?: string;
  /** Whether to show dashed border (default: false) */
  bordered?: boolean;
  /** Whether to display a back button */
  showBackButton?: boolean;
  /** Custom action slot (e.g. button or link) */
  action?: React.ReactNode;
}

export function EmptyState({
  title = "No results found",
  description = "There is no data to display at the moment.",
  icon: Icon = SearchX,
  className,
  iconWrapperClassName,
  iconClassName,
  bordered = false,
  showBackButton = false,
  action,
}: EmptyStateProps) {
  const navigate = useNavigate();

  return (
    <div
      className={cn(
        "flex w-full flex-1 h-full flex-col items-center justify-center px-4 py-12 text-center min-h-55",
        bordered && "rounded-xl border border-dashed border-slate-200 dark:border-slate-800",
        className
      )}
    >
      <div
        className={cn(
          "flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 dark:bg-amber-900/20 text-amber-600",
          iconWrapperClassName
        )}
      >
        <Icon className={cn("h-6 w-6", iconClassName)} />
      </div>
      {title && (
        <p className="mt-3 text-sm font-medium text-slate-700 dark:text-slate-300">
          {title}
        </p>
      )}
      {description && (
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-sm">
          {description}
        </p>
      )}

      {action && <div className="mt-4">{action}</div>}

      {showBackButton && !action && (
        <Button
          variant="soft"
          onClick={() => navigate(-1)}
          className="mt-4"
        >
          <ArrowLeft size={16} />
          Go Back
        </Button>
      )}
    </div>
  );
}
