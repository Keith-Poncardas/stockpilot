import * as React from "react"
import { Link } from "react-router-dom"
import { cn } from "@/lib/utils"

interface FormSectionLink {
  /** Internal route — renders a React Router <Link> */
  to?: string;
  /** External URL — renders a plain <a> with target="_blank" */
  href?: string;
  /** Link label. Defaults to "View details →" */
  linkText?: string;
}

interface FormSectionProps extends React.ComponentProps<"section"> {
  title: string;
  description?: string;
  icon: React.ReactNode;
  iconWrapperClassName?: string;
  children: React.ReactNode;
  /** Optional link rendered at the trailing end of the header row */
  link?: FormSectionLink;
}

export function FormSection({
  title,
  description,
  icon,
  iconWrapperClassName = "bg-blue-50 text-blue-600",
  children,
  className,
  link,
  ...props
}: FormSectionProps) {
  const linkLabel = link?.linkText ?? "View details →";

  const linkElement = link?.to ? (
    <Link
      to={link.to}
      className="ml-auto shrink-0 text-xs font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
    >
      {linkLabel}
    </Link>
  ) : link?.href ? (
    <a
      href={link.href}
      target="_blank"
      rel="noopener noreferrer"
      className="ml-auto shrink-0 text-xs font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
    >
      {linkLabel}
    </a>
  ) : null;

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
            {linkElement}
        </div>
        <div className="px-5 sm:px-6 pb-6">
            {children}
        </div>
    </section>
  )
}
