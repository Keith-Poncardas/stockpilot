import * as React from "react"
import { cn } from "@/lib/utils"

interface FormSectionProps extends React.ComponentProps<"section"> {
  title: string;
  description?: string;
  icon: React.ReactNode;
  iconWrapperClassName?: string;
  children: React.ReactNode;
}

export function FormSection({
  title,
  description,
  icon,
  iconWrapperClassName = "bg-blue-50 text-blue-600",
  children,
  className,
  ...props
}: FormSectionProps) {
  return (
    <section className={cn("bg-white rounded-2xl border border-[#E3E1DC]", className)} {...props}>
        <div className="flex items-center gap-3 px-5 sm:px-6 pt-5 sm:pt-6 pb-4">
            <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center shrink-0", iconWrapperClassName)}>
                {icon}
            </div>
            <div>
                <h2 className="font-sans font-semibold text-base">{title}</h2>
                {description && (
                    <p className="text-xs text-slate-400 mt-0.5">
                        {description}
                    </p>
                )}
            </div>
        </div>
        <div className="px-5 sm:px-6 pb-6">
            {children}
        </div>
    </section>
  )
}
