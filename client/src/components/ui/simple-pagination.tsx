import { ArrowLeft, ArrowRight } from "lucide-react"

interface SimplePaginationProps {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  /** Optional: label shown on the left side. Defaults to "Page X of Y" */
  label?: React.ReactNode
}

/**
 * A standalone pagination bar that mirrors the look of DataTablePagination
 * but works without a TanStack table instance.
 */
export function SimplePagination({
  page,
  totalPages,
  onPageChange,
  label,
}: SimplePaginationProps) {
  if (totalPages <= 1) return null

  const canPrev = page > 1
  const canNext = page < totalPages

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between p-3 sm:p-4 gap-3 sm:gap-0 border-t border-slate-100">
      <div className="text-xs sm:text-sm text-gray-500">
        {label ?? (
          <>
            Page{" "}
            <span className="font-semibold text-gray-900">{page}</span>
            {" "}of{" "}
            <span className="font-semibold text-gray-900">{totalPages}</span>
          </>
        )}
      </div>

      <div className="flex items-center gap-1">
        {/* Prev */}
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={!canPrev}
          className="w-7 h-7 sm:w-8 sm:h-8 text-xs sm:text-sm rounded-sm border border-gray-200 bg-white flex items-center justify-center font-semibold text-gray-500 hover:bg-amber-400 hover:border-amber-400 hover:text-black disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-200 disabled:hover:text-gray-500"
        >
          <ArrowLeft size={16} strokeWidth={3} />
        </button>

        {/* Page buttons with ellipsis */}
        {Array.from({ length: totalPages }).map((_, idx) => {
          const p = idx + 1
          const isActive = p === page
          const isVisible =
            p === 1 ||
            p === totalPages ||
            Math.abs(p - page) <= 1

          if (!isVisible) {
            if (p === 2 && page > 3) {
              return (
                <span key="ellipsis-start" className="w-7 sm:w-8 text-center text-xs text-gray-400">
                  …
                </span>
              )
            }
            if (p === totalPages - 1 && page < totalPages - 2) {
              return (
                <span key="ellipsis-end" className="w-7 sm:w-8 text-center text-xs text-gray-400">
                  …
                </span>
              )
            }
            return null
          }

          return (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              aria-label={`Go to page ${p}`}
              aria-current={isActive ? "page" : undefined}
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-sm border flex items-center justify-center font-semibold text-xs sm:text-sm transition-colors ${isActive
                  ? "bg-amber-400 border-amber-400 text-black font-bold"
                  : "border-gray-200 bg-white text-gray-600 hover:bg-amber-400 hover:border-amber-400 hover:text-black"
                }`}
            >
              {p}
            </button>
          )
        })}

        {/* Next */}
        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={!canNext}
          className="w-7 h-7 sm:w-8 sm:h-8 text-xs sm:text-sm rounded-sm border border-gray-200 bg-white flex items-center justify-center font-semibold text-gray-500 hover:bg-amber-400 hover:border-amber-400 hover:text-black disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-200 disabled:hover:text-gray-500"
        >
          <ArrowRight size={16} strokeWidth={3} />
        </button>
      </div>
    </div>
  )
}
