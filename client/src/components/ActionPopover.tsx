import React from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

export interface ActionOption {
  id: string
  label: string
  icon?: React.ReactNode
  colorClassName?: string
  onClick: () => void
  variant?: 'default' | 'destructive'
}

interface ActionPopoverProps {
  title?: string
  options: ActionOption[]
  children: React.ReactNode
  contentClassName?: string
  triggerClassName?: string
  disabled?: boolean
}

export default function ActionPopover({
  title,
  options,
  children,
  contentClassName = "w-40 p-0 overflow-hidden",
  triggerClassName = "w-full h-full focus:outline-hidden cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors flex items-center justify-center",
  disabled = false,
}: ActionPopoverProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className={cn(
            triggerClassName,
            disabled && "opacity-60 cursor-not-allowed hover:bg-transparent pointer-events-none"
          )}
          disabled={disabled}
        >
          {children}
        </button>
      </PopoverTrigger>
      {!disabled && (
        <PopoverContent
          className={cn("rounded-xl shadow-lg border-gray-100 dark:border-zinc-800 dark:bg-zinc-950", contentClassName)}
          align="start"
        >
          <div className="flex flex-col">
            {title && (
              <div className="px-3 py-2.5 text-xs font-semibold text-gray-500 dark:text-zinc-400 tracking-wide uppercase border-b border-gray-100 dark:border-zinc-800/50 bg-gray-50/50 dark:bg-zinc-900/50">
                {title}
              </div>
            )}
            {options.map((option) => (
              <button
                key={option.id}
                className={cn(
                  "w-full flex items-center justify-start px-3 py-2.5 text-sm transition-colors border-b last:border-b-0 border-gray-100 dark:border-zinc-800/50 outline-hidden font-medium",
                  option.colorClassName
                    ? cn("hover:brightness-95 dark:hover:brightness-110", option.colorClassName)
                    : option.variant === 'destructive'
                      ? "text-red-600 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950/50 dark:hover:text-red-500"
                      : "text-gray-700 hover:bg-gray-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                )}
                onClick={() => {
                  option.onClick();
                  setOpen(false);
                }}
              >
                {option.icon && <span className="mr-2 flex items-center justify-center">{option.icon}</span>}
                {option.label}
              </button>
            ))}
          </div>
        </PopoverContent>
      )}
    </Popover>
  )
}
