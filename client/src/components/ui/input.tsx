import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-9 w-full min-w-0 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm transition-shadow outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-amber-400 focus-visible:ring-2 focus-visible:ring-amber-400/10 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-gray-100 disabled:opacity-50 aria-invalid:border-red-400 aria-invalid:ring-2 aria-invalid:ring-red-400/15 focus-visible:aria-invalid:border-red-400 focus-visible:aria-invalid:ring-red-400/20 dark:bg-zinc-900 dark:border-zinc-700 dark:disabled:bg-zinc-800/50",
        className
      )}
      {...props}
    />
  )
}

export { Input }
