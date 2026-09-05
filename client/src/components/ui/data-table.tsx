import type { Table as TableType, Row } from "@tanstack/react-table"
import { flexRender } from "@tanstack/react-table"
import { cn } from "@/lib/utils"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface DataTableProps<TData> {
  table: TableType<TData>
  isLoading?: boolean
  onRowClick?: (row: Row<TData>) => void
  striped?: boolean
  fixedHeight?: boolean
  className?: string
}

// Fixed pixel widths — never shrink below a readable size on mobile/tablet.
// Max-width keeps them proportional on wide columns.
const SKELETON_WIDTH_PATTERNS = [
  [{ min: 80, max: 140 }, { min: 56, max: 100 }, { min: 72, max: 120 }, { min: 48, max: 88 }, { min: 64, max: 110 }],
  [{ min: 56, max: 100 }, { min: 72, max: 130 }, { min: 56, max: 96 }, { min: 80, max: 140 }, { min: 48, max: 80 }],
  [{ min: 72, max: 120 }, { min: 48, max: 80 }, { min: 80, max: 140 }, { min: 56, max: 100 }, { min: 64, max: 112 }],
  [{ min: 56, max: 96 }, { min: 80, max: 140 }, { min: 48, max: 84 }, { min: 72, max: 120 }, { min: 56, max: 96 }],
  [{ min: 80, max: 140 }, { min: 56, max: 96 }, { min: 48, max: 80 }, { min: 80, max: 140 }, { min: 72, max: 120 }],
  [{ min: 48, max: 80 }, { min: 72, max: 120 }, { min: 56, max: 96 }, { min: 80, max: 140 }, { min: 56, max: 96 }],
  [{ min: 72, max: 120 }, { min: 56, max: 96 }, { min: 80, max: 140 }, { min: 48, max: 80 }, { min: 48, max: 84 }],
  [{ min: 56, max: 96 }, { min: 80, max: 140 }, { min: 72, max: 120 }, { min: 56, max: 96 }, { min: 80, max: 140 }],
] as const

function SkeletonCell({
  size,
  rowIndex,
  cellIndex,
}: {
  size: { min: number; max: number }
  rowIndex: number
  cellIndex: number
}) {
  const delay = `${(rowIndex * 0.06 + cellIndex * 0.04).toFixed(2)}s`

  return (
    <TableCell className="px-4 py-3.5 h-[56px]">
      <div
        className="relative overflow-hidden rounded-full bg-gray-100 dark:bg-zinc-800"
        style={{
          height: "14px",
          minWidth: `${size.min}px`,
          maxWidth: `${size.max}px`,
          width: "100%",
        }}
      >
        <span
          className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_ease-in-out_infinite]"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.55) 50%, transparent 100%)",
            animationDelay: delay,
          }}
        />
      </div>
    </TableCell>
  )
}

const shimmerStyle = (
  <style>{`
    @keyframes shimmer {
      0%   { transform: translateX(-100%); }
      100% { transform: translateX(200%); }
    }
  `}</style>
);

