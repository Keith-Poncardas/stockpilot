import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-16 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm transition-shadow outline-none placeholder:text-muted-foreground focus-visible:border-amber-400 focus-visible:ring-2 focus-visible:ring-amber-400/10 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:opacity-50 aria-invalid:border-red-400 aria-invalid:ring-2 aria-invalid:ring-red-400/15 focus-visible:aria-invalid:border-red-400 focus-visible:aria-invalid:ring-red-400/20 dark:bg-zinc-900 dark:border-zinc-700 dark:disabled:bg-zinc-800/50",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
