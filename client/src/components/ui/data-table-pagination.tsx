"use client"

import type { Table as TableType } from "@tanstack/react-table"
import { ArrowLeft, ArrowRight } from "lucide-react"

interface DataTablePaginationProps<TData> {
  table: TableType<TData>
}

export function DataTablePagination<TData>({
  table,
}: DataTablePaginationProps<TData>) {
  const pageIndex = table.getState().pagination.pageIndex
  const pageCount = table.getPageCount()
  const pageSize = table.getState().pagination.pageSize
  const totalRows = table.getRowCount()

  const startRowIndex = totalRows === 0 ? 0 : pageIndex * pageSize + 1
  const endRowIndex = Math.min(totalRows, (pageIndex + 1) * pageSize)

  if (pageCount <= 1) return null

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between p-3 sm:p-4 gap-3 sm:gap-0">
      <div className="text-xs sm:text-sm text-gray-500 dark:text-zinc-400">
        Showing <span className="font-semibold text-gray-900 dark:text-zinc-200">{startRowIndex}–{endRowIndex}</span> of{" "}
        <span className="font-semibold text-gray-900 dark:text-zinc-200">{totalRows}</span>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="w-7 h-7 sm:w-8 sm:h-8 text-xs sm:text-sm rounded-sm border border-gray-200 bg-white flex items-center justify-center font-semibold text-gray-500 hover:bg-amber-400 hover:border-amber-400 hover:text-black disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-200 disabled:hover:text-gray-500 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-400"
        >
          <ArrowLeft size={16} strokeWidth={3} />
        </button>

        {Array.from({ length: pageCount }).map((_, idx) => {
          const isActive = idx === pageIndex
          return (
            <button
              key={idx}
              onClick={() => table.setPageIndex(idx)}
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-sm border flex items-center justify-center font-semibold text-xs sm:text-sm transition-colors ${isActive
                ? "bg-amber-400 border-amber-400 text-black font-bold"
                : "border-gray-200 bg-white text-gray-600 hover:bg-amber-400 hover:border-amber-400 hover:text-black dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-400"
                }`}
            >
              {idx + 1}
            </button>
          )
        })}

        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="w-7 h-7 sm:w-8 sm:h-8 text-xs sm:text-sm rounded-sm border border-gray-200 bg-white flex items-center justify-center font-semibold text-gray-500 hover:bg-amber-400 hover:border-amber-400 hover:text-black disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-200 disabled:hover:text-gray-500 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-400"
        >
          <ArrowRight size={16} strokeWidth={3} />
        </button>
      </div>
    </div>
  )
}