export function DataTable<TData>({
  table,
  isLoading,
  onRowClick,
  striped = true,
  fixedHeight = true,
  className,
}: DataTableProps<TData>) {
  const visibleColumnCount = table.getVisibleLeafColumns().length || table.getAllColumns().length
  const rows = table.getRowModel().rows

  const pageSize = table.getState().pagination?.pageSize || 10
  const pageIndex = table.getState().pagination?.pageIndex || 0
  const totalRows = table.getRowCount() ?? rows.length
  const pageCount = table.getPageCount() ?? 1

  // Fixed height applies only when data meets pagination limit (multiple pages, total rows >= pageSize, or pageIndex > 0)
  const isPaginated = Boolean(
    fixedHeight && (pageCount > 1 || totalRows >= pageSize || pageIndex > 0)
  )

  const emptyRowsCount = isPaginated && rows.length > 0 && rows.length < pageSize
    ? pageSize - rows.length
    : 0

  const skeletonRowCount = isPaginated
    ? pageSize
    : (totalRows > 0 ? Math.min(totalRows, pageSize) : Math.min(pageSize, 8))

  return (
    <>
      {shimmerStyle}

      <div
        className={cn("overflow-hidden border-b border-gray-100 dark:border-zinc-800", className)}
        style={isPaginated ? { minHeight: `${40 + pageSize * 56}px` } : undefined}
      >
        <Table>
          <TableHeader className="bg-gray-50/80 dark:bg-zinc-900/80">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="border-b border-gray-100 hover:bg-transparent dark:border-zinc-800"
              >
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="h-10 px-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-zinc-400"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {isLoading ? (
              Array.from({ length: skeletonRowCount }).map((_, rowIndex) => {
                const pattern = SKELETON_WIDTH_PATTERNS[rowIndex % SKELETON_WIDTH_PATTERNS.length];
                return (
                  <TableRow
                    key={rowIndex}
                    className={cn(
                      "h-[56px] border-b border-gray-100/70 hover:bg-transparent dark:border-zinc-800/70",
                      striped && rowIndex % 2 === 1 && "bg-slate-50/50 dark:bg-zinc-900/30"
                    )}
                    style={{ opacity: Math.max(0.35, 1 - rowIndex * 0.06) }}
                  >
                    {Array.from({ length: visibleColumnCount }).map((_, cellIndex) => (
                      <SkeletonCell
                        key={cellIndex}
                        size={pattern[cellIndex % pattern.length]}
                        rowIndex={rowIndex}
                        cellIndex={cellIndex}
                      />
                    ))}
                  </TableRow>
                );
              })
            ) : rows?.length ? (
              <>
                {rows.map((row, index) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className={cn(
                      "border-b border-gray-100/80 transition-colors duration-150 last:border-b-0 dark:border-zinc-800/80",
                      isPaginated && "h-[56px]",
                      striped && (index % 2 === 1
                        ? "bg-slate-50/70 dark:bg-zinc-900/40"
                        : "bg-transparent"),
                      "hover:bg-slate-100/70 dark:hover:bg-zinc-800/60",
                      "data-[state=selected]:bg-amber-500/10 dark:data-[state=selected]:bg-amber-500/15",
                      onRowClick && "cursor-pointer"
                    )}
                    onClick={(e) => {
                      if (!onRowClick) return;
                      const isInteractive = (e.target as HTMLElement).closest('button, a, input, [role="button"], [role="menuitem"], [data-prevent-row-click]');
                      if (isInteractive) return;
                      onRowClick(row);
                    }}
                  >
                    {row.getVisibleCells().map((cell) => {
                      const meta = cell.column.columnDef.meta as any;
                      const cellClass = typeof meta?.cellClassName === 'function'
                        ? meta.cellClassName(row.original)
                        : meta?.cellClassName;

                      return (
                        <TableCell
                          key={cell.id}
                          className={cn("px-4 py-3 text-sm text-gray-700 dark:text-zinc-300", cellClass)}
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      )
                    })}
                  </TableRow>
                ))}

                {emptyRowsCount > 0 &&
                  Array.from({ length: emptyRowsCount }).map((_, index) => {
                    const isEven = (rows.length + index) % 2 === 1;
                    return (
                      <TableRow
                        key={`empty-spacer-${index}`}
                        aria-hidden="true"
                        className={cn(
                          "h-[56px] border-b border-gray-100/50 dark:border-zinc-800/50 last:border-b-0 pointer-events-none select-none",
                          striped && isEven
                            ? "bg-slate-50/40 dark:bg-zinc-900/20"
                            : "bg-transparent"
                        )}
                      >
                        <TableCell
                          colSpan={visibleColumnCount}
                          className="h-[56px] p-0 border-0 select-none pointer-events-none"
                        >
                          <div className="h-[56px]" />
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </>
            ) : null}
          </TableBody>
        </Table>
      </div>
    </>
  )
}